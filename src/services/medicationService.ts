import { supabase } from "../lib/supabase"

export const medicationService = {
  // Obtener medicamentos activos con detalles
  async getActiveMedications(userId: number): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from("medicamentos")
        .select(`
          *,
          medicamento_detalle (*)
        `)
        .eq("id_usuario", userId)
        .eq("medicamento_detalle.estado", "activo")

      if (error) {
        console.error("Error fetching active medications:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Exception in getActiveMedications:", error)
      return []
    }
  },

  // Obtener historial de medicamentos
  async getMedicationHistory(userId: number): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from("medicamentos")
        .select(`
          *,
          medicamento_detalle (*)
        `)
        .eq("id_usuario", userId)
        .neq("medicamento_detalle.estado", "activo")

      if (error) {
        console.error("Error fetching medication history:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Exception in getMedicationHistory:", error)
      return []
    }
  },

  // Crear nuevo medicamento (CORREGIDO)
  async createMedication(medicationData: {
    nombre: string
    tipo: string
    frecuencia: string
    hora_primera_dosis: string
    duracion_dias: number
    notificaciones: boolean
    userId: number
  }): Promise<boolean> {
    try {
      // PASO 1: Crear medicamento básico
      const { data: medication, error: medError } = await supabase
        .from("medicamentos")
        .insert([
          {
            id_usuario: medicationData.userId,
            nombre: medicationData.nombre,
            tipo: medicationData.tipo,
          },
        ])
        .select()
        .maybeSingle()

      if (medError || !medication) {
        console.error("Error creating medication:", medError)
        return false
      }

      // PASO 2: Crear detalle del medicamento
      const { error: detailError } = await supabase.from("medicamento_detalle").insert([
        {
          id_medicamento: medication.id_medicamento,
          frecuencia: medicationData.frecuencia,
          hora_primera_dosis: medicationData.hora_primera_dosis,
          duracion_dias: medicationData.duracion_dias,
          estado: "activo",
          proxima_toma: medicationData.hora_primera_dosis,
          dosis_restantes: medicationData.duracion_dias * 3, // Estimación: 3 dosis por día
        },
      ])

      if (detailError) {
        console.error("Error creating medication detail:", detailError)
        // Si falla el detalle, eliminar el medicamento creado
        await supabase.from("medicamentos").delete().eq("id_medicamento", medication.id_medicamento)
        return false
      }

      return true
    } catch (error) {
      console.error("Exception in createMedication:", error)
      return false
    }
  },

  // Obtener todos los medicamentos del usuario
  async getAllMedications(userId: number): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from("medicamentos")
        .select(`
          *,
          medicamento_detalle (*)
        `)
        .eq("id_usuario", userId)

      if (error) {
        console.error("Error fetching all medications:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Exception in getAllMedications:", error)
      return []
    }
  },

  // Actualizar estado de medicamento
  async updateMedicationStatus(medicationId: number, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("medicamento_detalle")
        .update({ estado: status })
        .eq("id_medicamento", medicationId)

      if (error) {
        console.error("Error updating medication status:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Exception in updateMedicationStatus:", error)
      return false
    }
  },
}
