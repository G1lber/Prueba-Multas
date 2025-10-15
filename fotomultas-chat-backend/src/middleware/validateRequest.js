export const validateMessage = (req, res, next) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'El mensaje es requerido y debe ser un texto válido',
    });
  }

  if (message.length > 1000) {
    return res.status(400).json({
      success: false,
      error: 'El mensaje es demasiado largo (máximo 1000 caracteres)',
    });
  }

  next();
};