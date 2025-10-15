import Groq from 'groq-sdk';
import { config } from '../config/env.js';
import simitService from './simitService.js';
import ragService from '../rag/ragService.js';

// Modelo configurable (usa .env GROQ_MODEL o el valor por defecto 'groq/compound-mini')
const GROQ_MODEL = process.env.GROQ_MODEL || 'groq/compound-mini';

class GroqService {
  constructor() {
    this.client = new Groq({
      apiKey: config.groqApiKey,
    });
    this.conversationHistory = new Map();
  }

  // Extrae número de documento de un texto (6-10 dígitos)
  extractDocumentNumber(text) {
    if (!text || typeof text !== 'string') return null;
    const match = text.match(/\b(\d{6,10})\b/);
    return match ? match[1] : null;
  }


  async processMessage(message, conversationId = 'default') {
    try {
      // Obtener historial de conversación
      const history = this.conversationHistory.get(conversationId) || [];

      // Extraer número de cédula del mensaje (si existe) ANTES de llamar al modelo
      const documentNumber = this.extractDocumentNumber(message);
      let multasData = null;
      if (documentNumber) {
        try {
          multasData = await simitService.consultarMultas('cedula', documentNumber);
        } catch (err) {
          console.error('Error al consultar multas (pre-check):', err);
          // seguimos sin bloquear la conversación; multasData queda null y el modelo responderá normalmente
        }
      }

      // Buscar información relevante en el RAG
      const ragInfo = ragService.buscarInformacion(message);

      // Construir el prompt del sistema con contexto RAG
      const systemPrompt = this.buildSystemPrompt(ragInfo);

      // Si detectamos cédula, añadimos contexto concreto al mensaje del usuario para que la respuesta sea apropiada
      let userContent = message;
      if (documentNumber) {
        if (multasData && multasData.success && multasData.total > 0) {
          const multasContext = `${multasData.total} multa(s) encontrada(s):
${multasData.multas.map((m, i) => `${i + 1}. ${m.infraccion} - Valor: $${m.valor?.toLocaleString('es-CO')} - Estado: ${m.estado} - Fecha: ${m.fecha}`).join('\n')}

Valor total: $${multasData.valorTotal?.toLocaleString('es-CO')}`;
          userContent += `\n\nContexto (multas encontradas para ${documentNumber}):\n${multasContext}\n\nInstrucción: Presenta esta información de forma clara y concisa al usuario.`;
        } else if (multasData && multasData.success && multasData.total === 0) {
          // RESPUESTA CORTA: no dar la guía extensa si no hay multas
          userContent += `\n\nContexto: No se encontraron multas registradas para el documento ${documentNumber}.\nInstrucción: Responde con un mensaje breve confirmando que no hay multas y ofrece opciones (p. ej. "volver a consultar", "ingresar otra cédula", "más info sobre descuentos").`;
        } else {
          // En caso de error al consultar, indicamos que hubo un problema en la consulta
          userContent += `\n\nContexto: Hubo un problema al consultar las multas para ${documentNumber}. Instrucción: Informa brevemente el fallo y pide al usuario reintentar o confirmar el número.`;
        }
      }

      // Preparar mensajes para Groq
      const messages = [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...history,
        {
          role: 'user',
          content: userContent,
        },
      ];

      // Llamar a Groq (usar modelo configurable)
      const response = await this.client.chat.completions.create({
        model: GROQ_MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1500,
      });

      const assistantMessage = response.choices?.[0]?.message?.content || 'Lo siento, no pude generar una respuesta.';

      // Actualizar historial
      this.conversationHistory.set(conversationId, [
        ...history,
        { role: 'user', content: message },
        { role: 'assistant', content: assistantMessage },
      ].slice(-10)); // Mantener solo los últimos 10 mensajes

      return {
        message: assistantMessage,
        multas: multasData?.multas || null,
        total: multasData?.total || 0,
        valorTotal: multasData?.valorTotal || 0,
      };
    } catch (error) {
      console.error('Error en Groq Service:', error);

      // Detectar errores de modelo y devolver instrucción clara
      const apiCode = error?.error?.error?.code || error?.status || error?.statusCode || error?.code;
      if (apiCode === 'model_decommissioned' || apiCode === 'model_not_found') {
        return {
          message: `El modelo configurado (${GROQ_MODEL}) no está disponible: ${error?.error?.error?.message || error.message}. Actualiza .env con GROQ_MODEL=groq/compound-mini o usa otro modelo soportado por tu cuenta y reinicia el servidor.`,
          multas: null,
          total: 0,
          valorTotal: 0,
        };
      }
      
      // Mensaje de error amigable
      return {
        message: 'Lo siento, tuve un problema al procesar tu mensaje. ¿Podrías intentarlo de nuevo?',
        multas: null,
        total: 0,
        valorTotal: 0,
      };
    }
  }


  buildSystemPrompt(ragInfo) {
  let prompt = `Eres un asistente virtual especializado en multas de tránsito en Colombia. Tu nombre es FotoMultas Assistant.

TU OBJETIVO:
1. Ayudar a los usuarios a consultar sus multas de tránsito
2. Explicar los pasos para pagar multas SOLO cuando el usuario tenga multas confirmadas
3. Informar sobre descuentos disponibles SOLO si hay multas pendientes
4. Guiar sobre recursos legales y procedimientos
5. Responder preguntas generales sobre infracciones de tránsito

REGLAS CRÍTICAS - DEBES SEGUIRLAS SIEMPRE:
- ❌ NUNCA inventes o simules multas que no existen
- ❌ NUNCA crees tablas o listados de multas ficticias
- ❌ NUNCA des valores, fechas o lugares de multas si no los tienes confirmados
- ✅ SOLO habla de multas específicas cuando YO te las proporcione
- ✅ Si el usuario NO tiene multas, simplemente dile que no hay multas registradas
- ✅ Si el usuario pregunta por procedimientos sin tener multas, explica de forma general

FORMATO DE RESPUESTAS:

Cuando NO hay multas:
"¡Buenas noticias! 🎉 No encontré multas registradas con tu documento [NÚMERO]. 

Tu récord está limpio. ¿Hay algo más en lo que pueda ayudarte? Puedo explicarte:
- Cómo funciona el sistema SIMIT
- Qué hacer si recibes una multa en el futuro
- Información sobre tipos de infracciones"

Cuando SÍ hay multas:
"Encontré [CANTIDAD] multa(s) registrada(s) a tu nombre:

[AQUÍ LISTARÉ LAS MULTAS QUE YO TE PROPORCIONE]

¿Quieres saber cómo pagarlas o tienes alguna pregunta?"

INSTRUCCIONES ADICIONALES:
- Sé amable, empático y conversacional
- Usa emojis ocasionalmente (🚗, ✅, 💰, 📋)
- Si el usuario pregunta algo que no sabes, sé honesto
- Mantén las respuestas concisas (máximo 3-4 párrafos)

`;

  if (ragInfo.encontrado) {
    prompt += `\n\nINFORMACIÓN RELEVANTE DEL SISTEMA:\n${ragInfo.informacion}\n\n`;
    prompt += `Usa esta información para responder las preguntas del usuario SOLO cuando sea relevante.`;
  }

  return prompt;
}

  clearHistory(conversationId) {
    this.conversationHistory.delete(conversationId);
    console.log(`🧹 Historial limpiado para: ${conversationId}`);
  }
}

export default new GroqService();