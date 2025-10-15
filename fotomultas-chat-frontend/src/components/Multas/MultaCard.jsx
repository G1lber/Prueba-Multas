import { AlertTriangle, Calendar, DollarSign, FileText } from 'lucide-react';

const MultaCard = ({ multa }) => {
  const estadoColor = {
    'pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'pagada': 'bg-green-100 text-green-800 border-green-300',
    'vencida': 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-gray-800">
            Multa #{multa.numero || 'N/A'}
          </h3>
        </div>
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium border ${
            estadoColor[multa.estado?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300'
          }`}
        >
          {multa.estado || 'Pendiente'}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          <span className="font-medium">Infracción:</span>
          <span>{multa.infraccion || 'No especificada'}</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="font-medium">Fecha:</span>
          <span>{multa.fecha || 'No disponible'}</span>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-500" />
          <span className="font-medium">Valor:</span>
          <span className="font-bold text-gray-900">
            ${multa.valor?.toLocaleString('es-CO') || '0'}
          </span>
        </div>

        {multa.lugar && (
          <div className="flex items-start gap-2">
            <span className="font-medium">Lugar:</span>
            <span>{multa.lugar}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultaCard;