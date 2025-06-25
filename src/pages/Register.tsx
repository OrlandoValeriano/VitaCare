"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useUser } from "../contexts/UserContext"

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    usuario: "",
    contraseña: "",
  })
  const [error, setError] = useState("")

  const { register } = useAuth()
  const { setUserData } = useUser()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (Object.values(formData).some((value) => value.trim() === "")) {
      setError("Todos los campos son obligatorios")
      return
    }

    if (register(formData)) {
      setUserData(formData)
      navigate("/complete-profile")
    } else {
      setError("Error al registrar usuario")
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Regístrate</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
            required
          />

          <input
            type="text"
            name="apellidoPaterno"
            placeholder="Apellido paterno"
            value={formData.apellidoPaterno}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
            required
          />

          <input
            type="text"
            name="apellidoMaterno"
            placeholder="Apellido materno"
            value={formData.apellidoMaterno}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
            required
          />

          <input
            type="text"
            name="usuario"
            placeholder="Usuario"
            value={formData.usuario}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
            required
          />

          <input
            type="password"
            name="contraseña"
            placeholder="Contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
            required
          />

          {error && <div className="text-red-400 text-sm text-center">{error}</div>}

          <button
            type="submit"
            className="w-full text-gray-900 py-3 rounded-lg hover:opacity-90 transition duration-200 font-medium"
            style={{ backgroundColor: "#C3FFD3" }}
          >
            Registrarse
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-300">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-green-300 hover:text-green-200 font-medium">
              Inicia sesión ahora
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
