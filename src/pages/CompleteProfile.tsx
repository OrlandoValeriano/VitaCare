"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, X } from "lucide-react"
import { useUser } from "../contexts/UserContext"

const CompleteProfile: React.FC = () => {
  const [formData, setFormData] = useState({
    edad: "",
    talla: "",
    peso: "",
    tipoPaciente: "",
    condiciones: [""],
    alergias: [""],
  })

  const { setUserProfile } = useUser()
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const profileData = {
      edad: Number.parseInt(formData.edad),
      talla: Number.parseInt(formData.talla),
      peso: Number.parseInt(formData.peso),
      tipoPaciente: formData.tipoPaciente,
      condiciones: formData.condiciones.filter((c) => c.trim() !== ""),
      alergias: formData.alergias.filter((a) => a.trim() !== ""),
    }

    setUserProfile(profileData)
    navigate("/dashboard")
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
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Peso (kg)</label>
              <input
                type="number"
                name="peso"
                value={formData.peso}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white"
                required
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
            >
              <option value="">Seleccionar tipo</option>
              <option value="Paciente regular">Paciente regular</option>
              <option value="Paciente crónico">Paciente crónico</option>
              <option value="Paciente de emergencia">Paciente de emergencia</option>
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
                />
                {formData.condiciones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeField(index, "condiciones")}
                    className="p-2 text-red-400 hover:bg-red-900 rounded-lg"
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
                />
                {formData.alergias.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeField(index, "alergias")}
                    className="p-2 text-red-400 hover:bg-red-900 rounded-lg"
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

          <button
            type="submit"
            className="w-full text-gray-900 py-3 rounded-lg hover:opacity-90 transition duration-200 font-medium"
            style={{ backgroundColor: "#C3FFD3" }}
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  )
}

export default CompleteProfile
