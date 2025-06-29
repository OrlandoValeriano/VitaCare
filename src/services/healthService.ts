import { supabase } from "../lib/supabase"

export const healthService = {
  // Obtener alergias del usuario (tabla correcta: alergias)
  async getAllergies(userId: number): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from("usuarios_alergias")
        .select(`
          alergias (
            nombre
          )
        `)
        .eq("id_usuario", userId)
        .order("alergias(nombre)", { ascending: true })

      if (error) {
        console.error("Error fetching allergies:", error)
        return []
      }

      return data?.map((item: any) => item.alergias?.nombre).filter(Boolean) || []
    } catch (error) {
      console.error("Exception in getAllergies:", error)
      return []
    }
  },

  // Obtener condiciones médicas del usuario (tabla correcta: condiciones_medicas)
  async getChronicDiseases(userId: number): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from("usuarios_condiciones")
        .select(`
          condiciones_medicas (
            nombre
          )
        `)
        .eq("id_usuario", userId)
        .order("condiciones_medicas(nombre)", { ascending: true })

      if (error) {
        console.error("Error fetching chronic diseases:", error)
        return []
      }

      return data?.map((item: any) => item.condiciones_medicas?.nombre).filter(Boolean) || []
    } catch (error) {
      console.error("Exception in getChronicDiseases:", error)
      return []
    }
  },

  // Crear nueva alergia
  async createAllergy(userId: number, allergyName: string): Promise<boolean> {
    try {
      // Primero crear o obtener la alergia
      let { data: allergy} = await supabase.from("alergias").select("*").eq("nombre", allergyName).maybeSingle()

      if (!allergy) {
        const { data: newAllergy, error: createError } = await supabase
          .from("alergias")
          .insert([{ nombre: allergyName }])
          .select()
          .maybeSingle()

        if (createError) {
          console.error("Error creating allergy:", createError)
          return false
        }
        allergy = newAllergy
      }

      if (!allergy) return false

      // Luego asociar con el usuario
      const { error: linkError } = await supabase.from("usuarios_alergias").insert([
        {
          id_usuario: userId,
          id_alergia: allergy.id_alergia,
        },
      ])

      if (linkError) {
        console.error("Error linking allergy to user:", linkError)
        return false
      }

      return true
    } catch (error) {
      console.error("Exception in createAllergy:", error)
      return false
    }
  },

  // Crear nueva condición médica
  async createCondition(userId: number, conditionName: string): Promise<boolean> {
    try {
      // Primero crear o obtener la condición
      let { data: condition} = await supabase
        .from("condiciones_medicas")
        .select("*")
        .eq("nombre", conditionName)
        .maybeSingle()

      if (!condition) {
        const { data: newCondition, error: createError } = await supabase
          .from("condiciones_medicas")
          .insert([{ nombre: conditionName }])
          .select()
          .maybeSingle()

        if (createError) {
          console.error("Error creating condition:", createError)
          return false
        }
        condition = newCondition
      }

      if (!condition) return false

      // Luego asociar con el usuario
      const { error: linkError } = await supabase.from("usuarios_condiciones").insert([
        {
          id_usuario: userId,
          id_condicion: condition.id_condicion,
        },
      ])

      if (linkError) {
        console.error("Error linking condition to user:", linkError)
        return false
      }

      return true
    } catch (error) {
      console.error("Exception in createCondition:", error)
      return false
    }
  },
}
