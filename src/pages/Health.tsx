"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Heart, Thermometer, Footprints, Moon, Flame, AlertTriangle, Activity, Syringe, Scissors } from "lucide-react"
import Layout from "../components/Layout"
import { useAuth } from "../contexts/AuthContext"
import { vitalSignsService } from "../services/vitalSignsService"
import { profileService } from "../services/profileService"
import { medicalHistoryService } from "../services/medicalHistoryService"
import type { SignoVital } from "../types/database"

const Health: React.FC = () => {
  const [currentView, setCurrentView] = useState<"vitals" | "history">("vitals")
  const { currentUser } = useAuth()
  const [vitalSigns, setVitalSigns] = useState<SignoVital[]>([])
  const [userConditions, setUserConditions] = useState<string[]>([])
  const [userAllergies, setUserAllergies] = useState<string[]>([])
  const [medicalHistory, setMedicalHistory] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHealthData()
  }, [currentUser])

  const loadHealthData = async () => {
    if (!currentUser) return

    try {
      // Cargar signos vitales recientes
      const vitals = await vitalSignsService.getVitalSignsHistory(currentUser.id_usuario, 5)
      setVitalSigns(vitals)

      // Cargar condiciones médicas del usuario
      const conditions = await profileService.getUserConditions(currentUser.id_usuario)
      setUserConditions(conditions)

      // Cargar alergias del usuario
      const allergies = await profileService.getUserAllergies(currentUser.id_usuario)
      setUserAllergies(allergies)

      // Cargar historial médico por tipos
      const historyTypes = ["Intervenciones Quirúrgicas", "Vacunas Aplicadas"]
      const historyData: any = {}

      for (const type of historyTypes) {
        const history = await medicalHistoryService.getMedicalHistoryByType(currentUser.id_usuario, type)
        historyData[type] = history.map((item) => item.descripcion)
      }

      setMedicalHistory(historyData)
    } catch (error) {
      console.error("Error loading health data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Datos de signos vitales más recientes o por defecto
  const latestVitals = vitalSigns[0] || {
    presion_arterial: "120/80",
    temperatura: 36.8,
    pasos: 8240,
    horas_sueno: 7.5,
    calorias_quemadas: 1420,
  }

  const vitalSignsDisplay = [
    {
      icon: Heart,
      label: "Presión Arterial",
      value: latestVitals.presion_arterial || "120/80 mmHg",
    },
    {
      icon: Thermometer,
      label: "Temperatura Corporal",
      value: latestVitals.temperatura ? `${latestVitals.temperatura}°C` : "36.8°C",
    },
    {
      icon: Footprints,
      label: "Pasos",
      value: latestVitals.pasos?.toLocaleString() || "8,240",
    },
    {
      icon: Moon,
      label: "Horas de sueño",
      value: latestVitals.horas_sueno ? `${latestVitals.horas_sueno} H` : "7 H 32 MIN",
    },
    {
      icon: Flame,
      label: "Calorías quemadas",
      value: latestVitals.calorias_quemadas?.toLocaleString() || "1,420",
    },
  ]

  // Datos del historial médico combinando BD y datos por defecto
  const medicalHistoryData = {
    alergias: userAllergies.length > 0 ? userAllergies : ["Penicilina", "Polen"],
    enfermedadesCronicas: userConditions.length > 0 ? userConditions : ["Hipertensión", "Asma"],
    intervencionesQuirurgicas:
      medicalHistory["Intervenciones Quirúrgicas"]?.length > 0
        ? medicalHistory["Intervenciones Quirúrgicas"]
        : ["Apendicectomía (2018)", "Cirugía Nasal (2022)"],
    vacunasAplicadas:
      medicalHistory["Vacunas Aplicadas"]?.length > 0
        ? medicalHistory["Vacunas Aplicadas"]
        : ["COVID-19 (Pfizer) - 2021", "Influenza - 2023"],
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-900 pb-20 flex items-center justify-center">
          <div className="text-white text-lg">Cargando datos de salud...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 pb-20">
        {/* Header */}
        <div className="bg-gray-800 p-4">
          <h1 className="text-2xl font-bold text-white text-center mb-4">Salud</h1>

          {/* Tabs */}
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentView("vitals")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === "vitals" ? "bg-yellow-400 text-gray-900" : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              Signos Vitales
            </button>
            <button
              onClick={() => setCurrentView("history")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === "history" ? "text-white" : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
              style={{
                backgroundColor: currentView === "history" ? "#E4D6EB" : undefined,
                color: currentView === "history" ? "#1f2937" : undefined,
              }}
            >
              Historial Médico
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {currentView === "vitals" ? (
            // Vista Signos Vitales
            <div className="bg-yellow-100 rounded-lg p-4 space-y-4">
              {vitalSignsDisplay.map((vital, index) => (
                <div key={index} className="flex items-center space-x-3 py-2">
                  <vital.icon size={20} className="text-gray-700" />
                  <div className="flex-1">
                    <div className="text-gray-800 font-medium">{vital.label}</div>
                    <div className="text-gray-900 font-bold text-lg">{vital.value}</div>
                  </div>
                </div>
              ))}
              {vitalSigns.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <p className="text-sm text-gray-600">
                    Última actualización: {new Date(vitalSigns[0].fecha_hora).toLocaleString("es-ES")}
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Vista Historial Médico
            <div className="rounded-lg p-4" style={{ backgroundColor: "#E4D6EB" }}>
              <div className="space-y-6 text-gray-800">
                {/* Alergias */}
                <div>
                  <h3 className="font-bold text-lg mb-2 flex items-center">
                    <AlertTriangle size={20} className="mr-2" />
                    Alergias:
                  </h3>
                  <ul className="ml-6 space-y-1">
                    {medicalHistoryData.alergias.map((alergia, index) => (
                      <li key={index} className="flex items-center">
                        <span className="mr-2">•</span>
                        {alergia}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Enfermedades Crónicas */}
                <div>
                  <h3 className="font-bold text-lg mb-2 flex items-center">
                    <Activity size={20} className="mr-2" />
                    Enfermedades Crónicas:
                  </h3>
                  <ul className="ml-6 space-y-1">
                    {medicalHistoryData.enfermedadesCronicas.map((enfermedad, index) => (
                      <li key={index} className="flex items-center">
                        <span className="mr-2">•</span>
                        {enfermedad}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Intervenciones Quirúrgicas */}
                <div>
                  <h3 className="font-bold text-lg mb-2 flex items-center">
                    <Scissors size={20} className="mr-2" />
                    Intervenciones Quirúrgicas:
                  </h3>
                  <ul className="ml-6 space-y-1">
                    {medicalHistoryData.intervencionesQuirurgicas.map((intervencion: string, index: number) => (
    <li key={index} className="flex items-center">
      <span className="mr-2">•</span>
      {intervencion}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Vacunas Aplicadas */}
                <div>
                  <h3 className="font-bold text-lg mb-2 flex items-center">
                    <Syringe size={20} className="mr-2" />
                    Vacunas Aplicadas:
                  </h3>
                  <ul className="ml-6 space-y-1">
                    {medicalHistoryData.vacunasAplicadas.map((vacuna: string, index: number) => (
      <li key={index} className="flex items-center">
        <span className="mr-2">•</span>
        {vacuna}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Health
