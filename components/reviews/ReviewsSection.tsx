'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import ReviewForm from './ReviewForm';

interface Resena {
  id: string;
  calificacion: number;
  comentario: string;
  autor: string;
}

interface ResenaDB {
  id: string;
  calificacion: number;
  comentario: string;
  perfiles: {
    nombre_completo: string;
  }[];
}

export default function ReviewsSection({ servicioId }: { servicioId: string }) {
  const supabase = createClient();
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchResenas = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('resenas')
        .select(
          `
        id,
        calificacion,
        comentario,
        perfiles (
          nombre_completo
        )
      `
        )
        .eq('servicio_id', servicioId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped = (data as ResenaDB[]).map((r) => ({
          id: r.id,
          calificacion: r.calificacion,
          comentario: r.comentario,
          autor: r.perfiles.length > 0 ? r.perfiles[0].nombre_completo : '',
        }));

        setResenas(mapped);
      }

      setLoading(false);
    };

    fetchResenas();
  }, [servicioId, supabase, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold">Reseñas</h2>

      <ReviewForm servicioId={servicioId} onSuccess={handleRefresh} />

      {loading && <p>Cargando reseñas...</p>}

      {!loading && resenas.length === 0 && (
        <p className="text-sm text-gray-500">
          Este servicio todavía no tiene reseñas.
        </p>
      )}

      {!loading &&
        resenas.map((resena) => (
          <div
            key={resena.id}
            className="rounded-lg border bg-white p-4 dark:bg-gray-900"
          >
            <div className="mb-1 flex justify-between">
              <span className="font-medium">{resena.autor}</span>
              <span>⭐ {resena.calificacion}</span>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300">
              {resena.comentario}
            </p>
          </div>
        ))}
    </section>
  );
}
