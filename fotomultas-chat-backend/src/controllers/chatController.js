import groqService from '../services/groqService.js';

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'El mensaje es requerido',
      });
    }

    // Generar un ID de conversación basado en la sesión o IP
    const conversationId = req.ip || 'default';

    console.log(`📨 Mensaje recibido: "${message.substring(0, 50)}..."`);

    const response = await groqService.processMessage(message, conversationId);

    res.json({
      success: true,
      ...response,
    });
  } catch (error) {
    console.error('Error en chatController:', error);
    res.status(500).json({
      success: false,
      error: 'Error al procesar el mensaje',
      message: 'Hubo un problema al procesar tu solicitud. Por favor intenta de nuevo.',
    });
  }
};

export const clearChat = async (req, res) => {
  try {
    const conversationId = req.ip || 'default';
    groqService.clearHistory(conversationId);

    res.json({
      success: true,
      message: 'Historial limpiado',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al limpiar el historial',
    });
  }
};