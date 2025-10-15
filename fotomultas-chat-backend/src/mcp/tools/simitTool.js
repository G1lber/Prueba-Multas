import simitService from '../../services/simitService.js';

export const simitTool = {
  name: 'consultar_multas',
  description: 'Consulta las multas de tránsito de una persona en el sistema SIMIT de Colombia usando su número de cédula',
  input_schema: {
    type: 'object',
    properties: {
      document_number: {
        type: 'string',
        description: 'Número de cédula o documento de identidad (sin puntos ni comas)',
      },
      document_type: {
        type: 'string',
        enum: ['cedula', 'cedula_extranjeria', 'nit'],
        description: 'Tipo de documento',
        default: 'cedula',
      },
    },
    required: ['document_number'],
  },
  
  async execute({ document_number, document_type = 'cedula' }) {
    try {
      const result = await simitService.consultarMultas(document_type, document_number);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message,
        multas: [],
      };
    }
  },
};