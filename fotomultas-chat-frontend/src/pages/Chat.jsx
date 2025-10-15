import ChatContainer from '../components/Chat/ChatContainer'
import { Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ChatPage = () => {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-white flex flex-col items-center">
      <button
        onClick={() => navigate('/')}
        className="absolute top-5 left-5 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300"
      >
        <Home className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Inicio</span>
      </button>

      <div className="w-full max-w-5xl flex-1 flex flex-col mt-16 mb-6 px-4 sm:px-6 lg:px-8">
        <ChatContainer />
      </div>
    </div>
  )
}

export default ChatPage
