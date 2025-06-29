"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import type { Usuario, PerfilUsuario } from "../types/database"

interface AuthContextType {
  isAuthenticated: boolean
  currentUser: Usuario | null
  userProfile: PerfilUsuario | null
  setUserData: (user: Usuario) => void
  setUserProfile: (profile: PerfilUsuario) => void
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  register: (userData: any) => Promise<boolean>
  loading: boolean
  hasCompleteProfile: boolean
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
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null)
  const [userProfile, setUserProfileState] = useState<PerfilUsuario | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const userId = localStorage.getItem("userId")

      if (token && userId) {
        const { data: user, error } = await supabase
          .from("usuarios")
          .select("*")
          .eq("id_usuario", Number.parseInt(userId))
          .maybeSingle()

        if (user && !error) {
          setCurrentUser(user)
          setIsAuthenticated(true)

          const { data: profile, error: profileError } = await supabase
            .from("perfil_usuario")
            .select("*")
            .eq("id_usuario", user.id_usuario)
            .maybeSingle()

          if (profile && !profileError) {
            setUserProfileState(profile)
          }
        } else if (error) {
          console.error("Error checking user:", error)
          localStorage.removeItem("authToken")
          localStorage.removeItem("userId")
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const { data: user, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("username", username)
        .eq("password", password)
        .maybeSingle()

      if (user && !error) {
        localStorage.setItem("authToken", "temp-token")
        localStorage.setItem("userId", user.id_usuario.toString())
        setCurrentUser(user)
        setIsAuthenticated(true)

        const { data: profile, error: profileError } = await supabase
          .from("perfil_usuario")
          .select("*")
          .eq("id_usuario", user.id_usuario)
          .maybeSingle()

        if (profile && !profileError) {
          setUserProfileState(profile)
        }

        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (userData: any): Promise<boolean> => {
    try {
      const { data: user, error: userError } = await supabase
        .from("usuarios")
        .insert([
          {
            nombre: userData.nombre,
            apellido_paterno: userData.apellidoPaterno,
            apellido_materno: userData.apellidoMaterno,
            username: userData.usuario,
            password: userData.contraseña,
          },
        ])
        .select()
        .maybeSingle()

      if (userError) {
        console.error("Error creating user:", userError)
        return false
      }

      if (user) {
        localStorage.setItem("authToken", "temp-token")
        localStorage.setItem("userId", user.id_usuario.toString())
        setCurrentUser(user)
        setIsAuthenticated(true)
        return true
      }

      return false
    } catch (error) {
      console.error("Register error:", error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userId")
    setCurrentUser(null)
    setUserProfileState(null)
    setIsAuthenticated(false)
  }

  const setUserData = (user: Usuario) => {
    setCurrentUser(user)
  }

  const setUserProfile = (profile: PerfilUsuario) => {
    setUserProfileState(profile)
  }

  const hasCompleteProfile = userProfile !== null

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        userProfile,
        setUserData,
        setUserProfile,
        login,
        logout,
        register,
        loading,
        hasCompleteProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
