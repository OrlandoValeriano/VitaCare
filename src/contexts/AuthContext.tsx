"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
  register: (userData: any) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  const login = (username: string, password: string): boolean => {
    // Credenciales temporales para prueba
    if (username === "admin" && password === "123456") {
      localStorage.setItem("authToken", "temp-token")
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const register = (userData: any): boolean => {
    // Simulación de registro exitoso
    localStorage.setItem("authToken", "temp-token")
    localStorage.setItem("userData", JSON.stringify(userData))
    setIsAuthenticated(true)
    return true
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
    localStorage.removeItem("userProfile")
    setIsAuthenticated(false)
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout, register }}>{children}</AuthContext.Provider>
}
