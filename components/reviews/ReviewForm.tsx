'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Star } from 'lucide-react'; 

interface ReviewFormProps {
  servicioId: string;
  onSuccess: () => void; // Recargar lista de reseñas
}

export default function ReviewForm({ servicioId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0); 
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert('Por favor selecciona una calificación');
    
    setLoading(true);

    // PASO 1: Obtener usuario de Auth
    console.log("--- INICIO DEBUG ---");
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Error Paso 1: No hay usuario de Auth", authError);
      setLoading(false);
      return alert('Debes iniciar sesión');
    }
    console.log("Paso 1 OK. Auth User ID:", user.id);

    // PASO 2: Buscar el Perfil Público
    // Buscamos la fila en 'perfiles' donde usuario_id coincida con el que acabamos de obtener
    const { data: profile, error: profileError } = await supabase
      .from('perfiles')
      .select('id, nombre_completo') // Traemos nombre también para verificar
      .eq('usuario_id', user.id)
      .single();

    if (profileError) {
      console.error("Error Paso 2: Falló la búsqueda del perfil", profileError);
     
    }
    
    console.log("Paso 2 Resultado. Perfil encontrado:", profile);

    if (!profile) {
      setLoading(false);
      console.error("CRITICO: El usuario existe en Auth pero NO se recuperó el perfil.");
      return alert('Error: El sistema no encuentra tu perfil de usuario.');
    }

    // PASO 3: Intentar Guardar
    console.log("Paso 3: Intentando insertar reseña con autor_id:", profile.id);

    const { error } = await supabase.from('resenas').insert({
      servicio_id: servicioId,
      autor_id: profile.id, 
      calificacion: rating,
      comentario: comment,
    });

    setLoading(false);

    if (error) {
      console.error("Error Paso 3 (Final): Supabase rechazó el insert", error);
      alert('Error al guardar: ' + error.message);
    } else {
      console.log("¡ÉXITO! Reseña guardada.");
      setComment('');
      setRating(0);
      onSuccess();
    }
    console.log("--- FIN DEBUG ---");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
      <h3 className="font-bold text-gray-900 dark:text-white mb-2">Deja tu opinión</h3>
      
      {/* Estrellitas */}
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none transition-transform hover:scale-110"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(rating)}
          >
            <Star
              size={24}
              className={`${
                star <= (hover || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Comentario campo */}
      <textarea
        className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none dark:bg-gray-900 dark:border-gray-700 dark:text-white"
        rows={3}
        placeholder="¿Qué te pareció el servicio? (Ej: Muy puntual y amable)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-3 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors disabled:opacity-50 dark:bg-orange-600 dark:hover:bg-orange-700"
      >
        {loading ? 'Publicando...' : 'Publicar Reseña'}
      </button>
    </form>
  );
}