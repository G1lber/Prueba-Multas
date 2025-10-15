import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import chatRoutes from './routes/chatRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middlewares
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger simple
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Fotomultas Chat API',
    version: '1.0.0',
    endpoints: {
      chat: '/api/chat',
      health: '/api/health',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use('/api/chat', chatRoutes);

// Error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
  });
});

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${config.nodeEnv}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log('=================================');
  
  // Validar configuración
  if (!config.anthropicApiKey) {
    console.warn('⚠️  ADVERTENCIA: ANTHROPIC_API_KEY no está configurada');
  }
  if (!config.apitudeApiKey) {
    console.warn('⚠️  ADVERTENCIA: APITUDE_API_KEY no está configurada (se usarán datos de ejemplo)');
  }
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});