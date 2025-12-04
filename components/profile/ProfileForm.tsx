'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { z } from 'zod'

// --- 1. Definición del Esquema de Validación (Zod) ---
/**
 * Esquema para validar los datos del perfil inicial.
 * * @property {string} nombre_completo - Mínimo 2 caracteres.
 * @property {string} rol - Debe ser 'user' o 'proveedor'.
 */
const profileSchema = z.object({
  nombre_completo: z.string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .max(50, { message: "El nombre es demasiado largo." }),
  rol: z.enum(['user', 'proveedor'], {
    errorMap: () => ({ message: "Por favor selecciona un rol válido." })
  })
})

// Tipo inferido para TypeScript
type ProfileFormData = z.infer<typeof profileSchema>

/**
 * Componente ProfileForm
 * * Formulario para completar el perfil del usuario por primera vez (Onboarding).
 * Inserta un registro en la tabla public.perfiles vinculado al usuario actual.
 */
export default function ProfileForm() {
  const supabase = createClient()
  const router = useRouter()

  // --- Estados ---
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  
  // Estado del formulario con valores por defecto
  const [formData, setFormData] = useState<ProfileFormData>({
    nombre_completo: '',
    rol: 'user' // Valor por defecto seguro
  })

  // Manejo de errores de validación y backend
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)

  // --- Efecto: Obtener Usuario ---
  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        setGeneralError("No se pudo identificar al usuario. Por favor inicia sesión nuevamente.")
        // Opcional: router.push('/acceder')
      } else {
        setUserId(user.id)
      }
    }
    getUser()
  }, [supabase, router])

  // --- Manejadores ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Limpiar error específico al editar
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setGeneralError(null)
    setValidationErrors({})

    if (!userId) {
      setGeneralError("Sesión no válida. Recarga la página.")
      setLoading(false)
      return
    }

    // 1. Validación Zod
    const validationResult = profileSchema.safeParse(formData)

    if (!validationResult.success) {
      const errors: Record<string, string> = {}
      validationResult.error.issues.forEach(issue => {
        if (issue.path[0]) {
          errors[issue.path[0].toString()] = issue.message
        }
      })
      setValidationErrors(errors)
      setLoading(false)
      return
    }

    // 2. Insertar en Supabase
    try {
      const { error } = await supabase
        .from('perfiles')
        .insert({
          usuario_id: userId,
          nombre_completo: formData.nombre_completo,
          rol: formData.rol,
          es_activo: true, // Default true según requerimiento
          // created_by y updated_by pueden manejarse con triggers o RLS, 
          // pero aquí lo enviamos explícitamente si la política lo requiere.
          created_by: userId, 
          updated_by: userId
        })

      if (error) throw error

      // Éxito: Redirigir al Home o Dashboard
      router.push('/') 
      router.refresh()

    } catch (err: any) {
      console.error('Error creando perfil:', err)
      setGeneralError(err.message || "Error al guardar el perfil. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header Decorativo */}
      <div className="bg-indigo-600 p-6 text-center">
        <h2 className="text-2xl font-bold text-white">¡Te damos la bienvenida!</h2>
        <p className="text-indigo-100 mt-2 text-sm">
          Completa tu perfil para comenzar a usar Guía Puntana
        </p>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Campo: Nombre Completo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="nombre_completo">
              Nombre Completo
            </label>
            <input
              id="nombre_completo"
              name="nombre_completo"
              type="text"
              value={formData.nombre_completo}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-3 bg-gray-50 focus:bg-white transition-colors focus:outline-none focus:ring-2 ${
                validationErrors.nombre_completo 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
              placeholder="Ej. Juan Pérez"
            />
            {validationErrors.nombre_completo && (
              <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                <span>⚠</span> {validationErrors.nombre_completo}
              </p>
            )}
          </div>

          {/* Campo: Rol (Select) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="rol">
              ¿Cómo quieres usar la plataforma?
            </label>
            <div className="relative">
              <select
                id="rol"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 pr-8 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors cursor-pointer"
              >
                <option value="user">Usuario normal (Busco servicios)</option>
                <option value="proveedor">Proveedor (Ofrezco servicios)</option>
              </select>
              
              {/* Icono de flecha personalizado para el select */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Selecciona "Proveedor" si deseas publicar tus servicios profesionales.
            </p>
          </div>

          {/* Errores Generales */}
          {generalError && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-md">
              <p className="font-bold">Error</p>
              <p>{generalError}</p>
            </div>
          )}

          {/* Botón de Guardar */}
          <button
            type="submit"
            disabled={loading || !userId}
            className={`w-full py-3.5 px-4 rounded-lg font-semibold shadow-sm text-white transition-all transform hover:-translate-y-0.5 ${
              loading 
                ? 'bg-indigo-300 cursor-wait' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
            }`}
          >
            {loading ? 'Guardando perfil...' : 'Confirmar y Continuar'}
          </button>
        </form>
      </div>
    </div>
  )
}