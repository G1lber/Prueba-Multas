import { useNavigate } from 'react-router-dom';
import { MessageCircle, Search, FileText, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Fotomultas Chat
            </h1>
          </div>
          <button
            onClick={() => navigate('/chat')}
            className="px-6 py-2 bg-primary-600 text-black rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Ir al Chat
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Consulta tus fotomultas
            <br />
            <span className="text-primary-600">de forma conversacional</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Pregunta sobre tus multas de tránsito y obtén respuestas inmediatas
            con pasos claros a seguir
          </p>
          <button
            onClick={() => navigate('/chat')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-black rounded-lg hover:bg-primary-700 transition-colors font-medium text-lg shadow-lg hover:shadow-xl"
          >
            Comenzar Ahora
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Consulta Rápida
            </h3>
            <p className="text-gray-600">
              Pregunta directamente sobre tus multas sin llenar formularios
              complicados
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Asistente IA
            </h3>
            <p className="text-gray-600">
              Un agente inteligente que entiende tus preguntas y te guía en el
              proceso
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Pasos Claros
            </h3>
            <p className="text-gray-600">
              Recibe información detallada sobre procedimientos y recursos según
              tu situación
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            ¿Cómo funciona?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Ingresa tu documento
              </h4>
              <p className="text-gray-600">
                Usa tu cédula para acceder de forma segura
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Haz tus preguntas
              </h4>
              <p className="text-gray-600">
                Pregunta naturalmente como si hablaras con una persona
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Obtén respuestas
              </h4>
              <p className="text-gray-600">
                Recibe información actualizada y pasos a seguir
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-400">
            © 2024 Fotomultas Chat. Información proveniente del SIMIT Colombia.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;