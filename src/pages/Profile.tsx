"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Edit, Camera, User, X, Plus, Save, AlertCircle, CheckCircle } from "lucide-react"
import Layout from "../components/Layout"
import { useAuth } from "../contexts/AuthContext"
import { profileService } from "../services/profileService"


const Profile: React.FC = () => {
  const { currentUser, setUserData, setUserProfile } = useAuth()
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Datos originales (para cancelar edición)
  const [originalData, setOriginalData] = useState<any>(null)

  // Datos editables
  const [editableData, setEditableData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    tipoPaciente: "Ambulatorio",
    edad: 0,
    peso: 0,
    talla: 0, // En metros para mostrar
    condiciones: [] as string[],
    alergias: [] as string[],
  })

  const [newCondition, setNewCondition] = useState("")
  const [newAllergy, setNewAllergy] = useState("")

  useEffect(() => {
    loadUserProfile()
  }, [currentUser])

  const loadUserProfile = async () => {
    if (!currentUser) return

    setLoading(true)
    setError("")

    try {
      const completeProfile = await profileService.getCompleteUserProfile(currentUser.id_usuario)

      if (completeProfile) {
        const { user, profile, conditions, allergies } = completeProfile

        const profileData = {
          nombre: user.nombre || "",
          apellidoPaterno: user.apellido_paterno || "",
          apellidoMaterno: user.apellido_materno || "",
          tipoPaciente: profile?.tipo_paciente || "Ambulatorio",
          edad: profile?.edad || 0,
          peso: profile?.peso_kg || 0,
          talla: profile?.talla_cm ? profile.talla_cm / 100 : 0, // Convertir cm a metros
          condiciones: conditions || [],
          alergias: allergies || [],
        }

        setEditableData(profileData)
        setOriginalData(profileData) // Guardar datos originales
      } else {
        // Si no hay perfil, usar datos básicos del usuario
        const basicData = {
          nombre: currentUser.nombre || "",
          apellidoPaterno: currentUser.apellido_paterno || "",
          apellidoMaterno: currentUser.apellido_materno || "",
          tipoPaciente: "Ambulatorio",
          edad: 0,
          peso: 0,
          talla: 0,
          condiciones: [],
          alergias: [],
        }
        setEditableData(basicData)
        setOriginalData(basicData)
      }
    } catch (error) {
      console.error("Error loading user profile:", error)
      setError("Error al cargar el perfil del usuario")
    } finally {
      setLoading(false)
    }
  }

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

  const handleSave = async () => {
    if (!currentUser) return

    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const success = await profileService.updateCompleteProfile(currentUser.id_usuario, {
        nombre: editableData.nombre,
        apellido_paterno: editableData.apellidoPaterno,
        apellido_materno: editableData.apellidoMaterno,
        edad: editableData.edad,
        peso_kg: editableData.peso,
        talla_cm: Math.round(editableData.talla * 100), // Convertir metros a cm
        tipo_paciente: editableData.tipoPaciente,
        condiciones: editableData.condiciones,
        alergias: editableData.alergias,
      })

      if (success) {
        // Actualizar contexto de usuario
        if (setUserData) {
          setUserData({
            ...currentUser,
            nombre: editableData.nombre,
            apellido_paterno: editableData.apellidoPaterno,
            apellido_materno: editableData.apellidoMaterno,
          })
        }

        if (setUserProfile) {
          setUserProfile({
            id_perfil: 0, // Se actualizará automáticamente
            id_usuario: currentUser.id_usuario,
            edad: editableData.edad,
            talla_cm: Math.round(editableData.talla * 100),
            peso_kg: editableData.peso,
            tipo_paciente: editableData.tipoPaciente,
          })
        }

        setOriginalData({ ...editableData }) // Actualizar datos originales
        setIsEditing(false)
        setSuccess("Perfil actualizado correctamente")

        // Limpiar mensaje de éxito después de 3 segundos
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError("Error al actualizar el perfil")
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      setError("Error al guardar los cambios")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    // Restaurar datos originales
    if (originalData) {
      setEditableData({ ...originalData })
    }
    setIsEditing(false)
    setError("")
    setSuccess("")
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

  const fullName = `${editableData.nombre} ${editableData.apellidoPaterno} ${editableData.apellidoMaterno}`.trim()

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-900 pb-20 flex items-center justify-center">
          <div className="text-white text-lg">Cargando perfil...</div>
        </div>
      </Layout>
    )
  }
  

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 pb-20">
        {/* Header */}
        <div className="bg-gray-800 p-4">
          <h1 className="text-2xl font-bold text-white">Mi perfil</h1>
        </div>

        <div className="p-4 space-y-6">
          {/* Mensajes de estado */}
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle size={20} className="mr-2" />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-900 border border-green-700 text-green-100 px-4 py-3 rounded-lg flex items-center">
              <CheckCircle size={20} className="mr-2" />
              {success}
            </div>
          )}

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
              <span className="text-white text-lg font-medium">{fullName || "Sin nombre"}</span>
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
                    onChange={(e) => setEditableData({ ...editableData, edad: Number.parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                ) : (
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm font-medium text-gray-800"
                    style={{ backgroundColor: "#E2FAF9" }}
                  >
                    {editableData.edad || "No definido"}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Peso (kg):</label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.1"
                    value={editableData.peso}
                    onChange={(e) => setEditableData({ ...editableData, peso: Number.parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                ) : (
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm font-medium text-gray-800"
                    style={{ backgroundColor: "#E2FAF9" }}
                  >
                    {editableData.peso || "No definido"}
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
                    onChange={(e) =>
                      setEditableData({ ...editableData, talla: Number.parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                ) : (
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm font-medium text-gray-800"
                    style={{ backgroundColor: "#E2FAF9" }}
                  >
                    {editableData.talla || "No definido"}
                  </span>
                )}
              </div>
            </div>

            {/* Condiciones */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">Condiciones médicas:</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editableData.condiciones.length > 0 ? (
                  editableData.condiciones.map((condition, index) => (
                    <span
                      key={`condition-${index}`}
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
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No hay condiciones registradas</span>
                )}
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
                {editableData.alergias.length > 0 ? (
                  editableData.alergias.map((allergy, index) => (
                    <span
                      key={`allergy-${index}`}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-gray-800"
                      style={{ backgroundColor: "#E2FAF9" }}
                    >
                      {allergy}
                      {isEditing && (
                        <button
                          onClick={() => removeAllergy(allergy)}
                          className="ml-2 text-gray-600 hover:text-gray-800"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No hay alergias registradas</span>
                )}
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
                  disabled={saving}
                  className="flex-1 py-3 rounded-lg font-medium text-gray-800 hover:opacity-90 transition-colors flex items-center justify-center"
                  style={{ backgroundColor: "#C3FFD3" }}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800 mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={20} className="mr-2" />
                      Guardar cambios
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex-1 py-3 rounded-lg font-medium text-white bg-gray-600 hover:bg-gray-500 transition-colors"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-3 rounded-lg font-medium text-gray-800 hover:opacity-90 transition-colors flex items-center justify-center"
                style={{ backgroundColor: "#C3FFD3" }}
              >
                <Edit size={20} className="mr-2" />
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
