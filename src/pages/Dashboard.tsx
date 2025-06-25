"use client"

import type React from "react"
import { Heart, Moon, Flame, Footprints } from "lucide-react"
import Layout from "../components/Layout"
import { useUser } from "../contexts/UserContext"

const Dashboard: React.FC = () => {
  const { userData, userProfile } = useUser()

  const healthMetrics = [
    {
      icon: Heart,
      label: "Ritmo Cardíaco",
      value: "67 ppm",
      color: "text-gray-800",
      bgColor: "#FFC4BD", // Rosa claro
    },
    {
      icon: Moon,
      label: "Horas de Sueño",
      value: "8h 10min",
      color: "text-gray-800",
      bgColor: "#E4D6EB", // Lila pastel
    },
    {
      icon: Flame,
      label: "Calorías",
      value: "628 kcal",
      color: "text-gray-800",
      bgColor: "#FAFFCA", // Amarillo claro
    },
    {
      icon: Footprints,
      label: "Total de Pasos",
      value: "2254",
      color: "text-gray-800",
      bgColor: "#C3FFD3", // Verde menta claro
    },
  ]

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
                <span className="text-2xl font-bold">{userData?.nombre?.charAt(0) || "U"}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">
                  {userData ? `${userData.nombre} ${userData.apellidoPaterno} ${userData.apellidoMaterno}` : "Usuario"}
                </h2>
                <p className="text-blue-100">{userProfile?.tipoPaciente || "Tipo de paciente"}</p>
                <div className="flex space-x-4 mt-2 text-sm">
                  <span>{userProfile?.edad || 0} años</span>
                  <span>{userProfile?.peso || 0} kg</span>
                  <span>{userProfile?.talla || 0} cm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-6">Mi estado actual</h3>
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

          {/* Additional Info */}
          {userProfile && (
            <div className="bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-700">
              <h4 className="font-semibold text-white mb-2">Información médica</h4>
              {userProfile.condiciones.length > 0 && (
                <div className="mb-2">
                  <span className="text-sm text-gray-300">Condiciones: </span>
                  <span className="text-sm text-white">{userProfile.condiciones.join(", ")}</span>
                </div>
              )}
              {userProfile.alergias.length > 0 && (
                <div>
                  <span className="text-sm text-gray-300">Alergias: </span>
                  <span className="text-sm text-white">{userProfile.alergias.join(", ")}</span>
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
