# Fotomultas Chat - Backend

Backend del sistema de chat conversacional para consulta de fotomultas con IA.

## 🚀 Tecnologías

- Node.js + Express
- Groq Service (IA)
- MCP (Model Context Protocol)
- RAG (Retrieval Augmented Generation)
- SIMIT API (Apitude)

## 📦 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

Edita `.env` y agrega tus API keys:
- `ANTHROPIC_API_KEY`: Tu API key de Claude (obtén una en https://console.anthropic.com)
- `APITUDE_API_KEY`: Tu API key de Apitude (opcional para desarrollo)

3. Ejecutar en modo desarrollo:
```bash
npm run dev
```

4. Ejecutar en producción:
```bash
npm start
```

## 🔌 Endpoints

### Health Check
```
GET /api/health
```

### Chat
```
POST /api/chat
Body: { "message": "¿Tengo multas? Mi cédula es 1234567890" }
Response: {
  "success": true,
  "message": "Respuesta del asistente",
  "multas": [...],
  "total": 2,
  "valorTotal": 700000
}
```

### Limpiar historial
```
DELETE /api/chat/clear
```

## 🏗️ Arquitectura
```
Backend
├── MCP Server (Tools)
│   └── consultar_multas → SIMIT API
├── RAG System
│   └── Conocimiento sobre multas
├── Groq Service (IA)
│   └── Procesamiento conversacional
└── Express API
    └── Endpoints REST
```

## 🧪 Modo Desarrollo

En desarrollo, si no tienes API key de Apitude, el sistema usará datos de ejemplo:

- Cédula `1234567890`: Retorna 2 multas de ejemplo
- Cédula `9876543210`: Sin multas
- Otras cédulas: Sin multas

## 🔑 Obtener API Keys

### Claude (Anthropic)
1. Ir a https://console.anthropic.com
2. Crear una cuenta
3. Generar una API key en Settings > API Keys
4. Agregar créditos ($5 USD mínimo recomendado)

### Apitude (SIMIT)
1. Ir a https://apitude.co
2. Crear una cuenta
3. Solicitar acceso al servicio SIMIT
4. Obtener tu API key

## 📝 Notas

- El sistema usa Claude Sonnet 4 para procesamiento conversacional
- El RAG proporciona contexto sobre procedimientos de multas
- El MCP permite que Claude consulte SIMIT en tiempo real
- El historial de conversación se mantiene en memoria por sesión

## Ejemplos 
- Cédula      Escenario                       Multas
- 1234567890  Usuario con 2 multas pendientes 2 multas, $700,000
- 9876543210  Usuario sin multas              0 multas  
- 5555555555  Multa grave (conducir ebrio)    1 multa, $1,200,000
- 1111111111  Multa ya pagada                 1 multa pagada
- 7777777777  Usuario con muchas multas       3 multas, $1,500,000
- 3333333333  Multa por SOAT vencido          1 multa, $650,000