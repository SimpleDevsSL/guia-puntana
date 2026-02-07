'use client';

import { useState, useEffect } from 'react'; // Borramos useCallback
import { createClient } from '@/utils/supabase/client';
import { Star, AlertCircle } from 'lucide-react';

interface ReviewFormProps {
  servicioId: string;
  onSuccess: () => void;
}

export default function ReviewForm({ servicioId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [hasReviewed, setHasReviewed] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const checkExistingReview = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // 1. Buscamos el perfil
        const { data: profile } = await supabase
          .from('perfiles')
          .select('id')
          .eq('usuario_id', user.id)
          .single();

        if (profile) {
          // 2. Buscamos si ya hay reseña
          const { data } = await supabase
            .from('resenas')
            .select('id')
            .eq('servicio_id', servicioId)
            .eq('autor_id', profile.id)
            .maybeSingle();

          if (data) {
            setHasReviewed(true);
          }
        }
      }

      // Finalizamos la carga
      setChecking(false);
    };

    checkExistingReview();
  }, [servicioId, supabase]); // Dependencias limpias

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert('Por favor selecciona una calificación');
    if (hasReviewed)
      return alert('Ya has publicado una reseña para este servicio.');

    setLoading(true);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setLoading(false);
      return alert('Debes iniciar sesión');
    }

    const { data: profile, error: profileError } = await supabase
      .from('perfiles')
      .select('id')
      .eq('usuario_id', user.id)
      .single();

    if (profileError || !profile) {
      setLoading(false);
      return alert('Error: El sistema no encuentra tu perfil de usuario.');
    }

    const { error } = await supabase.from('resenas').insert({
      servicio_id: servicioId,
      autor_id: profile.id,
      calificacion: rating,
      comentario: comment,
    });

    setLoading(false);

    if (error) {
      alert('Error al guardar: ' + error.message);
    } else {
      setHasReviewed(true);
      setComment('');
      setRating(0);
      onSuccess();
    }
  };

  if (checking) {
    return (
      <div className="animate-pulse p-4 text-center text-sm text-gray-500">
        Verificando disponibilidad...
      </div>
    );
  }

  if (hasReviewed) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-900/10">
        <AlertCircle className="text-amber-600 dark:text-amber-500" size={20} />
        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
          Ya calificaste este servicio. Solo se permite una reseña por usuario.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
    >
      <h3 className="mb-2 font-bold text-gray-900 dark:text-white">
        Deja tu opinión
      </h3>

      <div className="mb-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="transition-transform hover:scale-110 focus:outline-none"
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

      <textarea
        className="w-full rounded-lg border border-gray-200 p-3 outline-none focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        rows={3}
        placeholder="¿Qué te pareció el servicio?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:opacity-50 dark:bg-orange-600 dark:hover:bg-orange-700"
      >
        {loading ? 'Publicando...' : 'Publicar Reseña'}
      </button>
    </form>
  );
}
