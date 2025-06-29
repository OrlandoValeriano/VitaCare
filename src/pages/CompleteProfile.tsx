"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, X } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { profileService } from "../services/profileService"

const CompleteProfile: React.FC = () => {
  const [formData, setFormData] = useState({
    edad: "",
    talla: "",
    peso: "",
    tipoPaciente: "",
    condiciones: [""],
    alergias: [""],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleArrayChange = (index: number, value: string, field: "condiciones" | "alergias") => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData({
      ...formData,
      [field]: newArray,
    })
  }

  const addField = (field: "condiciones" | "alergias") => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ""],
    })
  }

  const removeField = (index: number, field: "condiciones" | "alergias") => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index)
      setFormData({
        ...formData,
        [field]: newArray,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser) {
      setError("Usuario no autenticado")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Crear perfil de usuario
      const profileData = {
        id_usuario: currentUser.id_usuario,
        edad: Number.parseInt(formData.edad),
        talla_cm: Number.parseInt(formData.talla),
        peso_kg: Number.parseFloat(formData.peso),
        tipo_paciente: formData.tipoPaciente,
      }

      const profile = await profileService.createProfile(profileData)

      if (!profile) {
        setError("Error al crear el perfil")
        return
      }

      // Sincronizar condiciones médicas
      const condiciones = formData.condiciones.filter((c) => c.trim() !== "")
      if (condiciones.length > 0) {
        await profileService.syncUserConditions(currentUser.id_usuario, condiciones)
      }

      // Sincronizar alergias
      const alergias = formData.alergias.filter((a) => a.trim() !== "")
      if (alergias.length > 0) {
        await profileService.syncUserAllergies(currentUser.id_usuario, alergias)
      }

      navigate("/dashboard")
    } catch (error) {
      console.error("Error completing profile:", error)
      setError("Error al completar el perfil")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Completa tu perfil</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Edad</label>
              <input
                type="number"
                name="edad"
                value={formData.edad}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Talla (cm)</label>
              <input
                type="number"
                name="talla"
                value={formData.talla}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                name="peso"
                value={formData.peso}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de paciente</label>
            <select
              name="tipoPaciente"
              value={formData.tipoPaciente}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white"
              required
              disabled={isLoading}
            >
              <option value="">Seleccionar tipo</option>
              <option value="Ambulatorio">Ambulatorio</option>
              <option value="Hospitalizado">Hospitalizado</option>
              <option value="Urgencias">Urgencias</option>
              <option value="Cuidados intensivos">Cuidados intensivos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Condiciones médicas</label>
            {formData.condiciones.map((condicion, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={condicion}
                  onChange={(e) => handleArrayChange(index, e.target.value, "condiciones")}
                  placeholder="Condición médica"
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-gray-400"
                  disabled={isLoading}
                />
                {formData.condiciones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeField(index, "condiciones")}
                    className="p-2 text-red-400 hover:bg-red-900 rounded-lg"
                    disabled={isLoading}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addField("condiciones")}
              className="flex items-center space-x-1 text-green-300 hover:text-green-200"
              disabled={isLoading}
            >
              <Plus size={16} />
              <span>Agregar condición</span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Alergias</label>
            {formData.alergias.map((alergia, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={alergia}
                  onChange={(e) => handleArrayChange(index, e.target.value, "alergias")}
                  placeholder="Alergia"
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-gray-400"
                  disabled={isLoading}
                />
                {formData.alergias.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeField(index, "alergias")}
                    className="p-2 text-red-400 hover:bg-red-900 rounded-lg"
                    disabled={isLoading}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addField("alergias")}
              className="flex items-center space-x-1 text-green-300 hover:text-green-200"
              disabled={isLoading}
            >
              <Plus size={16} />
              <span>Agregar alergia</span>
            </button>
          </div>

          <div className="bg-blue-900 p-3 rounded-lg border border-blue-700">
            <p className="text-sm text-blue-200">
              Si tienes más de una condición o síntoma, agrégala y envía toda la información al finalizar.
            </p>
          </div>

          {error && <div className="text-red-400 text-sm text-center">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-gray-900 py-3 rounded-lg hover:opacity-90 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#C3FFD3" }}
          >
            {isLoading ? "Guardando..." : "Continuar"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CompleteProfile
