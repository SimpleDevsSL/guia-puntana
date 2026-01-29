'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Upload, Loader2, CheckCircle2, Clock, ShieldCheck, AlertCircle } from 'lucide-react'

export default function VerificationUpload({ 
  userId, 
  insignias = [] 
}: { 
  userId: string, 
  insignias?: string[] 
}) {
  const [uploading, setUploading] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'pending' | 'approved' | 'rejected'>('idle')
  const [checking, setChecking] = useState(true)
  const supabase = createClient()

  // 1. Verificar estado actual al montar el componente
  useEffect(() => {
    const checkStatus = async () => {
      // A. Si ya tiene la insignia en su perfil, está aprobado
      if (insignias.includes('identidad_dni')) {
        setVerificationStatus('approved')
        setChecking(false)
        return
      }

      // B. Si no tiene insignia, buscar si hay una solicitud pendiente
      const { data, error } = await supabase
        .from('solicitudes_verificacion')
        .select('estado')
        .eq('usuario_id', userId)
        .eq('tipo', 'dni')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (data && data.estado === 'pendiente') {
        setVerificationStatus('pending')
      } else if (data && data.estado === 'rechazado') {
        setVerificationStatus('rejected')
      } else {
        setVerificationStatus('idle')
      }
      setChecking(false)
    }

    checkStatus()
  }, [userId, insignias, supabase])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      
      if (!e.target.files || e.target.files.length === 0) return

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/dni_${Date.now()}.${fileExt}`
      
      // Subir al bucket privado
      const { error: uploadError } = await supabase.storage
        .from('documentos_privados')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Crear solicitud
      const { error: dbError } = await supabase
        .from('solicitudes_verificacion')
        .insert({
          usuario_id: userId,
          tipo: 'dni',
          fotos_urls: [fileName],
          estado: 'pendiente'
        })

      if (dbError) throw dbError

      setVerificationStatus('pending')
    } catch (error) {
      console.error('Error:', error)
      alert('Hubo un error al subir el documento. Intenta nuevamente.')
    } finally {
      setUploading(false)
    }
  }

  if (checking) return null // O un skeleton pequeño si prefieres

  // ESTADO: APROBADO (Ya verificado)
  if (verificationStatus === 'approved') {
    return (
      <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-900/30 dark:bg-green-900/10">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
            <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-bold text-green-800 dark:text-green-300">Identidad Verificada</h3>
            <p className="text-sm text-green-700/80 dark:text-green-400/70">
              ¡Genial! Tu perfil cuenta con la insignia de confianza.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ESTADO: PENDIENTE (Esperando revisión)
  if (verificationStatus === 'pending') {
    return (
      <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/30 dark:bg-blue-900/10">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
            <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-blue-800 dark:text-blue-300">Verificación en Revisión</h3>
            <p className="text-sm text-blue-700/80 dark:text-blue-400/70">
              Hemos recibido tus documentos. Te notificaremos cuando se apruebe.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ESTADO: IDLE o RECHAZADO (Mostrar formulario)
  return (
    <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="text-orange-600" size={24} />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Verificar Identidad</h3>
          </div>
          
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed">
            Sube una foto de tu DNI para obtener la insignia de <span className="font-bold text-gray-900 dark:text-white">Usuario Verificado</span>. 
            Esto aumenta drásticamente la confianza de tus clientes potenciales.
          </p>

          {verificationStatus === 'rejected' && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-300">
              <AlertCircle size={16} />
              Tu solicitud anterior fue rechazada. Por favor sube una foto más clara.
            </div>
          )}
        </div>

        <label className={`
          group relative flex cursor-pointer flex-col items-center justify-center gap-2 
          rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 
          px-8 py-6 transition-all hover:border-orange-400 hover:bg-orange-50 
          dark:border-gray-700 dark:bg-gray-800 dark:hover:border-orange-500/50 dark:hover:bg-orange-900/10
          ${uploading ? 'opacity-70 pointer-events-none' : ''}
        `}>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleUpload} 
            disabled={uploading}
            className="hidden" 
          />
          
          {uploading ? (
            <Loader2 className="animate-spin text-orange-600" size={28} />
          ) : (
            <Upload className="text-gray-400 group-hover:text-orange-600 transition-colors" size={28} />
          )}
          
          <span className="font-bold text-sm text-gray-600 group-hover:text-orange-700 dark:text-gray-300 dark:group-hover:text-orange-400">
            {uploading ? 'Subiendo...' : 'Subir Foto DNI'}
          </span>
        </label>
      </div>
    </div>
  )
}