"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Menu, MessageCircle, Home, Calendar, Heart, Pill, User } from "lucide-react"

interface LayoutProps {
  children: React.ReactNode
  showNavigation?: boolean
}

const Layout: React.FC<LayoutProps> = ({ children, showNavigation = true }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showSidebar, setShowSidebar] = useState(false)

  const navigationItems = [
    { icon: Home, label: "Inicio", path: "/dashboard" },
    { icon: Calendar, label: "Agenda", path: "/appointments" },
    { icon: Heart, label: "Salud", path: "/health" },
    { icon: Pill, label: "Medicación", path: "/medication" },
    { icon: User, label: "Mi perfil", path: "/profile" },
  ]

  const isActiveRoute = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {showNavigation && (
        <>
          {/* Header */}
          <header className="bg-gray-800 shadow-sm p-4 flex justify-between items-center">
            <button onClick={() => setShowSidebar(!showSidebar)} className="p-2 hover:bg-gray-700 rounded-lg">
              <Menu size={24} className="text-white" />
            </button>

            <button
              onClick={() => navigate("/chatbot")}
              className="p-2 rounded-lg hover:opacity-90 transition-colors"
              style={{ backgroundColor: "#C3FFD3" }}
            >
              <MessageCircle size={24} className="text-gray-800" />
            </button>
          </header>

          {/* Sidebar */}
          {showSidebar && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowSidebar(false)}>
              <div className="bg-gray-800 w-64 h-full p-4" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4 text-white">Menú</h2>
                <nav className="space-y-2">
                  {navigationItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path)
                        setShowSidebar(false)
                      }}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                        isActiveRoute(item.path)
                          ? "bg-gray-700 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          )}
        </>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Bottom Navigation */}
      {showNavigation && (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-4 py-2">
          <div className="flex justify-around">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                  isActiveRoute(item.path) ? "text-gray-900" : "text-gray-400 hover:text-gray-200"
                }`}
                style={{
                  backgroundColor: isActiveRoute(item.path) ? "#C3FFD3" : "transparent",
                }}
              >
                <item.icon size={20} />
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}

export default Layout
