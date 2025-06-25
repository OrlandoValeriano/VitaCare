"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface UserProfile {
  edad: number
  talla: number
  peso: number
  tipoPaciente: string
  condiciones: string[]
  alergias: string[]
}

interface UserData {
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  usuario: string
  profile?: UserProfile
}

interface UserContextType {
  userData: UserData | null
  userProfile: UserProfile | null
  setUserData: (data: UserData) => void
  setUserProfile: (profile: UserProfile) => void
  hasCompleteProfile: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserDataState] = useState<UserData | null>(null)
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null)

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData")
    const storedUserProfile = localStorage.getItem("userProfile")

    if (storedUserData) {
      setUserDataState(JSON.parse(storedUserData))
    }

    if (storedUserProfile) {
      setUserProfileState(JSON.parse(storedUserProfile))
    }
  }, [])

  const setUserData = (data: UserData) => {
    setUserDataState(data)
    localStorage.setItem("userData", JSON.stringify(data))
  }

  const setUserProfile = (profile: UserProfile) => {
    setUserProfileState(profile)
    localStorage.setItem("userProfile", JSON.stringify(profile))
  }

  const hasCompleteProfile = userProfile !== null

  return (
    <UserContext.Provider
      value={{
        userData,
        userProfile,
        setUserData,
        setUserProfile,
        hasCompleteProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
