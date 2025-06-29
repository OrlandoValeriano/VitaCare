import { supabase } from "../lib/supabase"
import type { HistorialMedico } from "../types/database"

export const medicalHistoryService = {
  // Obtener historial médico por tipo
  async getMedicalHistoryByType(userId: number, tipo: string): Promise<HistorialMedico[]> {
    try {
      const { data, error } = await supabase
        .from("historial_medico")
        .select("*")
        .eq("id_usuario", userId)
        .eq("tipo_historial", tipo)

      if (error) {
        console.error("Error fetching medical history:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Exception in getMedicalHistoryByType:", error)
      return []
    }
  },

  // Obtener todo el historial médico
  async getAllMedicalHistory(userId: number): Promise<HistorialMedico[]> {
    try {
      const { data, error } = await supabase
        .from("historial_medico")
        .select("*")
        .eq("id_usuario", userId)
        .order("id_historial", { ascending: false })

      if (error) {
        console.error("Error fetching all medical history:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Exception in getAllMedicalHistory:", error)
      return []
    }
  },

  // Crear entrada en historial médico
  async createMedicalHistory(historyData: Omit<HistorialMedico, "id_historial">): Promise<HistorialMedico | null> {
    try {
      const { data, error } = await supabase.from("historial_medico").insert([historyData]).select().maybeSingle()

      if (error) {
        console.error("Error creating medical history:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Exception in createMedicalHistory:", error)
      return null
    }
  },
}
