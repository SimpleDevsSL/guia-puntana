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

    //  Obtener usuario actual
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return alert('Tenes que iniciar sesión para dejar una reseña');
    }

    // Buscar id perfilk
    const { data: profile } = await supabase
      .from('perfiles')
      .select('id')
      .eq('usuario_id', user.id)
      .single();

    if (!profile) {
      setLoading(false);
      return alert('Error: No tenes un perfil creado');
    }

    //  Guardar reseña
    const { error } = await supabase.from('resenas').insert({
      servicio_id: servicioId,
      autor_id: profile.id,
      calificacion: rating,
      comentario: comment,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert('Error al guardar la reseña');
    } else {
      setComment('');
      setRating(0);
      onSuccess(); // Avisamos al padre que actualice la lista
    }
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