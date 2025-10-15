import { Bot, User, AlertCircle } from 'lucide-react'
import MultaCard from '../Multas/MultaCard'

const Message = ({ message }) => {
  const isBot = message.sender === 'bot'

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} items-start gap-3`}>
      {isBot && (
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      <div className={`flex flex-col max-w-[75%] ${!isBot && 'items-end'}`}>
        <div
          className={`rounded-2xl px-5 py-3 shadow-sm transition-all duration-200 ${
            isBot
              ? 'bg-white border border-gray-200 text-gray-800'
              : 'bg-blue-600 text-white shadow-md'
          } ${message.isError && 'bg-red-50 border-red-200 text-red-700'}`}
        >
          {message.isError && (
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium">Error</span>
            </div>
          )}
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>

          {message.multas && message.multas.length > 0 && (
            <div className="mt-4 space-y-2">
              {message.multas.map((multa, i) => (
                <MultaCard key={i} multa={multa} />
              ))}
            </div>
          )}
        </div>

        <span className="text-xs text-gray-400 mt-1 px-1">
          {new Date(message.timestamp).toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      {!isBot && (
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center shadow-md">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  )
}

export default Message
