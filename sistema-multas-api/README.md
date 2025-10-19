# 🚦 API Sistema de Multas de Tránsito

API REST inteligente para consulta de multas de tránsito con agentes de IA usando LangChain, Groq y arquitectura Agent-to-Agent (A2A).

[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![LangChain](https://img.shields.io/badge/LangChain-0.1.0-blue)](https://python.langchain.com)
[![Groq](https://img.shields.io/badge/Groq-Llama3.1-orange)](https://groq.com)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 🌟 Características

- ✅ **API REST completa** con FastAPI
- 🤖 **Agentes de IA inteligentes** con LangChain
- 🔄 **Arquitectura A2A** (Agent-to-Agent) para clasificación automática
- 📚 **RAG** (Retrieval Augmented Generation) para normativas
- ⚡ **Groq LLM** - Súper rápido y gratuito
- 🗄️ **ChromaDB** para búsqueda vectorial
- 📖 **Documentación automática** con Swagger UI
- 🔒 **Seguro y escalable**

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐
│   Cliente HTTP  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│   FastAPI Endpoints     │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Coordinador A2A        │
│  (Clasificador)         │
└────┬──────────────┬─────┘
     │              │
     ▼              ▼
┌────────────┐  ┌────────────┐
│  Agente    │  │  Agente    │
│  Consultas │  │  Info/RAG  │
└─────┬──────┘  └─────┬──────┘
      │               │
      ▼               ▼
┌──────────┐    ┌──────────┐
│  Tools:  │    │ ChromaDB │
│ - Cámaras│    │ Vector   │
│ - Multas │    │ Store    │
│ - Cálc.  │    │          │
└──────────┘    └──────────┘
```

---

## 🚀 Inicio Rápido

### Prerrequisitos

```bash
Python 3.9+
pip
```

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/multas-api.git
cd multas-api

# 2. Crear entorno virtual
python -m venv venv

# Activar (Windows)
venv\Scripts\activate

# Activar (Linux/Mac)
source venv/bin/activate

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Configurar variables de entorno
cp .env.example .env
# Editar .env y agregar tu GROQ_API_KEY
```

### Ejecutar localmente

```bash
uvicorn main:app --reload --port 8000
```

Accede a:
- **API:** http://localhost:8000
- **Documentación:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health

---

## 📡 Endpoints

### 🏥 Health & Info

#### `GET /`
Información general de la API

**Response:**
```json
{
  "mensaje": "API Sistema de Multas de Tránsito",
  "version": "1.0.0",
  "docs": "/docs"
}
```

#### `GET /health`
Estado de salud del sistema

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-10-18T10:30:00",
  "sistema_inicializado": true
}
```

---

### 📸 Cámaras

#### `GET /camaras`
Lista todas las cámaras de fotodetección

**Query Parameters:**
- `estado` (opcional): `activa` | `mantenimiento`

**Response:**
```json
{
  "success": true,
  "data": {
    "camaras": {
      "CAM001": {
        "ubicacion": "Av. Principal km 5",
        "estado": "activa",
        "tipo": "velocidad",
        "coordenadas": "4.6097,-74.0817"
      }
    },
    "total": 5
  },
  "message": "Se encontraron 5 cámaras"
}
```

#### `GET /camaras/{codigo}`
Detalle de una cámara específica

**Response:**
```json
{
  "success": true,
  "data": {
    "camara": {
      "ubicacion": "Av. Principal km 5",
      "estado": "activa",
      "tipo": "velocidad",
      "coordenadas": "4.6097,-74.0817"
    }
  }
}
```

---

### 🚨 Multas

#### `POST /multas/consultar`
Consulta las multas de un usuario

**Request Body:**
```json
{
  "cedula": "CC123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "multas": [
      {
        "id": "M001",
        "fecha": "2024-10-01",
        "tipo": "Exceso velocidad",
        "monto": 250000,
        "estado": "pendiente",
        "camara": "CAM001"
      }
    ],
    "total_multas": 2,
    "total_pendiente": 650000,
    "cedula": "CC123456"
  }
}
```

#### `POST /multas/calcular-descuento`
Calcula el descuento aplicable

**Request Body:**
```json
{
  "monto": 250000,
  "dias": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "monto_original": 250000,
    "dias": 5,
    "descuento_porcentaje": 50,
    "descuento_monto": 125000,
    "monto_final": 125000
  },
  "message": "Descuento calculado: 50%"
}
```

---

### 🤖 Agentes Inteligentes

#### `POST /consulta`
Consulta general procesada por agentes de IA (A2A)

**Request Body:**
```json
{
  "pregunta": "¿Cómo puedo pagar mis multas?",
  "cedula": "CC123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "respuesta": "Puedes pagar tus multas a través de:\n1. Portal web oficial: www.pagomultas.gov.co\n2. Bancos autorizados\n3. PSE\n4. Oficinas de tránsito\n\nDescuentos disponibles:\n- 50% si pagas en los primeros 5 días\n- 25% si pagas dentro de 30 días",
    "tipo_agente_usado": "INFORMACION",
    "cedula": "CC123456"
  },
  "message": "Consulta procesada exitosamente"
}
```

**Ejemplos de preguntas:**
- "¿Qué cámaras están activas?"
- "Consulta mis multas, cédula CC123456"
- "¿Cómo puedo impugnar una multa?"
- "¿Cuánto pagaría si pago en 3 días una multa de 250000?"

---

### 📚 Normativas

#### `GET /normativas`
Obtiene información sobre normativas de tránsito

**Query Parameters:**
- `tipo` (opcional): Tipo de normativa a buscar

**Response:**
```json
{
  "success": true,
  "data": {
    "normativas": [
      "NORMATIVA DE MULTAS DE TRÁNSITO - Artículo 1..."
    ],
    "total": 4
  }
}
```

---

## 🧪 Testing

### Con cURL

```bash
# Health check
curl http://localhost:8000/health

# Listar cámaras
curl http://localhost:8000/camaras

# Consultar multas
curl -X POST http://localhost:8000/multas/consultar \
  -H "Content-Type: application/json" \
  -d '{"cedula": "CC123456"}'

# Consulta con agente
curl -X POST http://localhost:8000/consulta \
  -H "Content-Type: application/json" \
  -d '{"pregunta": "¿Qué cámaras están activas?"}'
```

### Con Python

```python
import requests

BASE_URL = "http://localhost:8000"

# Consultar multas
response = requests.post(
    f"{BASE_URL}/multas/consultar",
    json={"cedula": "CC123456"}
)
print(response.json())

# Consulta con agente
response = requests.post(
    f"{BASE_URL}/consulta",
    json={"pregunta": "¿Cómo pago mis multas?"}
)
print(response.json())
```

### Tests automatizados

```bash
python test_api.py
```

---

## 🌐 Despliegue

### Render.com (Recomendado - GRATIS)

1. Push tu código a GitHub
2. Conecta Render con tu repositorio
3. Agrega variable `GROQ_API_KEY`
4. Deploy automático

**URL:** `https://tu-app.onrender.com`

### Railway.app

```bash
railway login
railway init
railway up
```

### Fly.io

```bash
fly launch
fly secrets set GROQ_API_KEY=tu_key
fly deploy
```

---

## 🔐 Seguridad

### Variables de entorno

```bash
GROQ_API_KEY=tu_key_aqui  # OBLIGATORIO
API_TOKEN=token_secreto    # Opcional para autenticación
PORT=8000                  # Puerto del servidor
```

### Autenticación (Opcional)

Agrega header `X-API-Key` en tus requests:

```bash
curl -H "X-API-Key: tu_token" http://localhost:8000/consulta
```

---

## 🏗️ Tecnologías utilizadas

| Tecnología | Uso |
|------------|-----|
| **FastAPI** | Framework web |
| **LangChain** | Orquestación de agentes |
| **Groq** | LLM ultra-rápido (Llama 3.1) |
| **ChromaDB** | Base de datos vectorial |
| **HuggingFace** | Embeddings multilingües |
| **Pydantic** | Validación de datos |
| **Uvicorn** | Servidor ASGI |

---

## 📊 Cómo funciona el sistema A2A

1. **Cliente envía consulta** → API recibe request
2. **Coordinador clasifica** → Determina tipo de consulta
3. **Selecciona agente:**
   - **Agente Consultas:** Para cámaras, multas, cálculos
   - **Agente Información:** Para normativas, procedimientos (usa RAG)
4. **Agente procesa** → Usa sus herramientas especializadas
5. **Retorna respuesta** → JSON estructurado al cliente

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 👨‍💻 Autor

Tu Nombre - G1lber

---

## 🙏 Agradecimientos

- **Anthropic** por Claude
- **Groq** por su API gratuita y rápida
- **LangChain** por el framework
- **FastAPI** por la excelente documentación

---


---

**⭐ Si te gusta este proyecto, dale una estrella en GitHub!**