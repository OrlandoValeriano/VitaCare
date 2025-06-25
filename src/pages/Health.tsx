"use client"

import type React from "react"
import { useState } from "react"
import { Heart, Thermometer, Footprints, Moon, Flame, AlertTriangle, Activity, Syringe, Scissors } from "lucide-react"
import Layout from "../components/Layout"
import { useUser } from "../contexts/UserContext"

const Health: React.FC = () => {
  const [currentView, setCurrentView] = useState<"vitals" | "history">("vitals")
  const { userProfile } = useUser()

  // Datos de signos vitales
  const vitalSigns = [
    {
      icon: Heart,
      label: "Frecuencia Cardíaca",
      value: "82 LPM",
    },
    {
      icon: Thermometer,
      label: "Temperatura Corporal",
      value: "36.8°C",
    },
    {
      icon: Footprints,
      label: "Pasos",
      value: "8,240",
    },
    {
      icon: Moon,
      label: "Horas de sueño",
      value: "7 H 32 MIN",
    },
    {
      icon: Flame,
      label: "Calorías quemadas",
      value: "1,420",
    },
  ]

  // Datos del historial médico
  const medicalHistory = {
    alergias: userProfile?.alergias || ["Penicilina", "Polen"],
    enfermedadesCronicas: ["Hipertensión", "Asma"],
    intervencionesQuirurgicas: ["Apendicectomía (2018)", "Cirugía Nasal (2022)"],
    vacunasAplicadas: ["COVID-19 (Pfizer) - 2021", "Influenza - 2023"],
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
              {vitalSigns.map((vital, index) => (
                <div key={index} className="flex items-center space-x-3 py-2">
                  <vital.icon size={20} className="text-gray-700" />
                  <div className="flex-1">
                    <div className="text-gray-800 font-medium">{vital.label}</div>
                    <div className="text-gray-900 font-bold text-lg">{vital.value}</div>
                  </div>
                </div>
              ))}
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
                    {medicalHistory.alergias.map((alergia, index) => (
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
                    {medicalHistory.enfermedadesCronicas.map((enfermedad, index) => (
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
                    {medicalHistory.intervencionesQuirurgicas.map((intervencion, index) => (
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
                    {medicalHistory.vacunasAplicadas.map((vacuna, index) => (
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
