import { supabase } from "../lib/supabase"
import type { Cita } from "../types/database"

export const appointmentService = {
  // Obtener citas pendientes
  async getUpcomingAppointments(userId: number): Promise<Cita[]> {
    try {
      const { data, error } = await supabase
        .from("citas")
        .select("*")
        .eq("id_usuario", userId)
        .eq("estado", "Pendiente")
        .order("fecha", { ascending: true })
        .order("hora", { ascending: true })

      if (error) {
        console.error("Error fetching upcoming appointments:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Exception in getUpcomingAppointments:", error)
      return []
    }
  },

  // Obtener historial de citas
  async getAppointmentHistory(userId: number): Promise<Cita[]> {
    try {
      const { data, error } = await supabase
        .from("citas")
        .select("*")
        .eq("id_usuario", userId)
        .neq("estado", "Pendiente")
        .order("fecha", { ascending: false })

      if (error) {
        console.error("Error fetching appointment history:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Exception in getAppointmentHistory:", error)
      return []
    }
  },

  // Crear nueva cita
  async createAppointment(appointment: Omit<Cita, "id_cita">): Promise<Cita | null> {
    try {
      const { data, error } = await supabase.from("citas").insert([appointment]).select().maybeSingle()

      if (error) {
        console.error("Error creating appointment:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Exception in createAppointment:", error)
      return null
    }
  },

  // Obtener todas las citas del usuario
  async getAllAppointments(userId: number): Promise<Cita[]> {
    try {
      const { data, error } = await supabase
        .from("citas")
        .select("*")
        .eq("id_usuario", userId)
        .order("fecha", { ascending: false })

      if (error) {
        console.error("Error fetching all appointments:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Exception in getAllAppointments:", error)
      return []
    }
  },

  // Actualizar estado de cita
  async updateAppointmentStatus(appointmentId: number, status: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("citas").update({ estado: status }).eq("id_cita", appointmentId)

      if (error) {
        console.error("Error updating appointment status:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Exception in updateAppointmentStatus:", error)
      return false
    }
  },
}
