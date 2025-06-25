"use client"

import type React from "react"
import { useState } from "react"
import { Plus, CalendarIcon, X, Calendar, Clock, FileText, CheckCircle } from "lucide-react"
import Layout from "../components/Layout"

interface Appointment {
  id: number
  date: string
  time: string
  specialty: string
  doctor: string
  type: "Hospitalaria" | "Virtual" | "Domiciliaria"
  location?: string
  notes?: string
  status: "upcoming" | "completed"
}

const Appointments: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      date: "2025-01-16",
      time: "10:00 AM",
      specialty: "Nutriólogo",
      doctor: "Dr. Sánchez",
      type: "Hospitalaria",
      status: "upcoming",
    },
    {
      id: 2,
      date: "2025-01-15",
      time: "4:00 PM",
      specialty: "Hospitalaria",
      doctor: "Dr. García",
      type: "Hospitalaria",
      notes: "Presión arterial elevada",
      status: "completed",
    },
  ])

  const [newAppointment, setNewAppointment] = useState({
    date: "",
    time: "",
    specialty: "",
    motivo: "",
    type: "Hospitalaria" as "Hospitalaria" | "Virtual" | "Domiciliaria",
    location: "",
  })

  const upcomingAppointments = appointments.filter((apt) => apt.status === "upcoming")
  const pastAppointments = appointments.filter((apt) => apt.status === "completed")

  const handleCreateAppointment = () => {
    if (newAppointment.date && newAppointment.time && newAppointment.specialty) {
      const appointment: Appointment = {
        id: appointments.length + 1,
        date: newAppointment.date,
        time: newAppointment.time,
        specialty: newAppointment.specialty,
        doctor: "Dr. Asignado",
        type: newAppointment.type,
        location: newAppointment.location,
        status: "upcoming",
      }

      setAppointments([...appointments, appointment])
      setNewAppointment({
        date: "",
        time: "",
        specialty: "",
        motivo: "",
        type: "Hospitalaria",
        location: "",
      })
      setShowModal(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const generateCalendar = () => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const hasAppointment = appointments.some((apt) => apt.date === dateString)

      days.push(
        <div
          key={day}
          className={`h-8 flex items-center justify-center text-sm rounded cursor-pointer transition-colors ${
            hasAppointment
              ? "bg-blue-600 text-white hover:bg-blue-500"
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          }`}
        >
          {day}
        </div>,
      )
    }

    return days
  }

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  return (
    <Layout>
      <div className="p-4 pb-20 space-y-6 bg-gray-900 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Mis citas</h1>
          <button
            onClick={() => setShowModal(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-800 hover:opacity-90 transition-colors"
            style={{ backgroundColor: "#C3FFD3" }}
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Calendar */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
              className="p-2 hover:bg-gray-700 rounded text-white"
            >
              ←
            </button>
            <h3 className="text-lg font-semibold text-white">
              {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </h3>
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
              className="p-2 hover:bg-gray-700 rounded text-white"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["D", "L", "M", "M", "J", "V", "S"].map((day) => (
              <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-400">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">{generateCalendar()}</div>
        </div>

        {/* Próximas citas */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
            <Calendar size={20} className="mr-2" />
            Próximas citas
          </h2>
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="rounded-lg p-4" style={{ backgroundColor: "#C3FFD3" }}>
                <div className="text-gray-800">
                  <div className="font-semibold">
                    {formatDate(appointment.date)} - {appointment.time}
                  </div>
                  <div className="text-sm mt-1">{appointment.specialty}</div>
                  <div className="text-sm">{appointment.doctor}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Historial de citas */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
            <FileText size={20} className="mr-2" />
            Historial de citas
          </h2>
          <div className="space-y-3">
            {pastAppointments.map((appointment) => (
              <div key={appointment.id} className="rounded-lg p-4" style={{ backgroundColor: "#FAFFCA" }}>
                <div className="text-gray-800">
                  <div className="font-semibold">
                    {formatDate(appointment.date)} - {appointment.time}
                  </div>
                  <div className="text-sm mt-1">Consulta General - {appointment.specialty}</div>
                  {appointment.notes && <div className="text-sm text-gray-600 mt-1">Notas: {appointment.notes}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Nueva Cita */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md text-white">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <CalendarIcon className="mr-2" size={20} />
                  Nueva cita
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center">
                      <Calendar size={16} className="mr-1" />
                      Fecha:
                    </label>
                    <input
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center">
                      <Clock size={16} className="mr-1" />
                      Hora:
                    </label>
                    <input
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Especialidad: Cardiología</label>
                  <input
                    type="text"
                    placeholder="Ej. Cardiología"
                    value={newAppointment.specialty}
                    onChange={(e) => setNewAppointment({ ...newAppointment, specialty: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Motivo: Revisión mensual</label>
                  <input
                    type="text"
                    placeholder="Motivo de la consulta"
                    value={newAppointment.motivo}
                    onChange={(e) => setNewAppointment({ ...newAppointment, motivo: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tipo de atención:</label>
                  <div className="space-y-2">
                    {(["Hospitalaria", "Virtual", "Domiciliaria"] as const).map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="radio"
                          name="type"
                          value={type}
                          checked={newAppointment.type === type}
                          onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value as any })}
                          className="mr-2"
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Ubicación: (opcional)</label>
                  <input
                    type="text"
                    placeholder="Ubicación"
                    value={newAppointment.location}
                    onChange={(e) => setNewAppointment({ ...newAppointment, location: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  />
                </div>

                <button
                  onClick={handleCreateAppointment}
                  className="w-full py-3 rounded-lg font-medium text-gray-800 hover:opacity-90 transition-colors flex items-center justify-center"
                  style={{ backgroundColor: "#C3FFD3" }}
                >
                  <CheckCircle size={20} className="mr-2" />
                  AGENDAR CITA
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Appointments
