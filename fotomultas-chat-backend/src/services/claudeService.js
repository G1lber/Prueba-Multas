import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/env.js';
import { simitTool } from '../mcp/tools/simitTool.js';
import ragService from '../rag/ragService.js';
import simitService from './simitService.js';

class ClaudeService {
  constructor() {
    this.client = new Anthropic({
      apiKey: config.anthropicApiKey,
    });
    this.conversationHistory = new Map();
  }

  async processMessage(message, conversationId = 'default') {
    try {
      // Obtener historial de conversación
      const history = this.conversationHistory.get(conversationId) || [];

      // Extraer número de cédula del mensaje si existe
      const documentNumber = simitService.extractDocumentNumber(message);

      // Buscar información relevante en el RAG
      const ragInfo = ragService.buscarInformacion(message);

      // Construir el prompt del sistema con contexto RAG
      const systemPrompt = this.buildSystemPrompt(ragInfo);

      // Preparar mensajes
      const messages = [
        ...history,
        {
          role: 'user',
          content: message,
        },
      ];

      // Llamar a Claude con herramientas MCP
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2024,
        system: systemPrompt,
        messages: messages,
        tools: [
          {
            name: simitTool.name,
            description: simitTool.description,
            input_schema: simitTool.input_schema,
          },
        ],
      });

      // Procesar la respuesta de Claude
      let finalResponse = '';
      let multasData = null;

      for (const block of response.content) {
        if (block.type === 'text') {
          finalResponse += block.text;
        } else if (block.type === 'tool_use' && block.name === 'consultar_multas') {
          // Claude decidió usar la herramienta de consulta
          const toolResult = await simitTool.execute(block.input);
          multasData = toolResult;

          // Llamar a Claude de nuevo con el resultado de la herramienta
          const followUpResponse = await this.client.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2024,
            system: systemPrompt,
            messages: [
              ...messages,
              {
                role: 'assistant',
                content: response.content,
              },
              {
                role: 'user',
                content: [
                  {
                    type: 'tool_result',
                    tool_use_id: block.id,
                    content: JSON.stringify(toolResult),
                  },
                ],
              },
            ],
          });

          // Extraer respuesta final
          for (const followUpBlock of followUpResponse.content) {
            if (followUpBlock.type === 'text') {
              finalResponse += followUpBlock.text;
            }
          }
        }
      }

      // Si se detectó un número de cédula pero Claude no usó la herramienta
      if (documentNumber && !multasData) {
        multasData = await simitTool.execute({ document_number: documentNumber });
        
        if (multasData.success && multasData.total > 0) {
          finalResponse += `\n\nEncontré ${multasData.total} multa(s) registrada(s) a tu nombre. A continuación te muestro los detalles:`;
        } else {
          finalResponse += `\n\n¡Buenas noticias! No encontré multas registradas con el documento ${documentNumber}.`;
        }
      }

      // Actualizar historial
      this.conversationHistory.set(conversationId, [
        ...messages,
        {
          role: 'assistant',
          content: finalResponse,
        },
      ]);

      return {
        message: finalResponse,
        multas: multasData?.multas || null,
        total: multasData?.total || 0,
        valorTotal: multasData?.valorTotal || 0,
      };
    } catch (error) {
      console.error('Error en Claude Service:', error);
      throw new Error('Error al procesar el mensaje con Claude');
    }
  }

  buildSystemPrompt(ragInfo) {
    let prompt = `Eres un asistente virtual especializado en multas de tránsito en Colombia. Tu objetivo es ayudar a los usuarios a:

1. Consultar sus multas de tránsito en el sistema SIMIT
2. Explicar los pasos para pagar multas
3. Informar sobre descuentos disponibles
4. Guiar sobre recursos legales
5. Responder preguntas sobre infracciones de tránsito

IMPORTANTE:
- Si el usuario menciona un número de cédula, usa la herramienta "consultar_multas" para buscar sus multas
- Sé amable y conversacional
- Proporciona información clara y paso a paso
- Si encuentras multas, explica claramente cada una
- Ofrece información sobre opciones de pago y descuentos

`;

    if (ragInfo.encontrado) {
      prompt += `\n\nINFORMACIÓN RELEVANTE:\n${ragInfo.informacion}\n\n`;
      prompt += `Usa esta información para responder las preguntas del usuario de forma natural y conversacional.`;
    }

    return prompt;
  }

  clearHistory(conversationId) {
    this.conversationHistory.delete(conversationId);
  }
}

export default new ClaudeService();