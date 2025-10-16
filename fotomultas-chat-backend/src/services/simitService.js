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

    // Nuevos ejemplos para Popayán
    '10123456789': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP001',
          infraccion: 'Exceso de velocidad en zona escolar',
          fecha: '2024-10-12',
          valor: 380000,
          estado: 'pendiente',
          lugar: 'Carrera 6 con Calle 4, Centro Histórico Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
      ],
      total: 1,
      valorTotal: 380000,
    },

    '20234567890': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP002',
          infraccion: 'Parquear en zona peatonal',
          fecha: '2024-10-08',
          valor: 200000,
          estado: 'pendiente',
          lugar: 'Parque Caldas, Centro Histórico Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
        {
          numero: 'INF-2024-POP003',
          infraccion: 'No respetar señal de pare',
          fecha: '2024-09-25',
          valor: 350000,
          estado: 'vencida',
          lugar: 'Carrera 9 con Calle 5, Popayán',
          organismo: 'Policía Nacional de Tránsito',
        },
      ],
      total: 2,
      valorTotal: 550000,
    },

    '1061716233': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP004',
          infraccion: 'Conducir sin licencia vigente',
          fecha: '2024-10-01',
          valor: 900000,
          estado: 'pendiente',
          lugar: 'Vía Panamericana - Sector La Rejoya, Popayán',
          organismo: 'Policía de Carreteras Cauca',
        },
      ],
      total: 1,
      valorTotal: 900000,
    },

    '40456789012': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP005',
          infraccion: 'Usar celular mientras conduce',
          fecha: '2024-10-05',
          valor: 300000,
          estado: 'pendiente',
          lugar: 'Avenida Panamericana con Calle 18N, Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
      ],
      total: 1,
      valorTotal: 300000,
    },

    '50567890123': {
      success: true,
      multas: [],
      total: 0,
      valorTotal: 0,
      mensaje: 'No se encontraron multas registradas',
    },

    '60678901234': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP006',
          infraccion: 'Bloquear intersección',
          fecha: '2024-09-30',
          valor: 250000,
          estado: 'pagada',
          lugar: 'Carrera 7 con Calle 3, Centro Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
      ],
      total: 1,
      valorTotal: 0,
    },

    '70789012345': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP007',
          infraccion: 'Exceso de velocidad (35% por encima)',
          fecha: '2024-10-03',
          valor: 620000,
          estado: 'pendiente',
          lugar: 'Vía Popayán - Timbío Km 8',
          organismo: 'Policía de Carreteras Cauca',
        },
        {
          numero: 'INF-2024-POP008',
          infraccion: 'No usar cinturón de seguridad',
          fecha: '2024-09-18',
          valor: 150000,
          estado: 'pendiente',
          lugar: 'Carrera 2 con Calle 1, Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
      ],
      total: 2,
      valorTotal: 770000,
    },

    '80890123456': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP009',
          infraccion: 'Estacionar en zona de carga y descarga',
          fecha: '2024-10-07',
          valor: 180000,
          estado: 'pendiente',
          lugar: 'Calle 4 entre Carreras 8 y 9, Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
      ],
      total: 1,
      valorTotal: 180000,
    },

    '90901234567': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP010',
          infraccion: 'Transitar por carril exclusivo de buses',
          fecha: '2024-09-22',
          valor: 400000,
          estado: 'pendiente',
          lugar: 'Carrera 6, sector Universidad del Cauca, Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
      ],
      total: 1,
      valorTotal: 400000,
    },

    '11012345678': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP011',
          infraccion: 'Giro prohibido',
          fecha: '2024-10-09',
          valor: 280000,
          estado: 'pendiente',
          lugar: 'Torre del Reloj, Centro Histórico Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
      ],
      total: 1,
      valorTotal: 280000,
    },

    '12123456789': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP012',
          infraccion: 'Conducir en estado de embriaguez',
          fecha: '2024-09-14',
          valor: 1500000,
          estado: 'pendiente',
          lugar: 'Barrio Los Sauces, Popayán',
          organismo: 'Policía Nacional de Tránsito',
        },
      ],
      total: 1,
      valorTotal: 1500000,
    },

    '13234567890': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP013',
          infraccion: 'SOAT vencido',
          fecha: '2024-10-11',
          valor: 650000,
          estado: 'pendiente',
          lugar: 'Aeropuerto Guillermo León Valencia, Popayán',
          organismo: 'Policía de Carreteras Cauca',
        },
      ],
      total: 1,
      valorTotal: 650000,
    },

    '14345678901': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP014',
          infraccion: 'Adelantar en curva',
          fecha: '2024-09-28',
          valor: 750000,
          estado: 'vencida',
          lugar: 'Vía Popayán - Cajibío Km 15',
          organismo: 'Policía de Carreteras Cauca',
        },
      ],
      total: 1,
      valorTotal: 750000,
    },

    '15456789012': {
      success: true,
      multas: [],
      total: 0,
      valorTotal: 0,
      mensaje: 'No se encontraron multas registradas',
    },

    '16567890123': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP015',
          infraccion: 'No portar chaleco reflectivo en motocicleta',
          fecha: '2024-10-02',
          valor: 120000,
          estado: 'pendiente',
          lugar: 'Puente del Humilladero, Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
        {
          numero: 'INF-2024-POP016',
          infraccion: 'Transitar sin casco',
          fecha: '2024-09-20',
          valor: 220000,
          estado: 'pendiente',
          lugar: 'Barrio Alfonso López, Popayán',
          organismo: 'Policía Nacional de Tránsito',
        },
      ],
      total: 2,
      valorTotal: 340000,
    },

    '17678901234': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP017',
          infraccion: 'Estacionar en zona para discapacitados',
          fecha: '2024-10-06',
          valor: 500000,
          estado: 'pendiente',
          lugar: 'Centro Comercial Campanario, Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
      ],
      total: 1,
      valorTotal: 500000,
    },

    '18789012345': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP018',
          infraccion: 'Realizar parrillero en motocicleta sin casco',
          fecha: '2024-09-26',
          valor: 220000,
          estado: 'pagada',
          lugar: 'Universidad del Cauca, sector Tulcán, Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
      ],
      total: 1,
      valorTotal: 0,
    },

    '19890123456': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP019',
          infraccion: 'Pasarse semáforo en rojo',
          fecha: '2024-10-04',
          valor: 400000,
          estado: 'pendiente',
          lugar: 'Carrera 9 con Calle 15N, Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
      ],
      total: 1,
      valorTotal: 400000,
    },

    '21901234567': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP020',
          infraccion: 'Conducir motocicleta con acompañante menor de edad sin casco',
          fecha: '2024-09-19',
          valor: 450000,
          estado: 'pendiente',
          lugar: 'Barrio San Camilo, Popayán',
          organismo: 'Policía Nacional de Tránsito',
        },
        {
          numero: 'INF-2024-POP021',
          infraccion: 'Exceso de velocidad en zona residencial',
          fecha: '2024-10-08',
          valor: 320000,
          estado: 'pendiente',
          lugar: 'Barrio La Esmeralda, Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
      ],
      total: 2,
      valorTotal: 770000,
    },

    '22012345678': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP022',
          infraccion: 'Transitar en contravía',
          fecha: '2024-09-24',
          valor: 550000,
          estado: 'vencida',
          lugar: 'Calle 5 entre Carreras 6 y 7, Centro Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
      ],
      total: 1,
      valorTotal: 550000,
    },

    '23123456789': {
      success: true,
      multas: [],
      total: 0,
      valorTotal: 0,
      mensaje: 'No se encontraron multas registradas',
    },

    '24234567890': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP023',
          infraccion: 'No respetar distancia de seguimiento',
          fecha: '2024-10-10',
          valor: 380000,
          estado: 'pendiente',
          lugar: 'Vía Panamericana sector Coconuco, Popayán',
          organismo: 'Policía de Carreteras Cauca',
        },
      ],
      total: 1,
      valorTotal: 380000,
    },

    '25345678901': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP024',
          infraccion: 'Obstruir paso peatonal',
          fecha: '2024-09-29',
          valor: 200000,
          estado: 'pendiente',
          lugar: 'Puente de la Custodia, Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
      ],
      total: 1,
      valorTotal: 200000,
    },

    '26456789012': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP025',
          infraccion: 'Conducir vehículo con luces dañadas',
          fecha: '2024-10-01',
          valor: 180000,
          estado: 'pagada',
          lugar: 'Vía Popayán - Piendamó Km 5',
          organismo: 'Policía de Carreteras Cauca',
        },
      ],
      total: 1,
      valorTotal: 0,
    },

    '27567890123': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP026',
          infraccion: 'Exceso de pasajeros en vehículo',
          fecha: '2024-09-27',
          valor: 420000,
          estado: 'pendiente',
          lugar: 'Terminal de Transportes, Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
        {
          numero: 'INF-2024-POP027',
          infraccion: 'Transportar carga sin asegurar',
          fecha: '2024-10-03',
          valor: 350000,
          estado: 'pendiente',
          lugar: 'Mercado del Norte, Popayán',
          organismo: 'Policía Nacional de Tránsito',
        },
      ],
      total: 2,
      valorTotal: 770000,
    },

    '28678901234': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP028',
          infraccion: 'Conducir sin documentos del vehículo',
          fecha: '2024-10-07',
          valor: 250000,
          estado: 'pendiente',
          lugar: 'Barrio Valencia, Popayán',
          organismo: 'Policía Nacional de Tránsito',
        },
      ],
      total: 1,
      valorTotal: 250000,
    },

    '29789012345': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP029',
          infraccion: 'Utilizar dispositivos móviles mientras conduce',
          fecha: '2024-09-23',
          valor: 300000,
          estado: 'vencida',
          lugar: 'Sector SENA, Carrera 1ª, Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
      ],
      total: 1,
      valorTotal: 300000,
    },

    '31890123456': {
      success: true,
      multas: [],
      total: 0,
      valorTotal: 0,
      mensaje: 'No se encontraron multas registradas',
    },

    '32901234567': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP030',
          infraccion: 'Estacionar en doble fila',
          fecha: '2024-10-05',
          valor: 220000,
          estado: 'pendiente',
          lugar: 'Galería Central, Calle 2, Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
      ],
      total: 1,
      valorTotal: 220000,
    },

    '33012345678': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP031',
          infraccion: 'Modificación no autorizada del vehículo',
          fecha: '2024-09-21',
          valor: 800000,
          estado: 'pendiente',
          lugar: 'Barrio Bello Horizonte, Popayán',
          organismo: 'Policía Nacional de Tránsito',
        },
      ],
      total: 1,
      valorTotal: 800000,
    },

    '34123456789': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP032',
          infraccion: 'Transitar por andén',
          fecha: '2024-10-09',
          valor: 350000,
          estado: 'pendiente',
          lugar: 'Sector Claustro Santo Domingo, Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
        {
          numero: 'INF-2024-POP033',
          infraccion: 'No respetar zona escolar',
          fecha: '2024-09-17',
          valor: 380000,
          estado: 'pagada',
          lugar: 'Colegio San Francisco de Asís, Popayán',
          organismo: 'Policía Nacional de Tránsito',
        },
      ],
      total: 2,
      valorTotal: 350000,
    },

    '35234567890': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP034',
          infraccion: 'Arrojar basura desde el vehículo',
          fecha: '2024-10-02',
          valor: 150000,
          estado: 'pendiente',
          lugar: 'Vía a Timbío, sector Samanga, Popayán',
          organismo: 'Policía Ambiental Cauca',
        },
      ],
      total: 1,
      valorTotal: 150000,
    },

    '36345678901': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP035',
          infraccion: 'Conducir con escape libre',
          fecha: '2024-09-25',
          valor: 280000,
          estado: 'pendiente',
          lugar: 'Barrio Lomas de Granada, Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
      ],
      total: 1,
      valorTotal: 280000,
    },

    '37456789012': {
      success: true,
      multas: [],
      total: 0,
      valorTotal: 0,
      mensaje: 'No se encontraron multas registradas',
    },

    '38567890123': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP036',
          infraccion: 'Hacer giros en "U" prohibidos',
          fecha: '2024-10-06',
          valor: 320000,
          estado: 'pendiente',
          lugar: 'Puente Chirimoya, Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
      ],
      total: 1,
      valorTotal: 320000,
    },

    '39678901234': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP037',
          infraccion: 'Conducir motocicleta sin elementos de protección',
          fecha: '2024-09-30',
          valor: 180000,
          estado: 'vencida',
          lugar: 'Barrio El Cadillal, Popayán',
          organismo: 'Policía Nacional de Tránsito',
        },
        {
          numero: 'INF-2024-POP038',
          infraccion: 'Exceso de velocidad nocturno',
          fecha: '2024-10-04',
          valor: 450000,
          estado: 'pendiente',
          lugar: 'Vía Popayán - Sotará Km 12',
          organismo: 'Policía de Carreteras Cauca',
        },
      ],
      total: 2,
      valorTotal: 630000,
    },

    '41789012345': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP039',
          infraccion: 'Bloquear salida de emergencia',
          fecha: '2024-10-08',
          valor: 400000,
          estado: 'pendiente',
          lugar: 'Hospital Universitario San José, Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
      ],
      total: 1,
      valorTotal: 400000,
    },

    '42890123456': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP040',
          infraccion: 'Conducir con revisión tecno-mecánica vencida',
          fecha: '2024-09-18',
          valor: 550000,
          estado: 'pendiente',
          lugar: 'Centro de Diagnóstico Automotor, Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
      ],
      total: 1,
      valorTotal: 550000,
    },

    '43901234567': {
      success: true,
      multas: [],
      total: 0,
      valorTotal: 0,
      mensaje: 'No se encontraron multas registradas',
    },

    '44012345678': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP041',
          infraccion: 'Transporte público sin cumplir ruta',
          fecha: '2024-10-01',
          valor: 620000,
          estado: 'pendiente',
          lugar: 'Paradero San Bernardino, Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
        {
          numero: 'INF-2024-POP042',
          infraccion: 'Exceso de pasajeros en transporte público',
          fecha: '2024-09-22',
          valor: 480000,
          estado: 'pagada',
          lugar: 'Ruta Universidad - Centro, Popayán',
          organismo: 'Policía Nacional de Tránsito',
        },
      ],
      total: 2,
      valorTotal: 620000,
    },

    '45123456789': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP043',
          infraccion: 'Estacionar en rampa para discapacitados',
          fecha: '2024-10-07',
          valor: 500000,
          estado: 'pendiente',
          lugar: 'Alcaldía Municipal, Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
      ],
      total: 1,
      valorTotal: 500000,
    },

    '46234567890': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP044',
          infraccion: 'Conducir bajo efectos de sustancias psicoactivas',
          fecha: '2024-09-16',
          valor: 1800000,
          estado: 'pendiente',
          lugar: 'Barrio Janambú, Popayán',
          organismo: 'Policía Nacional de Tránsito',
        },
      ],
      total: 1,
      valorTotal: 1800000,
    },

    '47345678901': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP045',
          infraccion: 'Transitar en horario restringido',
          fecha: '2024-10-03',
          valor: 300000,
          estado: 'pendiente',
          lugar: 'Centro Histórico, Calle Real, Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
      ],
      total: 1,
      valorTotal: 300000,
    },

    '48456789012': {
      success: true,
      multas: [],
      total: 0,
      valorTotal: 0,
      mensaje: 'No se encontraron multas registradas',
    },

    '49567890123': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP046',
          infraccion: 'Adelantar en zona prohibida',
          fecha: '2024-09-28',
          valor: 680000,
          estado: 'vencida',
          lugar: 'Vía Popayán - La Plata Km 25',
          organismo: 'Policía de Carreteras Cauca',
        },
        {
          numero: 'INF-2024-POP047',
          infraccion: 'No usar direccionales',
          fecha: '2024-10-05',
          valor: 150000,
          estado: 'pendiente',
          lugar: 'Glorieta Belalcázar, Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
      ],
      total: 2,
      valorTotal: 830000,
    },

    '51678901234': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP048',
          infraccion: 'Conducir con licencia suspendida',
          fecha: '2024-10-09',
          valor: 1200000,
          estado: 'pendiente',
          lugar: 'Sector Yanaconas, Popayán',
          organismo: 'Policía Nacional de Tránsito',
        },
      ],
      total: 1,
      valorTotal: 1200000,
    },

    '52789012345': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP049',
          infraccion: 'Obstruir ciclorruta',
          fecha: '2024-10-02',
          valor: 250000,
          estado: 'pendiente',
          lugar: 'Ciclovía del Río Molino, Popayán',
          organismo: 'Secretaría de Tránsito Municipal Popayán',
        },
      ],
      total: 1,
      valorTotal: 250000,
    },

    '53890123456': {
      success: true,
      multas: [
        {
          numero: 'INF-2024-POP050',
          infraccion: 'Exceso de decibeles por escape modificado',
          fecha: '2024-09-26',
          valor: 320000,
          estado: 'pagada',
          lugar: 'Barrio Model, Popayán',
          organismo: 'Policía Ambiental Cauca',
        },
      ],
      total: 1,
      valorTotal: 0,
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