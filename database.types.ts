export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      alumno_familia: {
        Row: {
          alumno_id: string
          perfil_id: string
        }
        Insert: {
          alumno_id: string
          perfil_id: string
        }
        Update: {
          alumno_id?: string
          perfil_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alumno_familia_alumno_id_fkey"
            columns: ["alumno_id"]
            isOneToOne: false
            referencedRelation: "alumnos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alumno_familia_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      alumno_terapeuta: {
        Row: {
          alumno_id: string
          created_at: string
          es_principal: boolean
          terapeuta_id: string
        }
        Insert: {
          alumno_id: string
          created_at?: string
          es_principal?: boolean
          terapeuta_id: string
        }
        Update: {
          alumno_id?: string
          created_at?: string
          es_principal?: boolean
          terapeuta_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alumno_terapeuta_alumno_id_fkey"
            columns: ["alumno_id"]
            isOneToOne: false
            referencedRelation: "alumnos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alumno_terapeuta_terapeuta_id_fkey"
            columns: ["terapeuta_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      alumnos: {
        Row: {
          activo: boolean
          alergias: string | null
          clinica_id: string
          colegio: string | null
          contacto_emergencia: string | null
          created_at: string
          diagnostico: string | null
          fecha_nacimiento: string
          id: string
          nombre_anonimizado: string
          notas_clinicas: string | null
        }
        Insert: {
          activo?: boolean
          alergias?: string | null
          clinica_id: string
          colegio?: string | null
          contacto_emergencia?: string | null
          created_at?: string
          diagnostico?: string | null
          fecha_nacimiento: string
          id?: string
          nombre_anonimizado: string
          notas_clinicas?: string | null
        }
        Update: {
          activo?: boolean
          alergias?: string | null
          clinica_id?: string
          colegio?: string | null
          contacto_emergencia?: string | null
          created_at?: string
          diagnostico?: string | null
          fecha_nacimiento?: string
          id?: string
          nombre_anonimizado?: string
          notas_clinicas?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alumnos_clinica_id_fkey"
            columns: ["clinica_id"]
            isOneToOne: false
            referencedRelation: "clinicas"
            referencedColumns: ["id"]
          },
        ]
      }
      bloques_analisis_tareas: {
        Row: {
          fecha: string
          id: string
          notas: string | null
          programa_alumno_id: string
          terapeuta_id: string
        }
        Insert: {
          fecha?: string
          id?: string
          notas?: string | null
          programa_alumno_id: string
          terapeuta_id: string
        }
        Update: {
          fecha?: string
          id?: string
          notas?: string | null
          programa_alumno_id?: string
          terapeuta_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bloques_analisis_tareas_programa_alumno_id_fkey"
            columns: ["programa_alumno_id"]
            isOneToOne: false
            referencedRelation: "programas_alumno"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bloques_analisis_tareas_terapeuta_id_fkey"
            columns: ["terapeuta_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bloques_duracion: {
        Row: {
          duracion_sesion_segundos: number
          duracion_total_conducta_segundos: number
          fase: string
          fecha: string
          id: string
          notas: string | null
          numero_episodios: number
          porcentaje: number | null
          programa_alumno_id: string
          terapeuta_id: string | null
        }
        Insert: {
          duracion_sesion_segundos: number
          duracion_total_conducta_segundos: number
          fase?: string
          fecha?: string
          id?: string
          notas?: string | null
          numero_episodios?: number
          porcentaje?: number | null
          programa_alumno_id: string
          terapeuta_id?: string | null
        }
        Update: {
          duracion_sesion_segundos?: number
          duracion_total_conducta_segundos?: number
          fase?: string
          fecha?: string
          id?: string
          notas?: string | null
          numero_episodios?: number
          porcentaje?: number | null
          programa_alumno_id?: string
          terapeuta_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bloques_duracion_programa_alumno_id_fkey"
            columns: ["programa_alumno_id"]
            isOneToOne: false
            referencedRelation: "programas_alumno"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bloques_duracion_terapeuta_id_fkey"
            columns: ["terapeuta_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bloques_ensayo: {
        Row: {
          aciertos: number
          conjunto_id: string
          fase: string
          fecha: string
          id: string
          notas: string | null
          porcentaje: number | null
          terapeuta_id: string
          total_ensayos: number
        }
        Insert: {
          aciertos?: number
          conjunto_id: string
          fase?: string
          fecha?: string
          id?: string
          notas?: string | null
          porcentaje?: number | null
          terapeuta_id: string
          total_ensayos?: number
        }
        Update: {
          aciertos?: number
          conjunto_id?: string
          fase?: string
          fecha?: string
          id?: string
          notas?: string | null
          porcentaje?: number | null
          terapeuta_id?: string
          total_ensayos?: number
        }
        Relationships: [
          {
            foreignKeyName: "bloques_ensayo_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos_estimulos_alumno"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bloques_ensayo_terapeuta_id_fkey"
            columns: ["terapeuta_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bloques_ensayo_rft: {
        Row: {
          aciertos: number
          fase: Database["public"]["Enums"]["fase_rft"]
          fecha: string
          grupo: string | null
          id: string
          notas: string | null
          num_comparativos: number
          porcentaje: number | null
          posicion_destino: string | null
          posicion_origen: string | null
          programa_alumno_id: string
          terapeuta_id: string
          total_ensayos: number
        }
        Insert: {
          aciertos?: number
          fase: Database["public"]["Enums"]["fase_rft"]
          fecha?: string
          grupo?: string | null
          id?: string
          notas?: string | null
          num_comparativos?: number
          porcentaje?: number | null
          posicion_destino?: string | null
          posicion_origen?: string | null
          programa_alumno_id: string
          terapeuta_id: string
          total_ensayos?: number
        }
        Update: {
          aciertos?: number
          fase?: Database["public"]["Enums"]["fase_rft"]
          fecha?: string
          grupo?: string | null
          id?: string
          notas?: string | null
          num_comparativos?: number
          porcentaje?: number | null
          posicion_destino?: string | null
          posicion_origen?: string | null
          programa_alumno_id?: string
          terapeuta_id?: string
          total_ensayos?: number
        }
        Relationships: [
          {
            foreignKeyName: "bloques_ensayo_rft_programa_alumno_id_fkey"
            columns: ["programa_alumno_id"]
            isOneToOne: false
            referencedRelation: "programas_alumno"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bloques_ensayo_rft_terapeuta_id_fkey"
            columns: ["terapeuta_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bloques_intervalo: {
        Row: {
          duracion_intervalo_segundos: number
          fase: string
          fecha: string
          id: string
          intervalos_con_conducta: number
          notas: string | null
          porcentaje: number | null
          programa_alumno_id: string
          terapeuta_id: string | null
          tipo_intervalo: string
          total_intervalos: number
        }
        Insert: {
          duracion_intervalo_segundos: number
          fase?: string
          fecha?: string
          id?: string
          intervalos_con_conducta: number
          notas?: string | null
          porcentaje?: number | null
          programa_alumno_id: string
          terapeuta_id?: string | null
          tipo_intervalo?: string
          total_intervalos: number
        }
        Update: {
          duracion_intervalo_segundos?: number
          fase?: string
          fecha?: string
          id?: string
          intervalos_con_conducta?: number
          notas?: string | null
          porcentaje?: number | null
          programa_alumno_id?: string
          terapeuta_id?: string | null
          tipo_intervalo?: string
          total_intervalos?: number
        }
        Relationships: [
          {
            foreignKeyName: "bloques_intervalo_programa_alumno_id_fkey"
            columns: ["programa_alumno_id"]
            isOneToOne: false
            referencedRelation: "programas_alumno"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bloques_intervalo_terapeuta_id_fkey"
            columns: ["terapeuta_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bloques_latencia: {
        Row: {
          fase: string
          fecha: string
          id: string
          latencia_media_segundos: number | null
          latencia_total_segundos: number
          notas: string | null
          numero_ensayos: number
          programa_alumno_id: string
          terapeuta_id: string | null
        }
        Insert: {
          fase?: string
          fecha?: string
          id?: string
          latencia_media_segundos?: number | null
          latencia_total_segundos: number
          notas?: string | null
          numero_ensayos: number
          programa_alumno_id: string
          terapeuta_id?: string | null
        }
        Update: {
          fase?: string
          fecha?: string
          id?: string
          latencia_media_segundos?: number | null
          latencia_total_segundos?: number
          notas?: string | null
          numero_ensayos?: number
          programa_alumno_id?: string
          terapeuta_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bloques_latencia_programa_alumno_id_fkey"
            columns: ["programa_alumno_id"]
            isOneToOne: false
            referencedRelation: "programas_alumno"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bloques_latencia_terapeuta_id_fkey"
            columns: ["terapeuta_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bloques_tasa: {
        Row: {
          duracion_observacion_segundos: number
          fase: string
          fecha: string
          id: string
          notas: string | null
          numero_ocurrencias: number
          programa_alumno_id: string
          tasa_por_minuto: number | null
          terapeuta_id: string | null
        }
        Insert: {
          duracion_observacion_segundos: number
          fase?: string
          fecha?: string
          id?: string
          notas?: string | null
          numero_ocurrencias: number
          programa_alumno_id: string
          tasa_por_minuto?: number | null
          terapeuta_id?: string | null
        }
        Update: {
          duracion_observacion_segundos?: number
          fase?: string
          fecha?: string
          id?: string
          notas?: string | null
          numero_ocurrencias?: number
          programa_alumno_id?: string
          tasa_por_minuto?: number | null
          terapeuta_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bloques_tasa_programa_alumno_id_fkey"
            columns: ["programa_alumno_id"]
            isOneToOne: false
            referencedRelation: "programas_alumno"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bloques_tasa_terapeuta_id_fkey"
            columns: ["terapeuta_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clases_rft: {
        Row: {
          created_at: string
          estado: Database["public"]["Enums"]["estado_programa_alumno"]
          grupo: string
          id: string
          nombre: string
          programa_alumno_id: string
          tipo_relacion: Database["public"]["Enums"]["tipo_relacion_rft"]
        }
        Insert: {
          created_at?: string
          estado?: Database["public"]["Enums"]["estado_programa_alumno"]
          grupo?: string
          id?: string
          nombre: string
          programa_alumno_id: string
          tipo_relacion: Database["public"]["Enums"]["tipo_relacion_rft"]
        }
        Update: {
          created_at?: string
          estado?: Database["public"]["Enums"]["estado_programa_alumno"]
          grupo?: string
          id?: string
          nombre?: string
          programa_alumno_id?: string
          tipo_relacion?: Database["public"]["Enums"]["tipo_relacion_rft"]
        }
        Relationships: [
          {
            foreignKeyName: "clases_rft_programa_alumno_id_fkey"
            columns: ["programa_alumno_id"]
            isOneToOne: false
            referencedRelation: "programas_alumno"
            referencedColumns: ["id"]
          },
        ]
      }
      clases_rft_base: {
        Row: {
          grupo: string
          id: string
          nombre: string
          orden: number | null
          programa_base_id: string
        }
        Insert: {
          grupo?: string
          id?: string
          nombre: string
          orden?: number | null
          programa_base_id: string
        }
        Update: {
          grupo?: string
          id?: string
          nombre?: string
          orden?: number | null
          programa_base_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clases_rft_base_programa_base_id_fkey"
            columns: ["programa_base_id"]
            isOneToOne: false
            referencedRelation: "programas_base"
            referencedColumns: ["id"]
          },
        ]
      }
      clinicas: {
        Row: {
          activa: boolean
          ciudad: string | null
          created_at: string
          estado_suscripcion: string
          id: string
          logo_url: string | null
          nombre: string
          pais: string
          precio_fijo_mensual: number
          precio_por_alumno: number
          sin_facturacion: boolean
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          stripe_subscription_item_alumno_id: string | null
          telefono: string | null
          terminos_aceptados_at: string | null
        }
        Insert: {
          activa?: boolean
          ciudad?: string | null
          created_at?: string
          estado_suscripcion?: string
          id?: string
          logo_url?: string | null
          nombre: string
          pais?: string
          precio_fijo_mensual?: number
          precio_por_alumno?: number
          sin_facturacion?: boolean
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_subscription_item_alumno_id?: string | null
          telefono?: string | null
          terminos_aceptados_at?: string | null
        }
        Update: {
          activa?: boolean
          ciudad?: string | null
          created_at?: string
          estado_suscripcion?: string
          id?: string
          logo_url?: string | null
          nombre?: string
          pais?: string
          precio_fijo_mensual?: number
          precio_por_alumno?: number
          sin_facturacion?: boolean
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_subscription_item_alumno_id?: string | null
          telefono?: string | null
          terminos_aceptados_at?: string | null
        }
        Relationships: []
      }
      conjuntos_estimulos_alumno: {
        Row: {
          conjunto_base_id: string | null
          created_at: string
          estado: Database["public"]["Enums"]["estado_programa_alumno"]
          id: string
          nombre: string
          orden: number
          programa_alumno_id: string
        }
        Insert: {
          conjunto_base_id?: string | null
          created_at?: string
          estado?: Database["public"]["Enums"]["estado_programa_alumno"]
          id?: string
          nombre: string
          orden?: number
          programa_alumno_id: string
        }
        Update: {
          conjunto_base_id?: string | null
          created_at?: string
          estado?: Database["public"]["Enums"]["estado_programa_alumno"]
          id?: string
          nombre?: string
          orden?: number
          programa_alumno_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conjuntos_estimulos_alumno_conjunto_base_id_fkey"
            columns: ["conjunto_base_id"]
            isOneToOne: false
            referencedRelation: "conjuntos_estimulos_base"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conjuntos_estimulos_alumno_programa_alumno_id_fkey"
            columns: ["programa_alumno_id"]
            isOneToOne: false
            referencedRelation: "programas_alumno"
            referencedColumns: ["id"]
          },
        ]
      }
      conjuntos_estimulos_base: {
        Row: {
          created_at: string
          id: string
          nombre: string
          orden: number
          programa_base_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nombre: string
          orden?: number
          programa_base_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nombre?: string
          orden?: number
          programa_base_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conjuntos_estimulos_base_programa_base_id_fkey"
            columns: ["programa_base_id"]
            isOneToOne: false
            referencedRelation: "programas_base"
            referencedColumns: ["id"]
          },
        ]
      }
      datos_facturacion_familia: {
        Row: {
          actualizado_por: string | null
          alumno_id: string
          ciudad: string | null
          codigo_postal: string | null
          direccion: string | null
          id: string
          nif: string | null
          nombre_razon_social: string | null
          pais: string | null
          updated_at: string
        }
        Insert: {
          actualizado_por?: string | null
          alumno_id: string
          ciudad?: string | null
          codigo_postal?: string | null
          direccion?: string | null
          id?: string
          nif?: string | null
          nombre_razon_social?: string | null
          pais?: string | null
          updated_at?: string
        }
        Update: {
          actualizado_por?: string | null
          alumno_id?: string
          ciudad?: string | null
          codigo_postal?: string | null
          direccion?: string | null
          id?: string
          nif?: string | null
          nombre_razon_social?: string | null
          pais?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "datos_facturacion_familia_actualizado_por_fkey"
            columns: ["actualizado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "datos_facturacion_familia_alumno_id_fkey"
            columns: ["alumno_id"]
            isOneToOne: true
            referencedRelation: "alumnos"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos_firmados: {
        Row: {
          alumno_id: string
          contenido_firmado: string
          dni_firmante: string | null
          fecha_firma: string
          firma_imagen_url: string
          firmado_por: string
          id: string
          nombre_firmante: string | null
          pdf_url: string
          tipo_documento_id: string
        }
        Insert: {
          alumno_id: string
          contenido_firmado: string
          dni_firmante?: string | null
          fecha_firma?: string
          firma_imagen_url: string
          firmado_por: string
          id?: string
          nombre_firmante?: string | null
          pdf_url: string
          tipo_documento_id: string
        }
        Update: {
          alumno_id?: string
          contenido_firmado?: string
          dni_firmante?: string | null
          fecha_firma?: string
          firma_imagen_url?: string
          firmado_por?: string
          id?: string
          nombre_firmante?: string | null
          pdf_url?: string
          tipo_documento_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentos_firmados_alumno_id_fkey"
            columns: ["alumno_id"]
            isOneToOne: false
            referencedRelation: "alumnos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_firmados_firmado_por_fkey"
            columns: ["firmado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_firmados_tipo_documento_id_fkey"
            columns: ["tipo_documento_id"]
            isOneToOne: false
            referencedRelation: "tipos_documento_clinica"
            referencedColumns: ["id"]
          },
        ]
      }
      dominio_rft_fases: {
        Row: {
          dominado: boolean
          fase: Database["public"]["Enums"]["fase_rft"]
          grupo: string
          posicion_destino: string
          posicion_origen: string
          programa_alumno_id: string
          updated_at: string
        }
        Insert: {
          dominado?: boolean
          fase: Database["public"]["Enums"]["fase_rft"]
          grupo: string
          posicion_destino: string
          posicion_origen: string
          programa_alumno_id: string
          updated_at?: string
        }
        Update: {
          dominado?: boolean
          fase?: Database["public"]["Enums"]["fase_rft"]
          grupo?: string
          posicion_destino?: string
          posicion_origen?: string
          programa_alumno_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dominio_rft_fases_programa_alumno_id_fkey"
            columns: ["programa_alumno_id"]
            isOneToOne: false
            referencedRelation: "programas_alumno"
            referencedColumns: ["id"]
          },
        ]
      }
      ensayos_aba_detalle: {
        Row: {
          ayuda: Database["public"]["Enums"]["tipo_ayuda"]
          bloque_id: string
          correcto: boolean
          estimulo_id: string
          id: string
          notas: string | null
        }
        Insert: {
          ayuda?: Database["public"]["Enums"]["tipo_ayuda"]
          bloque_id: string
          correcto: boolean
          estimulo_id: string
          id?: string
          notas?: string | null
        }
        Update: {
          ayuda?: Database["public"]["Enums"]["tipo_ayuda"]
          bloque_id?: string
          correcto?: boolean
          estimulo_id?: string
          id?: string
          notas?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ensayos_aba_detalle_bloque_id_fkey"
            columns: ["bloque_id"]
            isOneToOne: false
            referencedRelation: "bloques_ensayo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ensayos_aba_detalle_estimulo_id_fkey"
            columns: ["estimulo_id"]
            isOneToOne: false
            referencedRelation: "estimulos_alumno"
            referencedColumns: ["id"]
          },
        ]
      }
      ensayos_rft_detalle: {
        Row: {
          ayuda: Database["public"]["Enums"]["tipo_ayuda"]
          bloque_id: string
          clase_id: string | null
          correcto: boolean
          estimulo_destino_id: string | null
          estimulo_origen_id: string
          id: string
          notas: string | null
          pregunta: string | null
        }
        Insert: {
          ayuda?: Database["public"]["Enums"]["tipo_ayuda"]
          bloque_id: string
          clase_id?: string | null
          correcto: boolean
          estimulo_destino_id?: string | null
          estimulo_origen_id: string
          id?: string
          notas?: string | null
          pregunta?: string | null
        }
        Update: {
          ayuda?: Database["public"]["Enums"]["tipo_ayuda"]
          bloque_id?: string
          clase_id?: string | null
          correcto?: boolean
          estimulo_destino_id?: string | null
          estimulo_origen_id?: string
          id?: string
          notas?: string | null
          pregunta?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ensayos_rft_detalle_bloque_id_fkey"
            columns: ["bloque_id"]
            isOneToOne: false
            referencedRelation: "bloques_ensayo_rft"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ensayos_rft_detalle_clase_id_fkey"
            columns: ["clase_id"]
            isOneToOne: false
            referencedRelation: "clases_rft"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ensayos_rft_detalle_estimulo_destino_id_fkey"
            columns: ["estimulo_destino_id"]
            isOneToOne: false
            referencedRelation: "estimulos_rft"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ensayos_rft_detalle_estimulo_origen_id_fkey"
            columns: ["estimulo_origen_id"]
            isOneToOne: false
            referencedRelation: "estimulos_rft"
            referencedColumns: ["id"]
          },
        ]
      }
      estimulos_alumno: {
        Row: {
          conjunto_id: string
          descripcion: string | null
          estimulo_base_id: string | null
          id: string
          nombre: string
          orden: number
        }
        Insert: {
          conjunto_id: string
          descripcion?: string | null
          estimulo_base_id?: string | null
          id?: string
          nombre: string
          orden?: number
        }
        Update: {
          conjunto_id?: string
          descripcion?: string | null
          estimulo_base_id?: string | null
          id?: string
          nombre?: string
          orden?: number
        }
        Relationships: [
          {
            foreignKeyName: "estimulos_alumno_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos_estimulos_alumno"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimulos_alumno_estimulo_base_id_fkey"
            columns: ["estimulo_base_id"]
            isOneToOne: false
            referencedRelation: "estimulos_base"
            referencedColumns: ["id"]
          },
        ]
      }
      estimulos_base: {
        Row: {
          conjunto_id: string
          descripcion: string | null
          id: string
          nombre: string
          orden: number
        }
        Insert: {
          conjunto_id: string
          descripcion?: string | null
          id?: string
          nombre: string
          orden?: number
        }
        Update: {
          conjunto_id?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          orden?: number
        }
        Relationships: [
          {
            foreignKeyName: "estimulos_base_conjunto_id_fkey"
            columns: ["conjunto_id"]
            isOneToOne: false
            referencedRelation: "conjuntos_estimulos_base"
            referencedColumns: ["id"]
          },
        ]
      }
      estimulos_rft: {
        Row: {
          clase_id: string
          descripcion: string | null
          etiqueta: string
          id: string
          nombre: string
          orden: number
          posicion: string | null
        }
        Insert: {
          clase_id: string
          descripcion?: string | null
          etiqueta: string
          id?: string
          nombre: string
          orden?: number
          posicion?: string | null
        }
        Update: {
          clase_id?: string
          descripcion?: string | null
          etiqueta?: string
          id?: string
          nombre?: string
          orden?: number
          posicion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estimulos_rft_clase_id_fkey"
            columns: ["clase_id"]
            isOneToOne: false
            referencedRelation: "clases_rft"
            referencedColumns: ["id"]
          },
        ]
      }
      estimulos_rft_base: {
        Row: {
          clase_base_id: string
          etiqueta: string
          id: string
          nombre: string
          orden: number | null
          posicion: string | null
        }
        Insert: {
          clase_base_id: string
          etiqueta: string
          id?: string
          nombre: string
          orden?: number | null
          posicion?: string | null
        }
        Update: {
          clase_base_id?: string
          etiqueta?: string
          id?: string
          nombre?: string
          orden?: number | null
          posicion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estimulos_rft_base_clase_base_id_fkey"
            columns: ["clase_base_id"]
            isOneToOne: false
            referencedRelation: "clases_rft_base"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluaciones_iniciales: {
        Row: {
          alumno_id: string
          created_at: string
          evaluado_por: string | null
          id: string
          notas: string | null
          programa_base_id: string
          updated_at: string
          valoracion: string
        }
        Insert: {
          alumno_id: string
          created_at?: string
          evaluado_por?: string | null
          id?: string
          notas?: string | null
          programa_base_id: string
          updated_at?: string
          valoracion: string
        }
        Update: {
          alumno_id?: string
          created_at?: string
          evaluado_por?: string | null
          id?: string
          notas?: string | null
          programa_base_id?: string
          updated_at?: string
          valoracion?: string
        }
        Relationships: [
          {
            foreignKeyName: "evaluaciones_iniciales_alumno_id_fkey"
            columns: ["alumno_id"]
            isOneToOne: false
            referencedRelation: "alumnos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluaciones_iniciales_evaluado_por_fkey"
            columns: ["evaluado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluaciones_iniciales_programa_base_id_fkey"
            columns: ["programa_base_id"]
            isOneToOne: false
            referencedRelation: "programas_base"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluaciones_preferencia: {
        Row: {
          alumno_id: string
          fecha: string
          id: string
          items: string[]
          notas: string | null
          numero_rondas: number | null
          resultado: Json
          terapeuta_id: string | null
          tipo: string
        }
        Insert: {
          alumno_id: string
          fecha?: string
          id?: string
          items: string[]
          notas?: string | null
          numero_rondas?: number | null
          resultado: Json
          terapeuta_id?: string | null
          tipo: string
        }
        Update: {
          alumno_id?: string
          fecha?: string
          id?: string
          items?: string[]
          notas?: string | null
          numero_rondas?: number | null
          resultado?: Json
          terapeuta_id?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "evaluaciones_preferencia_alumno_id_fkey"
            columns: ["alumno_id"]
            isOneToOne: false
            referencedRelation: "alumnos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluaciones_preferencia_terapeuta_id_fkey"
            columns: ["terapeuta_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      informes: {
        Row: {
          alumno_id: string
          contenido: string
          creado_por: string
          created_at: string
          destinatario: Database["public"]["Enums"]["destinatario_informe"]
          id: string
          periodo_desde: string
          periodo_hasta: string
        }
        Insert: {
          alumno_id: string
          contenido: string
          creado_por: string
          created_at?: string
          destinatario: Database["public"]["Enums"]["destinatario_informe"]
          id?: string
          periodo_desde: string
          periodo_hasta: string
        }
        Update: {
          alumno_id?: string
          contenido?: string
          creado_por?: string
          created_at?: string
          destinatario?: Database["public"]["Enums"]["destinatario_informe"]
          id?: string
          periodo_desde?: string
          periodo_hasta?: string
        }
        Relationships: [
          {
            foreignKeyName: "informes_alumno_id_fkey"
            columns: ["alumno_id"]
            isOneToOne: false
            referencedRelation: "alumnos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "informes_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      observaciones_familia: {
        Row: {
          bloque_id: string | null
          consiguio: boolean | null
          created_at: string
          estado: string
          fecha_evento: string
          id: string
          perfil_id: string
          programa_alumno_id: string
          respuesta_terapeuta: string | null
          revisado_en: string | null
          revisado_por: string | null
          texto: string
        }
        Insert: {
          bloque_id?: string | null
          consiguio?: boolean | null
          created_at?: string
          estado?: string
          fecha_evento?: string
          id?: string
          perfil_id: string
          programa_alumno_id: string
          respuesta_terapeuta?: string | null
          revisado_en?: string | null
          revisado_por?: string | null
          texto: string
        }
        Update: {
          bloque_id?: string | null
          consiguio?: boolean | null
          created_at?: string
          estado?: string
          fecha_evento?: string
          id?: string
          perfil_id?: string
          programa_alumno_id?: string
          respuesta_terapeuta?: string | null
          revisado_en?: string | null
          revisado_por?: string | null
          texto?: string
        }
        Relationships: [
          {
            foreignKeyName: "observaciones_familia_bloque_id_fkey"
            columns: ["bloque_id"]
            isOneToOne: false
            referencedRelation: "bloques_ensayo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observaciones_familia_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observaciones_familia_programa_alumno_id_fkey"
            columns: ["programa_alumno_id"]
            isOneToOne: false
            referencedRelation: "programas_alumno"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observaciones_familia_revisado_por_fkey"
            columns: ["revisado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pasos_tarea_alumno: {
        Row: {
          created_at: string
          descripcion: string | null
          estado: Database["public"]["Enums"]["estado_programa_alumno"]
          id: string
          nombre: string
          orden: number
          paso_base_id: string | null
          programa_alumno_id: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          estado?: Database["public"]["Enums"]["estado_programa_alumno"]
          id?: string
          nombre: string
          orden?: number
          paso_base_id?: string | null
          programa_alumno_id: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          estado?: Database["public"]["Enums"]["estado_programa_alumno"]
          id?: string
          nombre?: string
          orden?: number
          paso_base_id?: string | null
          programa_alumno_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pasos_tarea_alumno_paso_base_id_fkey"
            columns: ["paso_base_id"]
            isOneToOne: false
            referencedRelation: "pasos_tarea_base"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pasos_tarea_alumno_programa_alumno_id_fkey"
            columns: ["programa_alumno_id"]
            isOneToOne: false
            referencedRelation: "programas_alumno"
            referencedColumns: ["id"]
          },
        ]
      }
      pasos_tarea_base: {
        Row: {
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
          orden: number
          programa_base_id: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
          orden?: number
          programa_base_id: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          orden?: number
          programa_base_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pasos_tarea_base_programa_base_id_fkey"
            columns: ["programa_base_id"]
            isOneToOne: false
            referencedRelation: "programas_base"
            referencedColumns: ["id"]
          },
        ]
      }
      perfiles: {
        Row: {
          activo: boolean
          clinica_id: string | null
          created_at: string
          email: string
          id: string
          nombre: string
          rol: Database["public"]["Enums"]["rol_usuario"]
          tambien_terapeuta: boolean
        }
        Insert: {
          activo?: boolean
          clinica_id?: string | null
          created_at?: string
          email: string
          id: string
          nombre: string
          rol: Database["public"]["Enums"]["rol_usuario"]
          tambien_terapeuta?: boolean
        }
        Update: {
          activo?: boolean
          clinica_id?: string | null
          created_at?: string
          email?: string
          id?: string
          nombre?: string
          rol?: Database["public"]["Enums"]["rol_usuario"]
          tambien_terapeuta?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "perfiles_clinica_id_fkey"
            columns: ["clinica_id"]
            isOneToOne: false
            referencedRelation: "clinicas"
            referencedColumns: ["id"]
          },
        ]
      }
      preferencias_alumno: {
        Row: {
          alumno_id: string
          creado_por: string | null
          created_at: string
          fecha: string
          id: string
          nombre: string
          tipo: string
        }
        Insert: {
          alumno_id: string
          creado_por?: string | null
          created_at?: string
          fecha?: string
          id?: string
          nombre: string
          tipo: string
        }
        Update: {
          alumno_id?: string
          creado_por?: string | null
          created_at?: string
          fecha?: string
          id?: string
          nombre?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "preferencias_alumno_alumno_id_fkey"
            columns: ["alumno_id"]
            isOneToOne: false
            referencedRelation: "alumnos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "preferencias_alumno_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      programas_alumno: {
        Row: {
          alumno_id: string
          area: string | null
          ayudas_posibles: string | null
          bloques_para_dominio: number
          created_at: string
          direccion_cadena: string | null
          direccion_objetivo: string | null
          ensayos_por_bloque: number
          estado: Database["public"]["Enums"]["estado_programa_alumno"]
          fecha_dominio: string | null
          fecha_inicio: string
          formato_recogida: string
          id: string
          instrucciones_terapeuta: string | null
          materiales: string | null
          nombre: string
          objetivo: string | null
          orden: number | null
          porcentaje_dominio: number
          programa_base_id: string | null
          terapeuta_id: string
          tipo: Database["public"]["Enums"]["tipo_programa"]
          visible_familia: boolean
        }
        Insert: {
          alumno_id: string
          area?: string | null
          ayudas_posibles?: string | null
          bloques_para_dominio?: number
          created_at?: string
          direccion_cadena?: string | null
          direccion_objetivo?: string | null
          ensayos_por_bloque?: number
          estado?: Database["public"]["Enums"]["estado_programa_alumno"]
          fecha_dominio?: string | null
          fecha_inicio?: string
          formato_recogida?: string
          id?: string
          instrucciones_terapeuta?: string | null
          materiales?: string | null
          nombre: string
          objetivo?: string | null
          orden?: number | null
          porcentaje_dominio?: number
          programa_base_id?: string | null
          terapeuta_id: string
          tipo: Database["public"]["Enums"]["tipo_programa"]
          visible_familia?: boolean
        }
        Update: {
          alumno_id?: string
          area?: string | null
          ayudas_posibles?: string | null
          bloques_para_dominio?: number
          created_at?: string
          direccion_cadena?: string | null
          direccion_objetivo?: string | null
          ensayos_por_bloque?: number
          estado?: Database["public"]["Enums"]["estado_programa_alumno"]
          fecha_dominio?: string | null
          fecha_inicio?: string
          formato_recogida?: string
          id?: string
          instrucciones_terapeuta?: string | null
          materiales?: string | null
          nombre?: string
          objetivo?: string | null
          orden?: number | null
          porcentaje_dominio?: number
          programa_base_id?: string | null
          terapeuta_id?: string
          tipo?: Database["public"]["Enums"]["tipo_programa"]
          visible_familia?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "programas_alumno_alumno_id_fkey"
            columns: ["alumno_id"]
            isOneToOne: false
            referencedRelation: "alumnos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programas_alumno_programa_base_id_fkey"
            columns: ["programa_base_id"]
            isOneToOne: false
            referencedRelation: "programas_base"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programas_alumno_terapeuta_id_fkey"
            columns: ["terapeuta_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      programas_base: {
        Row: {
          activo: boolean
          area: string
          ayudas_posibles: string | null
          bloques_para_dominio: number
          clinica_id: string | null
          creado_por: string
          created_at: string
          criterio_dominio: string | null
          direccion_cadena: string | null
          direccion_objetivo: string | null
          ensayos_por_bloque: number
          formato_recogida: string
          id: string
          instrucciones_terapeuta: string | null
          materiales: string | null
          nombre: string
          objetivo: string | null
          orden: number | null
          porcentaje_dominio: number
          tipo: Database["public"]["Enums"]["tipo_programa"]
          tipo_relacion: Database["public"]["Enums"]["tipo_relacion_rft"] | null
          video_url: string | null
          visibilidad: Database["public"]["Enums"]["visibilidad_programa"]
        }
        Insert: {
          activo?: boolean
          area: string
          ayudas_posibles?: string | null
          bloques_para_dominio?: number
          clinica_id?: string | null
          creado_por: string
          created_at?: string
          criterio_dominio?: string | null
          direccion_cadena?: string | null
          direccion_objetivo?: string | null
          ensayos_por_bloque?: number
          formato_recogida?: string
          id?: string
          instrucciones_terapeuta?: string | null
          materiales?: string | null
          nombre: string
          objetivo?: string | null
          orden?: number | null
          porcentaje_dominio?: number
          tipo: Database["public"]["Enums"]["tipo_programa"]
          tipo_relacion?:
            | Database["public"]["Enums"]["tipo_relacion_rft"]
            | null
          video_url?: string | null
          visibilidad?: Database["public"]["Enums"]["visibilidad_programa"]
        }
        Update: {
          activo?: boolean
          area?: string
          ayudas_posibles?: string | null
          bloques_para_dominio?: number
          clinica_id?: string | null
          creado_por?: string
          created_at?: string
          criterio_dominio?: string | null
          direccion_cadena?: string | null
          direccion_objetivo?: string | null
          ensayos_por_bloque?: number
          formato_recogida?: string
          id?: string
          instrucciones_terapeuta?: string | null
          materiales?: string | null
          nombre?: string
          objetivo?: string | null
          orden?: number | null
          porcentaje_dominio?: number
          tipo?: Database["public"]["Enums"]["tipo_programa"]
          tipo_relacion?:
            | Database["public"]["Enums"]["tipo_relacion_rft"]
            | null
          video_url?: string | null
          visibilidad?: Database["public"]["Enums"]["visibilidad_programa"]
        }
        Relationships: [
          {
            foreignKeyName: "programas_base_clinica_id_fkey"
            columns: ["clinica_id"]
            isOneToOne: false
            referencedRelation: "clinicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programas_base_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      registros_abc: {
        Row: {
          antecedente: string
          conducta: string
          consecuencia: string
          fecha_hora: string
          id: string
          notas: string | null
          programa_alumno_id: string
          terapeuta_id: string | null
        }
        Insert: {
          antecedente: string
          conducta: string
          consecuencia: string
          fecha_hora?: string
          id?: string
          notas?: string | null
          programa_alumno_id: string
          terapeuta_id?: string | null
        }
        Update: {
          antecedente?: string
          conducta?: string
          consecuencia?: string
          fecha_hora?: string
          id?: string
          notas?: string | null
          programa_alumno_id?: string
          terapeuta_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registros_abc_programa_alumno_id_fkey"
            columns: ["programa_alumno_id"]
            isOneToOne: false
            referencedRelation: "programas_alumno"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registros_abc_terapeuta_id_fkey"
            columns: ["terapeuta_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      relaciones_entrenadas_rft: {
        Row: {
          clase_id: string
          created_at: string
          estimulo_destino_id: string
          estimulo_origen_id: string
          id: string
        }
        Insert: {
          clase_id: string
          created_at?: string
          estimulo_destino_id: string
          estimulo_origen_id: string
          id?: string
        }
        Update: {
          clase_id?: string
          created_at?: string
          estimulo_destino_id?: string
          estimulo_origen_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "relaciones_entrenadas_rft_clase_id_fkey"
            columns: ["clase_id"]
            isOneToOne: false
            referencedRelation: "clases_rft"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relaciones_entrenadas_rft_estimulo_destino_id_fkey"
            columns: ["estimulo_destino_id"]
            isOneToOne: false
            referencedRelation: "estimulos_rft"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relaciones_entrenadas_rft_estimulo_origen_id_fkey"
            columns: ["estimulo_origen_id"]
            isOneToOne: false
            referencedRelation: "estimulos_rft"
            referencedColumns: ["id"]
          },
        ]
      }
      resultados_paso_bloque: {
        Row: {
          bloque_id: string
          id: string
          independiente: boolean
          paso_id: string
        }
        Insert: {
          bloque_id: string
          id?: string
          independiente: boolean
          paso_id: string
        }
        Update: {
          bloque_id?: string
          id?: string
          independiente?: boolean
          paso_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resultados_paso_bloque_bloque_id_fkey"
            columns: ["bloque_id"]
            isOneToOne: false
            referencedRelation: "bloques_analisis_tareas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resultados_paso_bloque_paso_id_fkey"
            columns: ["paso_id"]
            isOneToOne: false
            referencedRelation: "pasos_tarea_alumno"
            referencedColumns: ["id"]
          },
        ]
      }
      sesiones_programadas: {
        Row: {
          alumno_id: string
          cancelado_por: string | null
          confirmada_familia: boolean
          creado_por: string | null
          created_at: string
          duracion_minutos: number
          estado: Database["public"]["Enums"]["estado_sesion"]
          fecha_hora: string
          id: string
          notas: string | null
          serie_id: string | null
          terapeuta_id: string
          updated_at: string
        }
        Insert: {
          alumno_id: string
          cancelado_por?: string | null
          confirmada_familia?: boolean
          creado_por?: string | null
          created_at?: string
          duracion_minutos?: number
          estado?: Database["public"]["Enums"]["estado_sesion"]
          fecha_hora: string
          id?: string
          notas?: string | null
          serie_id?: string | null
          terapeuta_id: string
          updated_at?: string
        }
        Update: {
          alumno_id?: string
          cancelado_por?: string | null
          confirmada_familia?: boolean
          creado_por?: string | null
          created_at?: string
          duracion_minutos?: number
          estado?: Database["public"]["Enums"]["estado_sesion"]
          fecha_hora?: string
          id?: string
          notas?: string | null
          serie_id?: string | null
          terapeuta_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sesiones_programadas_alumno_id_fkey"
            columns: ["alumno_id"]
            isOneToOne: false
            referencedRelation: "alumnos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sesiones_programadas_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sesiones_programadas_terapeuta_id_fkey"
            columns: ["terapeuta_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_eventos: {
        Row: {
          clinica_id: string | null
          created_at: string
          id: string
          payload: Json
          procesado: boolean
          stripe_event_id: string
          tipo: string
        }
        Insert: {
          clinica_id?: string | null
          created_at?: string
          id?: string
          payload: Json
          procesado?: boolean
          stripe_event_id: string
          tipo: string
        }
        Update: {
          clinica_id?: string | null
          created_at?: string
          id?: string
          payload?: Json
          procesado?: boolean
          stripe_event_id?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "stripe_eventos_clinica_id_fkey"
            columns: ["clinica_id"]
            isOneToOne: false
            referencedRelation: "clinicas"
            referencedColumns: ["id"]
          },
        ]
      }
      tipos_documento_clinica: {
        Row: {
          activo: boolean
          clinica_id: string
          contenido: string
          creado_por: string | null
          created_at: string
          id: string
          titulo: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          clinica_id: string
          contenido: string
          creado_por?: string | null
          created_at?: string
          id?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          clinica_id?: string
          contenido?: string
          creado_por?: string | null
          created_at?: string
          id?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tipos_documento_clinica_clinica_id_fkey"
            columns: ["clinica_id"]
            isOneToOne: false
            referencedRelation: "clinicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tipos_documento_clinica_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      actualizar_dominio_clase_rft:
        | {
            Args: {
              p_clase_id: string
              p_fase: Database["public"]["Enums"]["fase_rft"]
            }
            Returns: undefined
          }
        | {
            Args: {
              p_clase_id: string
              p_fase: Database["public"]["Enums"]["fase_rft"]
              p_posicion_destino: string
              p_posicion_origen: string
            }
            Returns: undefined
          }
      actualizar_dominio_grupo_rft: {
        Args: {
          p_fase: Database["public"]["Enums"]["fase_rft"]
          p_grupo: string
          p_posicion_destino: string
          p_posicion_origen: string
          p_programa_alumno_id: string
        }
        Returns: undefined
      }
      alumno_es_de_mi_clinica: {
        Args: { p_alumno_id: string }
        Returns: boolean
      }
      asignar_orden_curriculo: {
        Args: { p_id: string; p_nuevo_orden: number; p_orden_anterior: number }
        Returns: undefined
      }
      auth_clinica_id: { Args: never; Returns: string }
      auth_rol: {
        Args: never
        Returns: Database["public"]["Enums"]["rol_usuario"]
      }
    }
    Enums: {
      destinatario_informe: "familia" | "formal"
      estado_programa_alumno:
        | "adquisicion"
        | "mantenimiento"
        | "dominado"
        | "pausado"
        | "linea_base"
      estado_sesion: "programada" | "asistio" | "cancelada" | "no_asistio"
      estado_suscripcion: "activa" | "impagada" | "cancelada" | "prueba"
      fase_rft:
        | "directo"
        | "entrenamiento"
        | "test_mutuo"
        | "test_combinatorio"
        | "transformacion_funciones"
        | "generalizacion"
        | "mantenimiento"
      naturaleza_relacion:
        | "entrenada"
        | "derivada_mutua"
        | "derivada_combinatoria"
      rol_usuario: "superadmin" | "clinica_admin" | "terapeuta" | "familia"
      tipo_ayuda:
        | "independiente"
        | "verbal"
        | "gestual"
        | "modelado"
        | "fisica_parcial"
        | "fisica_total"
        | "textual"
        | "verbal_parcial"
        | "visual"
      tipo_programa: "aba_clasico" | "rft" | "conducta"
      tipo_relacion_rft:
        | "coordinacion"
        | "distincion"
        | "oposicion"
        | "comparacion"
        | "jerarquia"
        | "temporal"
        | "causal"
        | "deictica"
      visibilidad_programa: "privado" | "clinica"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      destinatario_informe: ["familia", "formal"],
      estado_programa_alumno: [
        "adquisicion",
        "mantenimiento",
        "dominado",
        "pausado",
        "linea_base",
      ],
      estado_sesion: ["programada", "asistio", "cancelada", "no_asistio"],
      estado_suscripcion: ["activa", "impagada", "cancelada", "prueba"],
      fase_rft: [
        "directo",
        "entrenamiento",
        "test_mutuo",
        "test_combinatorio",
        "transformacion_funciones",
        "generalizacion",
        "mantenimiento",
      ],
      naturaleza_relacion: [
        "entrenada",
        "derivada_mutua",
        "derivada_combinatoria",
      ],
      rol_usuario: ["superadmin", "clinica_admin", "terapeuta", "familia"],
      tipo_ayuda: [
        "independiente",
        "verbal",
        "gestual",
        "modelado",
        "fisica_parcial",
        "fisica_total",
        "textual",
        "verbal_parcial",
        "visual",
      ],
      tipo_programa: ["aba_clasico", "rft", "conducta"],
      tipo_relacion_rft: [
        "coordinacion",
        "distincion",
        "oposicion",
        "comparacion",
        "jerarquia",
        "temporal",
        "causal",
        "deictica",
      ],
      visibilidad_programa: ["privado", "clinica"],
    },
  },
} as const
