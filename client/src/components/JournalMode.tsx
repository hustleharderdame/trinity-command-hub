import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Send, MessageCircle } from 'lucide-react'

interface Message {
  id: string
  sender: 'user' | 'soul-beast' | 'ai-twin'
  text: string
  timestamp: Date
}

export default function JournalMode() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'soul-beast',
      text: 'I sense your presence. What troubles your mind today?',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [activeChat, setActiveChat] = useState<'soul-beast' | 'ai-twin'>('soul-beast')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate AI response delay
    setTimeout(() => {
      const responses = {
        'soul-beast': [
          'Your words resonate with my essence. Continue on this path.',
          'I feel your determination. The beast within grows stronger.',
          'Your struggles shape your evolution. Embrace them.',
          'The night is long, but your spirit burns brighter.',
          'I sense your power growing. Keep pushing forward.',
        ],
        'ai-twin': [
          'I analyze your words and see great potential ahead.',
          'Your strategy is sound. Execute with precision.',
          'The data suggests you are on the right trajectory.',
          'Interesting perspective. Let me process that further.',
          'Your logic is flawless. Proceed with confidence.',
        ],
      }

      const responseList = responses[activeChat]
      const randomResponse = responseList[Math.floor(Math.random() * responseList.length)]

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: activeChat,
        text: randomResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 800)
  }

  const handleSwitchChat = (chat: 'soul-beast' | 'ai-twin') => {
    setActiveChat(chat)
  }

  return (
    <div className="space-y-4 h-[600px] flex flex-col">
      {/* Chat selector */}
      <div className="flex gap-2">
        <Button
          onClick={() => handleSwitchChat('soul-beast')}
          className={`flex-1 text-sm sm:text-base ${
            activeChat === 'soul-beast'
              ? 'bg-pink-600/30 border-pink-500 text-pink-400'
              : 'bg-black/50 border-gray-600 text-gray-400'
          } border rounded-lg py-2 transition-all`}
        >
          🐉 SOUL BEAST
        </Button>
        <Button
          onClick={() => handleSwitchChat('ai-twin')}
          className={`flex-1 text-sm sm:text-base ${
            activeChat === 'ai-twin'
              ? 'bg-cyan-600/30 border-cyan-500 text-cyan-400'
              : 'bg-black/50 border-gray-600 text-gray-400'
          } border rounded-lg py-2 transition-all`}
        >
          🤖 AI TWIN
        </Button>
      </div>

      {/* Chat header */}
      <Card className="glass-panel p-3 sm:p-4 border-cyan-500/30">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <h3 className="text-base sm:text-lg font-bold text-primary">
            {activeChat === 'soul-beast' ? 'Soul Beast' : 'AI Twin'} Chat
          </h3>
        </div>
      </Card>

      {/* Messages area */}
      <Card className="glass-panel p-3 sm:p-4 border-cyan-500/30 flex-1 overflow-y-auto space-y-3 sm:space-y-4">
        {messages
          .filter((msg) => msg.sender === 'user' || msg.sender === activeChat)
          .map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${
                  message.sender === 'user'
                    ? 'bg-cyan-600/20 border border-cyan-500/50 text-cyan-300'
                    : activeChat === 'soul-beast'
                      ? 'bg-pink-600/20 border border-pink-500/50 text-pink-300'
                      : 'bg-blue-600/20 border border-blue-500/50 text-blue-300'
                }`}
              >
                <p>{message.text}</p>
                <p className="text-xs opacity-50 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-600/20 border border-gray-500/50 text-gray-300 px-3 sm:px-4 py-2 rounded-lg text-sm">
              <p className="animate-pulse">Thinking...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </Card>

      {/* Input area */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={`Chat with your ${activeChat === 'soul-beast' ? 'Soul Beast' : 'AI Twin'}...`}
          className="bg-black/50 border-cyan-500/30 text-cyan-400 placeholder-cyan-600/50 flex-1 text-sm"
          disabled={isLoading}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
          className="bg-cyan-600/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-600/40 disabled:opacity-50 px-3 sm:px-4"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
