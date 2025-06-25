"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { User, Lock } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useUser } from "../contexts/UserContext"

const Login: React.FC = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberUser, setRememberUser] = useState(false)
  const [error, setError] = useState("")

  const { login } = useAuth()
  const { hasCompleteProfile } = useUser()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (login(username, password)) {
      // Redirigir según el estado del perfil
      if (hasCompleteProfile) {
        navigate("/dashboard")
      } else {
        navigate("/complete-profile")
      }
    } else {
      setError("Usuario o contraseña incorrectos")
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Iniciar Sesión</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              checked={rememberUser}
              onChange={(e) => setRememberUser(e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-300">
              Recordar usuario
            </label>
          </div>

          {error && <div className="text-red-400 text-sm text-center">{error}</div>}

          <button
            type="submit"
            className="w-full bg-green-400 text-gray-900 py-3 rounded-lg hover:bg-green-300 transition duration-200 font-medium"
            style={{ backgroundColor: "#C3FFD3" }}
          >
            Acceder
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-300">
            ¿No estás registrado?{" "}
            <Link to="/register" className="text-green-300 hover:text-green-200 font-medium">
              Regístrate ahora
            </Link>
          </p>
        </div>

        <div className="mt-4 p-3 bg-gray-700 rounded-lg border border-gray-600">
          <p className="text-sm text-gray-300 text-center">
            <strong>Credenciales de prueba:</strong>
            <br />
            Usuario: admin
            <br />
            Contraseña: 123456
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
