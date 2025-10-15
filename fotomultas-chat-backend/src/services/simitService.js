// ...existing code...
// Datos de ejemplo para desarrollo
function getMultasEjemplo(documentNumber) {
  const ejemplos = {
    // Usuario con 2 multas pendientes
    '1234567890': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-001234',
          infraccion: 'Exceso de velocidad (20% por encima del límite)',
          fecha: '2024-10-01',
          valor: 450000,
          estado: 'pendiente',
          lugar: 'Autopista Norte Km 45, Bogotá',
          organismo: 'Secretaría de Movilidad Bogotá',
        },
        {
          numero: 'INF-2024-001235',
          infraccion: 'Estacionamiento en zona prohibida',
          fecha: '2024-09-15',
          valor: 250000,
          estado: 'pendiente',
          lugar: 'Carrera 7 con Calle 100, Bogotá',
          organismo: 'Policía Nacional de Tránsito',
        },
      ],
      total: 2,
      valorTotal: 700000,
    },

    // Usuario sin multas
    '9876543210': {
      success: true,
      multas: [],
      total: 0,
      valorTotal: 0,
      mensaje: 'No se encontraron multas registradas',
    },

    // Usuario con 1 multa grave
    '5555555555': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-005678',
          infraccion: 'Conducir bajo efectos del alcohol',
          fecha: '2024-09-20',
          valor: 1200000,
          estado: 'pendiente',
          lugar: 'Calle 26 con Carrera 50, Medellín',
          organismo: 'Secretaría de Movilidad Medellín',
        },
      ],
      total: 1,
      valorTotal: 1200000,
    },

    // Usuario con multa pagada
    '1111111111': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-002345',
          infraccion: 'No usar cinturón de seguridad',
          fecha: '2024-08-10',
          valor: 150000,
          estado: 'pagada',
          lugar: 'Avenida El Dorado, Bogotá',
          organismo: 'Policía Nacional de Tránsito',
        },
      ],
      total: 1,
      valorTotal: 0, // Ya está pagada
    },

    // Usuario con múltiples multas (caso extremo)
    '7777777777': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-007001',
          infraccion: 'Pasarse semáforo en rojo',
          fecha: '2024-10-05',
          valor: 400000,
          estado: 'pendiente',
          lugar: 'Calle 72 con Carrera 15, Bogotá',
          organismo: 'Secretaría de Movilidad Bogotá',
        },
        {
          numero: 'INF-2024-007002',
          infraccion: 'Usar celular mientras conduce',
          fecha: '2024-09-28',
          valor: 300000,
          estado: 'pendiente',
          lugar: 'Autopista Sur Km 12, Bogotá',
          organismo: 'Policía Nacional de Tránsito',
        },
        {
          numero: 'INF-2024-007003',
          infraccion: 'Exceso de velocidad (40% por encima)',
          fecha: '2024-09-10',
          valor: 800000,
          estado: 'vencida',
          lugar: 'Vía Bogotá-Girardot Km 23',
          organismo: 'Policía de Carreteras',
        },
      ],
      total: 3,
      valorTotal: 1500000,
    },

    // Usuario con multa por vencer pronto
    '3333333333': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-003456',
          infraccion: 'SOAT vencido',
          fecha: '2024-10-10',
          valor: 650000,
          estado: 'pendiente',
          lugar: 'Calle 80 con Autopista Norte, Bogotá',
          organismo: 'Secretaría de Movilidad Bogotá',
        },
      ],
      total: 1,
      valorTotal: 650000,
    },
  };

  // Si no existe la cédula en los ejemplos, retorna sin multas
  return ejemplos[documentNumber] || {
    success: true,
    multas: [],
    total: 0,
    valorTotal: 0,
    mensaje: 'No se encontraron multas registradas',
  };
}
// ...existing code...

/**
 * Simula una consulta a SIMIT.
 * @param {string} documentType - tipo de documento (no se usa en mock)
 * @param {string} documentNumber - número de documento
 * @returns {Promise<object>} resultado con multas
 */
export async function consultarMultas(documentType, documentNumber) {
  // Simular latencia de red
  await new Promise((res) => setTimeout(res, 200));
  // Aquí podrías llamar a una API real usando axios si tienes credenciales
  return getMultasEjemplo(documentNumber);
}

// Exports: named + default para compatibilidad con importaciones actuales
export default {
  consultarMultas,
  getMultasEjemplo,
};