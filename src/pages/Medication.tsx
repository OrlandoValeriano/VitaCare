"use client"

import type React from "react"
import { useState } from "react"
import { Plus, X, Clock, Pill, Archive, FileText, CheckCircle } from "lucide-react"
import Layout from "../components/Layout"

interface Medication {
  id: number
  name: string
  type: string
  dosage: string
  frequency: string
  nextDose: string
  remainingDoses: number
  duration: string
  notifications: boolean
  status: "active" | "completed" | "suspended"
  icon: any
}

const Medication: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: 1,
      name: "Paracetamol 500mg",
      type: "Analgésico",
      dosage: "Cada 8 horas",
      frequency: "Cada 8 horas",
      nextDose: "2:00 PM",
      remainingDoses: 3,
      duration: "7 días",
      notifications: true,
      status: "active",
      icon: Pill,
    },
    {
      id: 2,
      name: "Amoxicilina 250mg",
      type: "Antibiótico",
      dosage: "Cada 12 horas",
      frequency: "Cada 12 horas",
      nextDose: "6:00 PM",
      remainingDoses: 8,
      duration: "10 días",
      notifications: true,
      status: "active",
      icon: Pill,
    },
    {
      id: 3,
      name: "Ibuprofeno 400mg",
      type: "Antiinflamatorio",
      dosage: "Cada 6 horas",
      frequency: "Cada 6 horas",
      nextDose: "Finalizado",
      remainingDoses: 0,
      duration: "5 días",
      notifications: false,
      status: "completed",
      icon: Pill,
    },
  ])

  const [newMedication, setNewMedication] = useState({
    name: "",
    type: "Analgésico",
    frequency: "",
    firstDose: "",
    duration: "",
    notifications: true,
  })

  const activeMedications = medications.filter((med) => med.status === "active")
  const medicationHistory = medications.filter((med) => med.status !== "active")

  const medicationTypes = ["Analgésico", "Antibiótico", "Antiinflamatorio", "Antihipertensivo", "Vitamina", "Otro"]

  const getMedicationIcon = (type: string) => {
    const iconMap: { [key: string]: any } = {
      Analgésico: Pill,
      Antibiótico: Pill,
      Antiinflamatorio: Pill,
      Antihipertensivo: Pill,
      Vitamina: Pill,
      Otro: Pill,
    }
    return iconMap[type] || Pill
  }

  const handleSaveMedication = () => {
    if (newMedication.name && newMedication.frequency && newMedication.firstDose && newMedication.duration) {
      const medication: Medication = {
        id: medications.length + 1,
        name: newMedication.name,
        type: newMedication.type,
        dosage: newMedication.frequency,
        frequency: newMedication.frequency,
        nextDose: newMedication.firstDose,
        remainingDoses: 10, // Valor por defecto
        duration: newMedication.duration,
        notifications: newMedication.notifications,
        status: "active",
        icon: getMedicationIcon(newMedication.type),
      }

      setMedications([...medications, medication])
      setNewMedication({
        name: "",
        type: "Analgésico",
        frequency: "",
        firstDose: "",
        duration: "",
        notifications: true,
      })
      setShowModal(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 pb-20">
        {/* Header */}
        <div className="bg-gray-800 p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Medicación</h1>
          <button
            onClick={() => setShowModal(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-800 hover:opacity-90 transition-colors"
            style={{ backgroundColor: "#C3FFD3" }}
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Medicación Activa */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Medicación Activa</h2>
            <div className="space-y-3">
              {activeMedications.map((medication) => (
                <div key={medication.id} className="rounded-lg p-4" style={{ backgroundColor: "#C3FFD3" }}>
                  <div className="text-gray-800">
                    <div className="flex items-center mb-2">
                      <Pill size={20} className="mr-2 text-gray-700" />
                      <span className="font-bold text-lg">{medication.name}</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2" />
                        <span>
                          {medication.dosage} – {medication.remainingDoses} dosis restantes
                        </span>
                      </div>
                      <div>
                        <strong>Próxima toma:</strong> {medication.nextDose}
                      </div>
                      <div>
                        <strong>Tipo:</strong> {medication.type}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historial de Medicamentos */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Archive size={20} className="mr-2" />
              Historial de medicamentos
            </h2>
            <div className="space-y-3">
              {medicationHistory.map((medication) => (
                <div key={medication.id} className="rounded-lg p-4" style={{ backgroundColor: "#FAFFCA" }}>
                  <div className="text-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Pill size={16} className="mr-2 text-gray-700" />
                        <span className="font-bold">{medication.name}</span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          medication.status === "completed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {medication.status === "completed" ? "Finalizado" : "Suspendido"}
                      </span>
                    </div>
                    <div className="text-sm space-y-1">
                      <div>
                        <strong>Dosis:</strong> {medication.dosage}
                      </div>
                      <div>
                        <strong>Tipo:</strong> {medication.type}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Añadir Medicamento */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md text-white max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <FileText size={20} className="mr-2" />
                  Añadir Medicamento
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre del medicamento</label>
                  <input
                    type="text"
                    placeholder="Ej: Paracetamol 500mg"
                    value={newMedication.name}
                    onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tipo</label>
                  <select
                    value={newMedication.type}
                    onChange={(e) => setNewMedication({ ...newMedication, type: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    {medicationTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Frecuencia</label>
                  <input
                    type="text"
                    placeholder="Ej: Cada 8 horas"
                    value={newMedication.frequency}
                    onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Hora de primera dosis</label>
                  <input
                    type="time"
                    value={newMedication.firstDose}
                    onChange={(e) => setNewMedication({ ...newMedication, firstDose: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Duración del tratamiento</label>
                  <input
                    type="text"
                    placeholder="Ej: 7 días"
                    value={newMedication.duration}
                    onChange={(e) => setNewMedication({ ...newMedication, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Notificaciones de próximas tomas</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="notifications"
                        checked={newMedication.notifications === true}
                        onChange={() => setNewMedication({ ...newMedication, notifications: true })}
                        className="mr-2"
                      />
                      <span>Sí</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="notifications"
                        checked={newMedication.notifications === false}
                        onChange={() => setNewMedication({ ...newMedication, notifications: false })}
                        className="mr-2"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleSaveMedication}
                  className="w-full py-3 rounded-lg font-medium text-gray-800 hover:opacity-90 transition-colors flex items-center justify-center mt-6"
                  style={{ backgroundColor: "#C3FFD3" }}
                >
                  <CheckCircle size={20} className="mr-2" />
                  GUARDAR MEDICAMENTO
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Medication
