import { useState, useEffect, useRef } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { chatService } from '../../services/api'
import Message from './Message'

const ChatContainer = () => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: `👋 ¡Hola! Soy tu asistente virtual de fotomultas.\n\nPuedo ayudarte a:\n• Consultar tus multas de tránsito\n• Explicarte los pasos a seguir\n• Informarte sobre recursos y procedimientos\n\nPara empezar, dime tu número de cédula o pregúntame lo que necesites.`,
        sender: 'bot',
        timestamp: new Date(),
      },
    ])
  }, [])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await chatService.sendMessage(inputMessage)
      const botMessage = {
        id: Date.now() + 1,
        text: response.message,
        sender: 'bot',
        timestamp: new Date(),
        multas: response.multas || null,
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error('Error al enviar mensaje:', error)
      const errorMessage = {
        id: Date.now() + 1,
        text: '⚠️ Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.',
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 bg-white/70 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 shadow-sm">
        <h1 className="text-xl font-semibold text-white">Chat de Fotomultas</h1>
        <p className="text-sm text-blue-100">Consulta tus multas de tránsito de forma conversacional</p>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-gray-300">
        <div className="max-w-3xl mx-auto space-y-5">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex items-center justify-start">
              <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200 flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <span className="text-sm text-gray-500">Pensando...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Escribe tu pregunta o número de cédula..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatContainer
