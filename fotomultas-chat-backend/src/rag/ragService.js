import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class RAGService {
  constructor() {
    this.conocimiento = this.cargarConocimiento();
  }

  cargarConocimiento() {
    try {
      const filePath = path.join(__dirname, 'documents', 'conocimiento_multas.txt');
      const content = fs.readFileSync(filePath, 'utf-8');
      return content;
    } catch (error) {
      console.error('Error al cargar conocimiento:', error);
      return '';
    }
  }

  buscarInformacion(query) {
    const queryLower = query.toLowerCase();
    
    // Palabras clave para diferentes temas
    const temas = {
      pagar: ['pagar', 'pago', 'como pago', 'donde pago', 'cancelar'],
      descuentos: ['descuento', 'rebaja', 'reducción', 'barato'],
      recursos: ['recurso', 'apelar', 'reclamar', 'inconformidad', 'no estoy de acuerdo'],
      consecuencias: ['no pagar', 'que pasa si no pago', 'consecuencias', 'embargo'],
      tipos: ['tipos', 'infracciones', 'cuales son'],
      plazo: ['plazo', 'tiempo', 'cuando', 'cuanto tiempo'],
    };

    // Detectar el tema de la consulta
    let temaDetectado = null;
    for (const [tema, palabras] of Object.entries(temas)) {
      if (palabras.some(palabra => queryLower.includes(palabra))) {
        temaDetectado = tema;
        break;
      }
    }

    // Extraer secciones relevantes del conocimiento
    const secciones = this.conocimiento.split('\n\n');
    let respuestaRelevante = '';

    switch (temaDetectado) {
      case 'pagar':
        respuestaRelevante = secciones.find(s => s.includes('PASOS PARA PAGAR')) || '';
        break;
      case 'descuentos':
        respuestaRelevante = secciones.find(s => s.includes('DESCUENTOS DISPONIBLES')) || '';
        break;
      case 'recursos':
        respuestaRelevante = secciones.find(s => s.includes('RECURSOS Y OPCIONES LEGALES')) || '';
        break;
      case 'consecuencias':
        respuestaRelevante = secciones.find(s => s.includes('CONSECUENCIAS DE NO PAGAR')) || '';
        break;
      case 'tipos':
        respuestaRelevante = secciones.find(s => s.includes('TIPOS DE INFRACCIONES')) || '';
        break;
      default:
        // Si no se detecta un tema específico, retornar info general
        respuestaRelevante = secciones.slice(0, 2).join('\n\n');
    }

    return {
      encontrado: !!respuestaRelevante,
      informacion: respuestaRelevante,
      tema: temaDetectado,
    };
  }

  obtenerContextoCompleto() {
    return this.conocimiento;
  }
}

export default new RAGService();