## Prueba-backend-Multas

# FotoMultas Chat — Frontend + Backend

Proyecto: sistema de chat conversacional para consulta de fotomultas en Colombia.  
Estructura principal:
- fotomultas-chat-backend/ — API (Node.js + Express, Groq, RAG, SIMIT mock/APITUDE)
- fotomultas-chat-frontend/ — Cliente (React + Vite)

---

## Resumen
FotoMultas Chat permite a usuarios consultar multas (SIMIT) mediante una interfaz de chat asistida por modelos de IA. El backend orquesta llamadas a la API de SIMIT (o mocks de desarrollo), RAG para contexto y Groq para generación de lenguaje. El frontend consume la API y muestra resultados.

---

## Requisitos
- Node.js 18+ (recomendado)
- npm
- Cuenta Groq (opcional para IA real) y/o claves de prueba
- (Opcional) Apitude / SIMIT API key para consultas reales

---

## Instalación rápida

1. Clonar repo
2. Instalar dependencias (en ambas carpetas)

Backend:
```bash
cd fotomultas-chat-backend
npm install
```

Frontend:
```bash
cd fotomultas-chat-frontend
npm install
```

---

## Variables de entorno (ejemplos)

Backend (.env en fotomultas-chat-backend):
GROQ y SIMIT/APITUDE según cuenta:
```
PORT=3000
NODE_ENV=development
GROQ_API_KEY=tu_groq_api_key
GROQ_MODEL=groq/compound-mini
GROQ_BUDGET_MONTHLY=100
GROQ_COST_PER_CALL=0.01
GROQ_RPS=6
GROQ_DAILY_LIMIT=500
GROQ_RPS_WINDOW_MS=60000

GROQ_API_KEY=...
APITUDE_API_KEY=...
GROQ_MODEL=groq/compound-mini
FRONTEND_URL=http://localhost:5173
```

Frontend (.env en fotomultas-chat-frontend):
```
VITE_API_URL=http://localhost:3000/api
```

---

## Ejecutar en desarrollo

Backend:
```bash
cd fotomultas-chat-backend
npm run dev
```

Frontend:
```bash
cd fotomultas-chat-frontend
npm run dev
```

---

## Endpoints principales (Backend)

- GET /api/health — estado
- POST /api/chat — { message } → { success, message, multas?, total, valorTotal }
- DELETE /api/chat/clear — limpiar historial (si implementado)
- POST /api/multas/consultar — { documentType, documentNumber } → { multas }

Formato de ejemplo de respuesta del chat:
```json
{
  "success": true,
  "message": "Respuesta del asistente",
  "multas": [...],
  "total": 2,
  "valorTotal": 700000
}
```

---

## Comportamiento en modo desarrollo
Si no hay Apitude/SIMIT configurado, el backend usa datos de ejemplo:
- 1234567890 → 2 multas (ejemplo)
- 9876543210 → sin multas
- 5555555555, 1111111111, 7777777777, 3333333333 → otros escenarios de prueba

---

## Buenas prácticas y control de costes (plan gratuito Groq)
- Configura GROQ_MODEL según modelos accesibles en tu cuenta.
- Implementa límites: rate limit y cuota diaria (ej. middleware groqLimit).
- Monitoriza uso en https://console.groq.com → Billing / Usage.

---

## Troubleshooting rápido
- Error "model_not_found" o "model_decommissioned": actualiza GROQ_MODEL en .env a un modelo disponible.
- Error "Cannot find module ... index.js": revisa package.json.scripts y rutas.
- Si no detecta números de documento, revisar la función extractDocumentNumber en el backend.

---

## Desarrollo y contribución
- Mantener historial en memoria solo para desarrollo; para producción usar store persistente.
- Añadir tests unitarios para servicios (simitService, groqService, ragService).
- Crear .env.example con keys de ejemplo y añadir .gitignore.

