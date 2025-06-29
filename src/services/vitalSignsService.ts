import { supabase } from "../lib/supabase"
import type { SignoVital } from "../types/database"

export const vitalSignsService = {
  // Obtener signos vitales más recientes (usar maybeSingle para evitar error 406)
  async getLatestVitalSigns(userId: number): Promise<SignoVital | null> {
    try {
      const { data, error } = await supabase
        .from("signos_vitales")
        .select("*")
        .eq("id_usuario", userId)
        .order("fecha_hora", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error("Error fetching latest vital signs:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Exception in getLatestVitalSigns:", error)
      return null
    }
  },

  // Obtener historial de signos vitales (sin single, puede devolver array vacío)
  async getVitalSignsHistory(userId: number, limit = 10): Promise<SignoVital[]> {
    try {
      const { data, error } = await supabase
        .from("signos_vitales")
        .select("*")
        .eq("id_usuario", userId)
        .order("fecha_hora", { ascending: false })
        .limit(limit)

      if (error) {
        console.error("Error fetching vital signs history:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Exception in getVitalSignsHistory:", error)
      return []
    }
  },

  // Crear nuevo registro de signos vitales
  async createVitalSigns(vitalSigns: Omit<SignoVital, "id_signo" | "fecha_hora">): Promise<SignoVital | null> {
    try {
      const { data, error } = await supabase.from("signos_vitales").insert([vitalSigns]).select().maybeSingle()

      if (error) {
        console.error("Error creating vital signs:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Exception in createVitalSigns:", error)
      return null
    }
  },

  // Obtener todos los signos vitales de un usuario
  async getAllVitalSigns(userId: number): Promise<SignoVital[]> {
    try {
      const { data, error } = await supabase
        .from("signos_vitales")
        .select("*")
        .eq("id_usuario", userId)
        .order("fecha_hora", { ascending: false })

      if (error) {
        console.error("Error fetching all vital signs:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Exception in getAllVitalSigns:", error)
      return []
    }
  },
}
