"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, Send, AlertTriangle, Heart, Brain, HelpCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface Message {
  id: number
  text: string
  isBot: boolean
  timestamp: Date
}

const Chatbot: React.FC = () => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¿Te puedo ayudar en algo?",
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")

  const quickResponses = [
    {
      icon: AlertTriangle,
      text: "Tengo un síntoma",
      color: "text-gray-800",
      bgColor: "#FFC4BD", // Rosa claro
    },
    {
      icon: AlertTriangle,
      text: "Es una urgencia",
      color: "text-white",
      bgColor: "#dc2626", // Rojo para urgencia
    },
    {
      icon: Brain,
      text: "Me siento mal emocionalmente",
      color: "text-gray-800",
      bgColor: "#E4D6EB", // Lila pastel
    },
    {
      icon: HelpCircle,
      text: "No sé cómo describirlo",
      color: "text-gray-800",
      bgColor: "#E2FAF9", // Azul celeste muy claro
    },
  ]

  const handleSendMessage = (text: string) => {
    if (text.trim() === "") return

    const newMessage: Message = {
      id: messages.length + 1,
      text: text,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputText("")

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: "Entiendo tu preocupación. ¿Podrías contarme más detalles sobre lo que sientes?",
        isBot: true,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  const handleQuickResponse = (text: string) => {
    handleSendMessage(text)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(inputText)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm p-4 flex items-center space-x-4">
        <button onClick={() => navigate("/dashboard")} className="p-2 hover:bg-gray-700 rounded-lg text-white">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#C3FFD3" }}
          >
            <Heart size={20} className="text-gray-800" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">MediBot - Tu asistente</h1>
            <p className="text-sm text-gray-300">En línea</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isBot ? "bg-gray-700 text-white shadow-sm" : "text-white"
              }`}
              style={{
                backgroundColor: message.isBot ? "#374151" : "#C3FFD3",
                color: message.isBot ? "white" : "#1f2937",
              }}
            >
              <p>{message.text}</p>
              <p className={`text-xs mt-1 ${message.isBot ? "text-gray-300" : "text-gray-600"}`}>
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {/* Quick Response Buttons */}
        {messages.length === 1 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-300 text-center mb-4">Respuestas rápidas:</p>
            {quickResponses.map((response, index) => (
              <button
                key={index}
                onClick={() => handleQuickResponse(response.text)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-colors hover:shadow-sm ${response.color}`}
                style={{ backgroundColor: response.bgColor, borderColor: response.bgColor }}
              >
                <response.icon size={20} />
                <span>{response.text}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent text-white placeholder-gray-400"
          />
          <button
            type="submit"
            className="text-gray-800 p-2 rounded-lg hover:opacity-90 transition-colors"
            style={{ backgroundColor: "#C3FFD3" }}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default Chatbot
