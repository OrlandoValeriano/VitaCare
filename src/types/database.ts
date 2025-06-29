export interface Usuario {
  id_usuario: number
  nombre: string
  apellido_paterno: string
  apellido_materno: string
  username: string
  password: string
  foto_perfil_url?: string
}

export interface PerfilUsuario {
  id_perfil: number
  id_usuario: number
  edad: number
  talla_cm: number
  peso_kg: number
  tipo_paciente: string
}

export interface CondicionMedica {
  id_condicion: number
  nombre: string
}

export interface UsuarioCondicion {
  id_usuario_cond: number
  id_usuario: number
  id_condicion: number
}

export interface Alergia {
  id_alergia: number
  nombre: string
}

export interface UsuarioAlergia {
  id_usuario_alergia: number
  id_usuario: number
  id_alergia: number
}

export interface Cita {
  id_cita: number;
  id_usuario: number;
  fecha: string;
  hora: string;
  especialidad: string;
  motivo: string;
  tipo_atencion: string;
  ubicacion?: string | null; // <--- permite null o undefined
  doctor: string;
  estado: string;
  notas?: string | null;     // <--- permite null o undefined
}


export interface SignoVital {
  id_signo: number
  id_usuario: number
  fecha_hora: string
  presion_arterial?: string
  temperatura?: number
  pasos?: number
  horas_sueno?: number
  calorias_quemadas?: number
}

export interface HistorialMedico {
  id_historial: number
  id_usuario: number
  tipo_historial: string
  descripcion: string
}

export interface Medicamento {
  id_medicamento: number
  id_usuario: number
  nombre: string
  tipo: string
}

export interface MedicamentoDetalle {
  id_detalle: number
  id_medicamento: number
  frecuencia: string
  hora_primera_dosis: string
  duracion_dias: number
  estado: string
  proxima_toma?: string
  dosis_restantes?: number
}
