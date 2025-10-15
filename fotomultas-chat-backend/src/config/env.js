import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  groqApiKey: process.env.GROQ_API_KEY,
  apitudeApiKey: process.env.APITUDE_API_KEY,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};