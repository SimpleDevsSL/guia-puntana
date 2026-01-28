'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Upload, Loader2, CheckCircle, XCircle } from 'lucide-react'

export default function VerificationUpload({ userId }: { userId: string }) {
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const supabase = createClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      setStatus('idle')
      
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('Debes seleccionar una imagen.')
      }

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      // 1. Subir imagen al bucket privado
      const { error: uploadError } = await supabase.storage
        .from('documentos_privados')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 2. Crear el registro en la base de datos
      const { error: dbError } = await supabase
        .from('solicitudes_verificacion')
        .insert({
          usuario_id: userId,
          tipo: 'dni', // O 'matricula' según el caso
          fotos_urls: [filePath],
          estado: 'pendiente'
        })

      if (dbError) throw dbError

      setStatus('success')
    } catch (error) {
      console.error('Error subiendo:', error)
      setStatus('error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm mt-6">
      <h3 className="text-lg font-semibold mb-2">Verificar Identidad (Gratis)</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Sube una foto de tu DNI para obtener la insignia de <span className="font-bold text-blue-500">Usuario Verificado</span>. Esto aumenta la confianza de los clientes.
      </p>

      {status === 'success' ? (
        <div className="flex items-center text-green-600 gap-2 bg-green-50 p-3 rounded">
          <CheckCircle size={20} />
          <span className="text-sm font-medium">¡Solicitud enviada! La revisaremos pronto.</span>
        </div>
      ) : (
        <div className="flex items-center gap-4">
           <label className="cursor-pointer inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors">
            {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
            <span>{uploading ? 'Subiendo...' : 'Subir Foto DNI'}</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleUpload} 
              disabled={uploading}
              className="hidden" 
            />
          </label>
          {status === 'error' && (
            <span className="text-red-500 text-sm flex items-center gap-1">
              <XCircle size={14} /> Error al subir. Intenta de nuevo.
            </span>
          )}
        </div>
      )}
    </div>
  )
}