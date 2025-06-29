import { supabase } from "../lib/supabase"
import type { PerfilUsuario, CondicionMedica, Alergia } from "../types/database"

export const profileService = {
  // Crear perfil de usuario
  async createProfile(profileData: Omit<PerfilUsuario, "id_perfil">): Promise<PerfilUsuario | null> {
    try {
      const { data, error } = await supabase.from("perfil_usuario").insert([profileData]).select().maybeSingle()

      if (error) {
        console.error("Error creating profile:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Exception in createProfile:", error)
      return null
    }
  },

  // Obtener perfil de usuario
  async getProfile(userId: number): Promise<PerfilUsuario | null> {
    try {
      const { data, error } = await supabase.from("perfil_usuario").select("*").eq("id_usuario", userId).maybeSingle()

      if (error) {
        console.error("Error fetching profile:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Exception in getProfile:", error)
      return null
    }
  },

  // Función para obtener perfil del paciente (alias para compatibilidad)
  async getPatientProfile(userId: number): Promise<PerfilUsuario | null> {
    return this.getProfile(userId)
  },

  // Actualizar perfil de usuario
  async updateProfile(
    userId: number,
    updates: Partial<Omit<PerfilUsuario, "id_perfil" | "id_usuario">>,
  ): Promise<boolean> {
    try {
      const { error } = await supabase.from("perfil_usuario").update(updates).eq("id_usuario", userId)

      if (error) {
        console.error("Error updating profile:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Exception in updateProfile:", error)
      return false
    }
  },

  // Función para actualizar perfil del paciente (alias para compatibilidad)
  async updatePatientProfile(
    userId: number,
    updates: Partial<Omit<PerfilUsuario, "id_perfil" | "id_usuario">>,
  ): Promise<boolean> {
    return this.updateProfile(userId, updates)
  },

  // Obtener o crear condición médica
  async getOrCreateCondition(nombre: string): Promise<CondicionMedica | null> {
    try {
      // Primero intentar obtener la condición existente
      let { data: condition, error } = await supabase
        .from("condiciones_medicas")
        .select("*")
        .eq("nombre", nombre)
        .maybeSingle()

      if (error && error.code === "PGRST116") {
        // La condición no existe, crearla
        const { data: newCondition, error: createError } = await supabase
          .from("condiciones_medicas")
          .insert([{ nombre }])
          .select()
          .maybeSingle()

        if (createError) {
          console.error("Error creating condition:", createError)
          return null
        }
        condition = newCondition
      }

      return condition
    } catch (error) {
      console.error("Exception in getOrCreateCondition:", error)
      return null
    }
  },

  // Obtener o crear alergia
  async getOrCreateAllergy(nombre: string): Promise<Alergia | null> {
    try {
      // Primero intentar obtener la alergia existente
      let { data: allergy, error } = await supabase.from("alergias").select("*").eq("nombre", nombre).maybeSingle()

      if (error && error.code === "PGRST116") {
        // La alergia no existe, crearla
        const { data: newAllergy, error: createError } = await supabase
          .from("alergias")
          .insert([{ nombre }])
          .select()
          .maybeSingle()

        if (createError) {
          console.error("Error creating allergy:", createError)
          return null
        }
        allergy = newAllergy
      }

      return allergy
    } catch (error) {
      console.error("Exception in getOrCreateAllergy:", error)
      return null
    }
  },

  // Sincronizar condiciones del usuario
  async syncUserConditions(userId: number, conditionNames: string[]): Promise<boolean> {
    try {
      // Eliminar condiciones existentes
      await supabase.from("usuarios_condiciones").delete().eq("id_usuario", userId)

      // Agregar nuevas condiciones
      for (const conditionName of conditionNames) {
        if (conditionName.trim()) {
          const condition = await this.getOrCreateCondition(conditionName.trim())
          if (condition) {
            await supabase.from("usuarios_condiciones").insert([
              {
                id_usuario: userId,
                id_condicion: condition.id_condicion,
              },
            ])
          }
        }
      }

      return true
    } catch (error) {
      console.error("Error syncing user conditions:", error)
      return false
    }
  },

  // Sincronizar alergias del usuario
  async syncUserAllergies(userId: number, allergyNames: string[]): Promise<boolean> {
    try {
      // Eliminar alergias existentes
      await supabase.from("usuarios_alergias").delete().eq("id_usuario", userId)

      // Agregar nuevas alergias
      for (const allergyName of allergyNames) {
        if (allergyName.trim()) {
          const allergy = await this.getOrCreateAllergy(allergyName.trim())
          if (allergy) {
            await supabase.from("usuarios_alergias").insert([
              {
                id_usuario: userId,
                id_alergia: allergy.id_alergia,
              },
            ])
          }
        }
      }

      return true
    } catch (error) {
      console.error("Error syncing user allergies:", error)
      return false
    }
  },

  // Obtener condiciones del usuario
  async getUserConditions(userId: number): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from("usuarios_condiciones")
        .select(`
          condiciones_medicas (
            nombre
          )
        `)
        .eq("id_usuario", userId)

      if (error) {
        console.error("Error fetching user conditions:", error)
        return []
      }

      return data?.map((item: any) => item.condiciones_medicas?.nombre).filter(Boolean) || []
    } catch (error) {
      console.error("Exception in getUserConditions:", error)
      return []
    }
  },

  // Obtener alergias del usuario
  async getUserAllergies(userId: number): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from("usuarios_alergias")
        .select(`
          alergias (
            nombre
          )
        `)
        .eq("id_usuario", userId)

      if (error) {
        console.error("Error fetching user allergies:", error)
        return []
      }

      return data?.map((item: any) => item.alergias?.nombre).filter(Boolean) || []
    } catch (error) {
      console.error("Exception in getUserAllergies:", error)
      return []
    }
  },

  // Actualizar datos básicos del usuario (nombre, apellidos)
  async updateUserData(
    userId: number,
    userData: { nombre: string; apellido_paterno: string; apellido_materno: string },
  ): Promise<boolean> {
    try {
      const { error } = await supabase.from("usuarios").update(userData).eq("id_usuario", userId)

      if (error) {
        console.error("Error updating user data:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Exception in updateUserData:", error)
      return false
    }
  },

  // Obtener datos completos del usuario con perfil
  async getCompleteUserProfile(userId: number): Promise<any> {
    try {
      // Obtener datos del usuario
      const { data: user, error: userError } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id_usuario", userId)
        .maybeSingle()

      if (userError || !user) {
        console.error("Error fetching user:", userError)
        return null
      }

      // Obtener perfil del usuario
      const { data: profile, error: profileError } = await supabase
        .from("perfil_usuario")
        .select("*")
        .eq("id_usuario", userId)
        .maybeSingle()

      if (profileError) {
        console.error("Error fetching profile:", profileError)
        return null
      }

      // Obtener condiciones médicas
      const conditions = await this.getUserConditions(userId)

      // Obtener alergias
      const allergies = await this.getUserAllergies(userId)

      return {
        user,
        profile,
        conditions,
        allergies,
      }
    } catch (error) {
      console.error("Exception in getCompleteUserProfile:", error)
      return null
    }
  },

  // Actualizar perfil completo del usuario
  async updateCompleteProfile(
    userId: number,
    profileData: {
      // Datos básicos del usuario
      nombre: string
      apellido_paterno: string
      apellido_materno: string
      // Datos del perfil
      edad: number
      peso_kg: number
      talla_cm: number
      tipo_paciente: string
      // Listas
      condiciones: string[]
      alergias: string[]
    },
  ): Promise<boolean> {
    try {
      // 1. Actualizar datos básicos del usuario
      const userUpdateSuccess = await this.updateUserData(userId, {
        nombre: profileData.nombre,
        apellido_paterno: profileData.apellido_paterno,
        apellido_materno: profileData.apellido_materno,
      })

      if (!userUpdateSuccess) {
        return false
      }

      // 2. Actualizar perfil del usuario
      const profileUpdateSuccess = await this.updateProfile(userId, {
        edad: profileData.edad,
        peso_kg: profileData.peso_kg,
        talla_cm: profileData.talla_cm,
        tipo_paciente: profileData.tipo_paciente,
      })

      if (!profileUpdateSuccess) {
        return false
      }

      // 3. Sincronizar condiciones médicas
      const conditionsSuccess = await this.syncUserConditions(userId, profileData.condiciones)
      if (!conditionsSuccess) {
        return false
      }

      // 4. Sincronizar alergias
      const allergiesSuccess = await this.syncUserAllergies(userId, profileData.alergias)
      if (!allergiesSuccess) {
        return false
      }

      return true
    } catch (error) {
      console.error("Exception in updateCompleteProfile:", error)
      return false
    }
  },
}

// Exportar funciones individuales para compatibilidad
export const getPatientProfile = profileService.getPatientProfile.bind(profileService)
export const updatePatientProfile = profileService.updatePatientProfile.bind(profileService)
export const getProfile = profileService.getProfile.bind(profileService)
export const updateProfile = profileService.updateProfile.bind(profileService)
export const createProfile = profileService.createProfile.bind(profileService)
export const getUserConditions = profileService.getUserConditions.bind(profileService)
export const getUserAllergies = profileService.getUserAllergies.bind(profileService)
export const syncUserConditions = profileService.syncUserConditions.bind(profileService)
export const syncUserAllergies = profileService.syncUserAllergies.bind(profileService)
