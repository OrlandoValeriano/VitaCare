"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Edit, Camera, User, X, Plus } from "lucide-react"
import Layout from "../components/Layout"
import { useUser } from "../contexts/UserContext"

const Profile: React.FC = () => {
  const { userData, userProfile, setUserData, setUserProfile } = useUser()
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [editableData, setEditableData] = useState({
    nombre: userData?.nombre || "",
    apellidoPaterno: userData?.apellidoPaterno || "",
    apellidoMaterno: userData?.apellidoMaterno || "",
    tipoPaciente: userProfile?.tipoPaciente || "Ambulatorio",
    edad: userProfile?.edad || 65,
    peso: userProfile?.peso || 87,
    talla: userProfile?.talla ? userProfile.talla / 100 : 1.75, // Convertir cm a metros
    condiciones: userProfile?.condiciones || ["Hipertensión", "Asma"],
    alergias: userProfile?.alergias || ["Penicilina"],
  })

  const [newCondition, setNewCondition] = useState("")
  const [newAllergy, setNewAllergy] = useState("")

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    // Actualizar datos del usuario
    if (userData) {
      setUserData({
        ...userData,
        nombre: editableData.nombre,
        apellidoPaterno: editableData.apellidoPaterno,
        apellidoMaterno: editableData.apellidoMaterno,
      })
    }

    // Actualizar perfil del usuario
    setUserProfile({
      tipoPaciente: editableData.tipoPaciente,
      edad: editableData.edad,
      peso: editableData.peso,
      talla: Math.round(editableData.talla * 100), // Convertir metros a cm
      condiciones: editableData.condiciones,
      alergias: editableData.alergias,
    })

    setIsEditing(false)
  }

  const addCondition = () => {
    if (newCondition.trim() && !editableData.condiciones.includes(newCondition.trim())) {
      setEditableData({
        ...editableData,
        condiciones: [...editableData.condiciones, newCondition.trim()],
      })
      setNewCondition("")
    }
  }

  const removeCondition = (condition: string) => {
    setEditableData({
      ...editableData,
      condiciones: editableData.condiciones.filter((c) => c !== condition),
    })
  }

  const addAllergy = () => {
    if (newAllergy.trim() && !editableData.alergias.includes(newAllergy.trim())) {
      setEditableData({
        ...editableData,
        alergias: [...editableData.alergias, newAllergy.trim()],
      })
      setNewAllergy("")
    }
  }

  const removeAllergy = (allergy: string) => {
    setEditableData({
      ...editableData,
      alergias: editableData.alergias.filter((a) => a !== allergy),
    })
  }

  const fullName = `${editableData.nombre} ${editableData.apellidoPaterno} ${editableData.apellidoMaterno}`

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 pb-20">
        {/* Header */}
        <div className="bg-gray-800 p-4">
          <h1 className="text-2xl font-bold text-white">Mi perfil</h1>
        </div>

        <div className="p-4 space-y-6">
          {/* Foto de perfil */}
          <div className="flex justify-center">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {profileImage ? (
                  <img
                    src={profileImage || "/placeholder.svg"}
                    alt="Perfil"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <User size={32} className="text-gray-300 mb-1" />
                    <Camera size={16} className="text-gray-400" />
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>
          </div>

          {/* Nombre del usuario */}
          <div className="flex items-center space-x-3">
            <Edit size={20} className="text-gray-400" />
            {isEditing ? (
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={editableData.nombre}
                  onChange={(e) => setEditableData({ ...editableData, nombre: e.target.value })}
                  placeholder="Nombre"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="text"
                  value={editableData.apellidoPaterno}
                  onChange={(e) => setEditableData({ ...editableData, apellidoPaterno: e.target.value })}
                  placeholder="Apellido Paterno"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="text"
                  value={editableData.apellidoMaterno}
                  onChange={(e) => setEditableData({ ...editableData, apellidoMaterno: e.target.value })}
                  placeholder="Apellido Materno"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
            ) : (
              <span className="text-white text-lg font-medium">{fullName}</span>
            )}
          </div>

          {/* Información del usuario */}
          <div className="space-y-4">
            {/* Tipo de paciente */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">Tipo de paciente:</label>
              {isEditing ? (
                <select
                  value={editableData.tipoPaciente}
                  onChange={(e) => setEditableData({ ...editableData, tipoPaciente: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="Ambulatorio">Ambulatorio</option>
                  <option value="Hospitalizado">Hospitalizado</option>
                  <option value="Urgencias">Urgencias</option>
                  <option value="Cuidados intensivos">Cuidados intensivos</option>
                </select>
              ) : (
                <span
                  className="inline-block px-3 py-1 rounded-full text-sm font-medium text-gray-800"
                  style={{ backgroundColor: "#E2FAF9" }}
                >
                  {editableData.tipoPaciente}
                </span>
              )}
            </div>

            {/* Edad, Peso, Talla */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Edad:</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editableData.edad}
                    onChange={(e) => setEditableData({ ...editableData, edad: Number.parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                ) : (
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm font-medium text-gray-800"
                    style={{ backgroundColor: "#E2FAF9" }}
                  >
                    {editableData.edad}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Peso (kg):</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editableData.peso}
                    onChange={(e) => setEditableData({ ...editableData, peso: Number.parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                ) : (
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm font-medium text-gray-800"
                    style={{ backgroundColor: "#E2FAF9" }}
                  >
                    {editableData.peso}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Talla (m):</label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={editableData.talla}
                    onChange={(e) => setEditableData({ ...editableData, talla: Number.parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                ) : (
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm font-medium text-gray-800"
                    style={{ backgroundColor: "#E2FAF9" }}
                  >
                    {editableData.talla}
                  </span>
                )}
              </div>
            </div>

            {/* Condiciones */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">Condiciones:</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editableData.condiciones.map((condition, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-gray-800"
                    style={{ backgroundColor: "#E2FAF9" }}
                  >
                    {condition}
                    {isEditing && (
                      <button
                        onClick={() => removeCondition(condition)}
                        className="ml-2 text-gray-600 hover:text-gray-800"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {isEditing && (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    placeholder="Nueva condición"
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                    onKeyPress={(e) => e.key === "Enter" && addCondition()}
                  />
                  <button
                    onClick={addCondition}
                    className="px-3 py-2 rounded-lg text-gray-800 hover:opacity-90"
                    style={{ backgroundColor: "#C3FFD3" }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Alergias */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">Alergias:</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editableData.alergias.map((allergy, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-gray-800"
                    style={{ backgroundColor: "#E2FAF9" }}
                  >
                    {allergy}
                    {isEditing && (
                      <button onClick={() => removeAllergy(allergy)} className="ml-2 text-gray-600 hover:text-gray-800">
                        <X size={14} />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {isEditing && (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="Nueva alergia"
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                    onKeyPress={(e) => e.key === "Enter" && addAllergy()}
                  />
                  <button
                    onClick={addAllergy}
                    className="px-3 py-2 rounded-lg text-gray-800 hover:opacity-90"
                    style={{ backgroundColor: "#C3FFD3" }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-4 pt-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 rounded-lg font-medium text-gray-800 hover:opacity-90 transition-colors"
                  style={{ backgroundColor: "#C3FFD3" }}
                >
                  Guardar cambios
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 rounded-lg font-medium text-white bg-gray-600 hover:bg-gray-500 transition-colors"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-3 rounded-lg font-medium text-gray-800 hover:opacity-90 transition-colors"
                style={{ backgroundColor: "#C3FFD3" }}
              >
                Editar perfil
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile
