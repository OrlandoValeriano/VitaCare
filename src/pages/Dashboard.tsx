"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Heart, Moon, Flame, Footprints, Thermometer } from "lucide-react"
import Layout from "../components/Layout"
import { useAuth } from "../contexts/AuthContext"
import { vitalSignsService } from "../services/vitalSignsService"
import { profileService } from "../services/profileService"
import type { SignoVital } from "../types/database"

const Dashboard: React.FC = () => {
  const { currentUser, userProfile } = useAuth()
  const [vitalSigns, setVitalSigns] = useState<SignoVital | null>(null)
  const [userConditions, setUserConditions] = useState<string[]>([])
  const [userAllergies, setUserAllergies] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [currentUser])

  const loadDashboardData = async () => {
    if (!currentUser) return

    try {
      // Cargar signos vitales más recientes
      const latestVitals = await vitalSignsService.getLatestVitalSigns(currentUser.id_usuario)
      setVitalSigns(latestVitals)

      // Cargar condiciones médicas del usuario
      const conditions = await profileService.getUserConditions(currentUser.id_usuario)
      setUserConditions(conditions)

      // Cargar alergias del usuario
      const allergies = await profileService.getUserAllergies(currentUser.id_usuario)
      setUserAllergies(allergies)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Datos por defecto si no hay signos vitales en la BD
  const defaultVitalSigns = {
    presion_arterial: "120/80",
    temperatura: 36.5,
    pasos: 8240,
    horas_sueno: 7.5,
    calorias_quemadas: 1420,
  }

  const displayVitals = vitalSigns || defaultVitalSigns

  const healthMetrics = [
    {
      icon: Heart,
      label: "Presión Arterial",
      value: displayVitals.presion_arterial || "120/80 mmHg",
      color: "text-gray-800",
      bgColor: "#FFC4BD", // Rosa claro
    },
    {
      icon: Thermometer,
      label: "Temperatura",
      value: displayVitals.temperatura ? `${displayVitals.temperatura}°C` : "36.5°C",
      color: "text-gray-800",
      bgColor: "#E4D6EB", // Lila pastel
    },
    {
      icon: Footprints,
      label: "Pasos",
      value: displayVitals.pasos?.toLocaleString() || "8,240",
      color: "text-gray-800",
      bgColor: "#C3FFD3", // Verde menta claro
    },
    {
      icon: Moon,
      label: "Horas de Sueño",
      value: displayVitals.horas_sueno ? `${displayVitals.horas_sueno}h` : "7.5h",
      color: "text-gray-800",
      bgColor: "#E2FAF9", // Azul celeste muy claro
    },
    {
      icon: Flame,
      label: "Calorías",
      value: displayVitals.calorias_quemadas?.toLocaleString() || "1,420",
      color: "text-gray-800",
      bgColor: "#FAFFCA", // Amarillo claro
    },
  ]

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-900 pb-20 flex items-center justify-center">
          <div className="text-white text-lg">Cargando datos...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 pb-20">
        <div className="p-4 space-y-6">
          {/* Profile Card */}
          <div
            className="rounded-lg p-6 text-white"
            style={{ background: "linear-gradient(135deg, #4a5568 0%, #2d3748 100%)" }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">{currentUser?.nombre?.charAt(0) || "U"}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">
                  {currentUser
                    ? `${currentUser.nombre} ${currentUser.apellido_paterno} ${currentUser.apellido_materno}`
                    : "Usuario"}
                </h2>
                <p className="text-blue-100">{userProfile?.tipo_paciente || "Tipo de paciente"}</p>
                <div className="flex space-x-4 mt-2 text-sm">
                  <span>{userProfile?.edad || 0} años</span>
                  <span>{userProfile?.peso_kg || 0} kg</span>
                  <span>{userProfile?.talla_cm || 0} cm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-6">Mi estado actual</h3>
            {vitalSigns && (
              <p className="text-sm text-gray-300 mb-4">
                Última actualización: {new Date(vitalSigns.fecha_hora).toLocaleString("es-ES")}
              </p>
            )}
          </div>

          {/* Health Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            {healthMetrics.map((metric, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-700">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: metric.bgColor }}
                >
                  <metric.icon size={24} className={metric.color} />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                <div className="text-sm text-gray-300">{metric.label}</div>
              </div>
            ))}
          </div>

          {/* Medical Information */}
          {(userConditions.length > 0 || userAllergies.length > 0) && (
            <div className="bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-700">
              <h4 className="font-semibold text-white mb-2">Información médica</h4>
              {userConditions.length > 0 && (
                <div className="mb-2">
                  <span className="text-sm text-gray-300">Condiciones: </span>
                  <span className="text-sm text-white">{userConditions.join(", ")}</span>
                </div>
              )}
              {userAllergies.length > 0 && (
                <div>
                  <span className="text-sm text-gray-300">Alergias: </span>
                  <span className="text-sm text-white">{userAllergies.join(", ")}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
