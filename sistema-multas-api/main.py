"""
API REST para Sistema de Multas de Tránsito
Con FastAPI + LangChain + Groq + RAG + A2A
"""

# pip install fastapi uvicorn langchain langchain-groq langchain-community chromadb sentence-transformers python-dotenv

from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, constr, conint, confloat
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv
from datetime import datetime
import logging
import re

from langchain_groq import ChatGroq
from langchain.agents import AgentExecutor, create_react_agent
from langchain.tools import Tool
from langchain.prompts import PromptTemplate
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Cargar variables de entorno
load_dotenv()

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============================================
# CONFIGURACIÓN DE LA API
# ============================================

app = FastAPI(
    title="API Sistema de Multas de Tránsito",
    description="API con LangChain, Groq y arquitectura Agent-to-Agent (A2A)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS para permitir peticiones desde otros backends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# MODELOS PYDANTIC (Para validación)
# ============================================

class ConsultaRequest(BaseModel):
    """Modelo para consultas generales al sistema"""
    pregunta: str = Field(..., description="Pregunta o consulta del usuario")
    cedula: Optional[constr(strip_whitespace=True, min_length=6, max_length=16)] = Field(
        None, description="Cédula opcional (puede venir con prefijo 'CC' o solo dígitos)"
    )


class ConsultaMultasRequest(BaseModel):
    """Request para consultar multas por cédula (estructurado)"""
    cedula: constr(strip_whitespace=True, min_length=6, max_length=16) = Field(
        ..., description="Cédula del usuario (ej: CC12345678 o 12345678)"
    )


class CalculoDescuentoRequest(BaseModel):
    """Request para calcular descuento sobre una multa"""
    monto: confloat(gt=0) = Field(..., description="Monto original de la multa (mayor que 0)")
    dias: conint(ge=0) = Field(..., description="Días desde la notificación (entero, >= 0)")


class ConsultaResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    message: str
    timestamp: str

# ============================================
# BASE DE DATOS SIMULADA
# ============================================

CAMARAS_ACTIVAS = {
    "CAM001": {"ubicacion": "Av. Principal km 5", "estado": "activa", "tipo": "velocidad", "coordenadas": "4.6097,-74.0817"},
    "CAM002": {"ubicacion": "Calle 50 con Carrera 10", "estado": "activa", "tipo": "semáforo", "coordenadas": "4.6351,-74.0703"},
    "CAM003": {"ubicacion": "Autopista Norte km 12", "estado": "mantenimiento", "tipo": "velocidad", "coordenadas": "4.7110,-74.0721"},
    "CAM004": {"ubicacion": "Centro - Plaza Mayor", "estado": "activa", "tipo": "estacionamiento", "coordenadas": "4.5981,-74.0758"},
    "CAM005": {"ubicacion": "Zona Escolar Colegio San José", "estado": "activa", "tipo": "velocidad", "coordenadas": "4.6234,-74.0644"},
}

MULTAS_USUARIOS = {
    "CC123456": [
        {
            "id": "M001",
            "fecha": "2024-10-01",
            "tipo": "Exceso velocidad",
            "monto": 250000,
            "estado": "pendiente",
            "camara": "CAM001",
            "velocidad_registrada": "85 km/h",
            "velocidad_permitida": "60 km/h"
        },
        {
            "id": "M002",
            "fecha": "2024-09-15",
            "tipo": "Semáforo en rojo",
            "monto": 400000,
            "estado": "pendiente",
            "camara": "CAM002"
        },
    ],
    "CC789012": [
        {
            "id": "M003",
            "fecha": "2024-10-10",
            "tipo": "Estacionamiento prohibido",
            "monto": 150000,
            "estado": "pagada",
            "camara": "CAM004",
            "fecha_pago": "2024-10-12"
        },
    ],
    "CC345678": []
}

DOCUMENTOS_NORMATIVAS = [
    """
    NORMATIVA DE MULTAS DE TRÁNSITO - Artículo 1
    Las multas por exceso de velocidad se clasifican según el porcentaje de exceso:
    - Hasta 20% de exceso: $250,000 COP
    - Entre 20% y 40%: $400,000 COP
    - Más de 40%: $600,000 COP y suspensión de licencia por 3 meses
    """,
    """
    NORMATIVA DE MULTAS DE TRÁNSITO - Artículo 2
    Pasar un semáforo en rojo tiene una multa de $400,000 COP y 4 puntos en la licencia.
    El estacionamiento en zona prohibida tiene multa de $150,000 COP.
    """,
    """
    MÉTODOS DE PAGO DE MULTAS
    Puedes pagar tus multas a través de:
    1. Portal web oficial: www.pagomultas.gov.co
    2. Bancos autorizados: Banco Nacional, Banco del Estado
    3. PSE (Pago Seguro en Línea)
    4. Oficinas de tránsito presencialmente
    
    Descuentos disponibles:
    - Pago dentro de los primeros 5 días: 50% de descuento
    - Pago dentro de los 30 días: 25% de descuento
    """,
    """
    PROCESO DE IMPUGNACIÓN
    Si consideras que la multa es injusta, puedes impugnarla:
    1. Tienes 20 días hábiles desde la notificación
    2. Presenta el recurso en línea o presencialmente
    3. Adjunta pruebas (fotos, videos, testigos)
    4. La respuesta se emite en máximo 30 días hábiles
    """,
]

# ============================================
# INICIALIZACIÓN DEL SISTEMA
# ============================================

class SistemaMultas:
    """Singleton para mantener una sola instancia del sistema"""
    _instance = None
    _initialized = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not self._initialized:
            self.setup()
            SistemaMultas._initialized = True
    
    def setup(self):
        """Inicializa todos los componentes"""
        try:
            # Obtener API key
            groq_api_key = os.getenv("GROQ_API_KEY")
            if not groq_api_key:
                raise ValueError("GROQ_API_KEY no encontrada en variables de entorno")
            
            # Inicializar LLM
            self.llm = ChatGroq(
                groq_api_key=groq_api_key,
                model_name="llama-3.1-70b-versatile",
                temperature=0.1
            )
            
            # Setup RAG
            self.retriever = self._setup_rag()
            
            # Crear agentes
            self.agente_consultas = self._crear_agente_consultas()
            self.agente_informacion = self._crear_agente_informacion()
            
            logger.info("✅ Sistema inicializado correctamente")
            
        except Exception as e:
            logger.error(f"❌ Error al inicializar sistema: {e}")
            raise
    
    def _setup_rag(self):
        """Configura el sistema RAG"""
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
        )
        
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50
        )
        
        docs = text_splitter.create_documents(DOCUMENTOS_NORMATIVAS)
        
        vectorstore = Chroma.from_documents(
            documents=docs,
            embedding=embeddings,
            persist_directory="./chroma_db"
        )
        
        return vectorstore.as_retriever(search_kwargs={"k": 2})
    
    def _consultar_camaras(self, query: str) -> str:
        """Consulta el estado de las cámaras"""
        if "todas" in query.lower() or "activas" in query.lower():
            activas = [
                f"{k}: {v['ubicacion']} ({v['tipo']}, {v['coordenadas']})" 
                for k, v in CAMARAS_ACTIVAS.items() 
                if v['estado'] == 'activa'
            ]
            return f"Cámaras activas:\n" + "\n".join(activas)
        
        for codigo, info in CAMARAS_ACTIVAS.items():
            if codigo in query.upper():
                return f"Cámara {codigo}: {info['ubicacion']}, Estado: {info['estado']}, Tipo: {info['tipo']}, Coordenadas: {info['coordenadas']}"

        return "No se encontraron cámaras con ese criterio"
    
    def _consultar_multas(self, cedula: str) -> str:
        """Consulta las multas de un usuario"""
        cedula = cedula.strip().replace(" ", "")
        
        if cedula not in MULTAS_USUARIOS:
            return f"No se encontraron multas para la cédula {cedula}"
        
        multas = MULTAS_USUARIOS[cedula]
        
        if not multas:
            return f"El usuario con cédula {cedula} no tiene multas registradas"
        
        resultado = f"Multas para cédula {cedula}:\n"
        total = 0
        for multa in multas:
            resultado += f"\n- ID: {multa['id']}, Fecha: {multa['fecha']}, "
            resultado += f"Tipo: {multa['tipo']}, Monto: ${multa['monto']:,}, "
            resultado += f"Estado: {multa['estado']}, Cámara: {multa['camara']}"
            if multa['estado'] == 'pendiente':
                total += multa['monto']
        
        if total > 0:
            resultado += f"\n\nTotal pendiente: ${total:,} COP"
        
        return resultado
    
    def _calcular_descuento(self, monto: str, dias: str) -> str:
        """Calcula el descuento aplicable"""
        try:
            monto_num = float(str(monto).replace(",", "").replace("$", ""))
            dias_num = int(dias)
            
            if dias_num <= 5:
                monto_final = monto_num * 0.50
                return f"Pago en {dias_num} días: 50% descuento. Pagarías ${monto_final:,.0f} en lugar de ${monto_num:,.0f}"
            elif dias_num <= 30:
                monto_final = monto_num * 0.75
                return f"Pago en {dias_num} días: 25% descuento. Pagarías ${monto_final:,.0f} en lugar de ${monto_num:,.0f}"
            else:
                return f"Después de 30 días no hay descuento. Debes pagar ${monto_num:,.0f}"
        except Exception as e:
            return f"Error al calcular descuento: {e}"
    
    def _crear_agente_consultas(self):
        """Crea el agente de consultas"""
        tools = [
            Tool(
                name="ConsultarCamaras",
                func=self._consultar_camaras,
                description="Consulta información sobre cámaras de fotodetección"
            ),
            Tool(
                name="ConsultarMultas",
                func=self._consultar_multas,
                description="Consulta las multas de un usuario por cédula"
            ),
            Tool(
                name="CalcularDescuento",
                func=self._calcular_descuento,
                description="Calcula el descuento aplicable. Formato: monto, días"
            ),
        ]
        
        template = """Eres un asistente de consultas de tránsito.
        
        Herramientas: {tools}
        Nombres: {tool_names}
        
        Formato:
        Question: {input}
        Thought: qué herramienta usar
        Action: [{tool_names}]
        Action Input: input
        Observation: resultado
        Thought: respuesta final
        Final Answer: respuesta en español
        
        {agent_scratchpad}"""
        
        prompt = PromptTemplate.from_template(template)
        agent = create_react_agent(self.llm, tools, prompt)
        
        return AgentExecutor(
            agent=agent,
            tools=tools,
            verbose=True,
            handle_parsing_errors=True,
            max_iterations=3
        )
    
    def _crear_agente_informacion(self):
        """Crea el agente de información"""
        def buscar_normativa(query: str) -> str:
            docs = self.retriever.get_relevant_documents(query)
            contexto = "\n\n".join([doc.page_content for doc in docs])
            
            prompt = f"""Basándote en la información, responde:
            
            Información: {contexto}
            Pregunta: {query}
            
            Respuesta concisa:"""
            
            respuesta = self.llm.invoke(prompt)
            return respuesta.content
        
        tools = [
            Tool(
                name="BuscarNormativa",
                func=buscar_normativa,
                description="Busca información sobre normativas y métodos de pago"
            ),
        ]
        
        template = """Eres un asistente de normativas de tránsito.
        
        Herramientas: {tools}
        Nombres: {tool_names}
        
        Question: {input}
        Thought: buscar información
        Action: BuscarNormativa
        Action Input: consulta
        Observation: resultado
        Thought: responder
        Final Answer: respuesta
        
        {agent_scratchpad}"""
        
        # declarar explícitamente las variables para evitar errores de validación
        prompt = PromptTemplate(template=template, input_variables=["input", "agent_scratchpad", "tools", "tool_names"])
        agent = create_react_agent(self.llm, tools, prompt)
        
        return AgentExecutor(
            agent=agent,
            tools=tools,
            verbose=True,
            handle_parsing_errors=True,
            max_iterations=3
        )
    
    def clasificar_consulta(self, query: str) -> str:
        """Clasifica la consulta para dirigirla al agente correcto"""
        prompt = f"""Clasifica en: CONSULTA o INFORMACION
        
        CONSULTA: cámaras, multas específicas, calcular descuentos
        INFORMACION: normativas, cómo pagar, impugnación
        
        Query: {query}
        
        Responde solo: CONSULTA o INFORMACION"""
        
        respuesta = self.llm.invoke(prompt)
        return respuesta.content.strip().upper()
    
    def procesar(self, query: str) -> dict:
        """Procesa la consulta con el agente apropiado"""
        try:
            tipo = self.clasificar_consulta(query)
            logger.info(f"Tipo detectado: {tipo}")
            
            if "CONSULTA" in tipo:
                resultado = self.agente_consultas.invoke({"input": query})
            else:
                resultado = self.agente_informacion.invoke({"input": query})
            
            return {
                "respuesta": resultado['output'],
                "tipo_agente": tipo,
                "exitoso": True
            }
        except Exception as e:
            logger.error(f"Error al procesar consulta: {e}")
            return {
                "respuesta": f"Error al procesar: {str(e)}",
                "tipo_agente": "ERROR",
                "exitoso": False
            }

# Inicializar sistema al arrancar la API
sistema = None

@app.on_event("startup")
async def startup_event():
    """Se ejecuta al iniciar la API"""
    global sistema
    try:
        logger.info("🚀 Iniciando API...")
        sistema = SistemaMultas()
        logger.info("✅ API lista para recibir peticiones")
    except Exception as e:
        logger.error(f"❌ Error fatal al iniciar: {e}")
        raise

# ============================================
# ENDPOINTS DE LA API
# ============================================

@app.get("/")
async def root():
    """Endpoint raíz con información de la API"""
    return {
        "mensaje": "API Sistema de Multas de Tránsito",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
async def health_check():
    """Verificar estado de la API"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "sistema_inicializado": sistema is not None
    }

@app.post("/consulta", response_model=ConsultaResponse)
async def consulta_general(request: ConsultaRequest):
    """
    Endpoint principal para consultas generales al sistema.
    Usa arquitectura A2A para dirigir a agente apropiado.
    Si se detecta cédula en el body o en el texto, responde de forma determinista
    usando la base simulada (evita invocar al LLM cuando no es necesario).
    """
    try:
        if not sistema:
            raise HTTPException(status_code=503, detail="Sistema no inicializado")
        
        # Extrae cédula del body o del texto (6-12 dígitos). Normaliza con prefijo CC.
        def extraer_cedula(text: str) -> Optional[str]:
            if not text:
                return None
            m = re.search(r"\b(?:CC)?\s*([0-9]{6,12})\b", text, re.IGNORECASE)
            return m.group(1) if m else None
        
        raw = (request.cedula or "").strip()
        if not raw:
            raw = extraer_cedula(request.pregunta) or ""
        
        if raw:
            # Normalizar: prefijo CC + dígitos
            digits = re.sub(r"\D", "", raw)
            cedula = f"CC{digits}"
            
            # Reutilizar la lógica de /multas/consultar
            if cedula not in MULTAS_USUARIOS:
                return ConsultaResponse(
                    success=True,
                    data={
                        "multas": [],
                        "total_multas": 0,
                        "total_pendiente": 0,
                        "cedula": cedula
                    },
                    message=f"No se encontraron multas para cédula {cedula}",
                    timestamp=datetime.now().isoformat()
                )
            
            multas = MULTAS_USUARIOS[cedula]
            total_pendiente = sum(m['monto'] for m in multas if m['estado'] == 'pendiente')
            
            return ConsultaResponse(
                success=True,
                data={
                    "multas": multas,
                    "total_multas": len(multas),
                    "total_pendiente": total_pendiente,
                    "cedula": cedula
                },
                message=f"Se encontraron {len(multas)} multas",
                timestamp=datetime.now().isoformat()
            )
        
        # Si no hay cédula, usar el flujo A2A (LLM + agentes)
        resultado = sistema.procesar(request.pregunta)
        
        return ConsultaResponse(
            success=resultado['exitoso'],
            data={
                "respuesta": resultado['respuesta'],
                "tipo_agente_usado": resultado['tipo_agente'],
                "cedula": request.cedula
            },
            message="Consulta procesada exitosamente",
            timestamp=datetime.now().isoformat()
        )
    
    except Exception as e:
        logger.error(f"Error en /consulta: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/camaras")
async def listar_camaras(estado: Optional[str] = None):
    """Lista todas las cámaras, opcionalmente filtradas por estado"""
    try:
        camaras = CAMARAS_ACTIVAS
        
        if estado:
            camaras = {k: v for k, v in camaras.items() if v['estado'] == estado}
        
        return ConsultaResponse(
            success=True,
            data={
                "camaras": camaras,
                "total": len(camaras)
            },
            message=f"Se encontraron {len(camaras)} cámaras",
            timestamp=datetime.now().isoformat()
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/camaras/{codigo}")
async def obtener_camara(codigo: str):
    """Obtiene información detallada de una cámara específica"""
    codigo = codigo.upper()
    
    if codigo not in CAMARAS_ACTIVAS:
        raise HTTPException(status_code=404, detail=f"Cámara {codigo} no encontrada")
    
    return ConsultaResponse(
        success=True,
        data={"camara": CAMARAS_ACTIVAS[codigo]},
        message=f"Información de cámara {codigo}",
        timestamp=datetime.now().isoformat()
    )

@app.post("/multas/consultar", response_model=ConsultaResponse)
async def consultar_multas(request: ConsultaMultasRequest):
    """Consulta las multas de un usuario específico"""
    try:
        cedula = request.cedula.strip().replace(" ", "")
        
        if cedula not in MULTAS_USUARIOS:
            return ConsultaResponse(
                success=True,
                data={
                    "multas": [],
                    "total_multas": 0,
                    "total_pendiente": 0
                },
                message=f"No se encontraron multas para cédula {cedula}",
                timestamp=datetime.now().isoformat()
            )
        
        multas = MULTAS_USUARIOS[cedula]
        total_pendiente = sum(m['monto'] for m in multas if m['estado'] == 'pendiente')
        
        return ConsultaResponse(
            success=True,
            data={
                "multas": multas,
                "total_multas": len(multas),
                "total_pendiente": total_pendiente,
                "cedula": cedula
            },
            message=f"Se encontraron {len(multas)} multas",
            timestamp=datetime.now().isoformat()
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/multas/calcular-descuento")
async def calcular_descuento(request: CalculoDescuentoRequest):
    """Calcula el descuento aplicable a una multa"""
    try:
        monto = request.monto
        dias = request.dias
        
        if dias <= 5:
            descuento_porcentaje = 50
            monto_final = monto * 0.50
        elif dias <= 30:
            descuento_porcentaje = 25
            monto_final = monto * 0.75
        else:
            descuento_porcentaje = 0
            monto_final = monto
        
        return ConsultaResponse(
            success=True,
            data={
                "monto_original": monto,
                "dias": dias,
                "descuento_porcentaje": descuento_porcentaje,
                "descuento_monto": monto - monto_final,
                "monto_final": monto_final
            },
            message=f"Descuento calculado: {descuento_porcentaje}%",
            timestamp=datetime.now().isoformat()
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/normativas")
async def obtener_normativas(tipo: Optional[str] = None):
    """Obtiene información sobre normativas"""
    try:
        if not sistema:
            raise HTTPException(status_code=503, detail="Sistema no inicializado")
        
        query = tipo if tipo else "información general sobre normativas"
        docs = sistema.retriever.get_relevant_documents(query)
        
        normativas = [doc.page_content for doc in docs]
        
        return ConsultaResponse(
            success=True,
            data={
                "normativas": normativas,
                "total": len(normativas)
            },
            message="Normativas obtenidas",
            timestamp=datetime.now().isoformat()
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Para ejecutar: uvicorn main:app --reload --port 8000