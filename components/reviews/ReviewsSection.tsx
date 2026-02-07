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

// CORRECCIÓN 1: 'perfiles' no es un array [], es un objeto único o null
interface ResenaDB {
  id: string;
  calificacion: number;
  comentario: string;
  perfiles: {
    nombre_completo: string;
  } | null;
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
        // CORRECCIÓN 2: Se accede directo al objeto, sin usar [0]
        const typedData = data as unknown as ResenaDB[];

        const mapped = typedData.map((r) => ({
          id: r.id,
          calificacion: r.calificacion,
          comentario: r.comentario,
          // Si existe el perfil, tomamos el nombre. Si no, ponemos "Anónimo"
          autor: r.perfiles?.nombre_completo || 'Usuario Anónimo',
        }));

        setResenas(mapped);
      } else if (error) {
        console.error('Error cargando reseñas:', error);
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

      {loading && <p className="text-sm text-gray-500">Cargando reseñas...</p>}

      {!loading && resenas.length === 0 && (
        <p className="text-sm text-gray-500">
          Este servicio todavía no tiene reseñas.
        </p>
      )}

      {!loading &&
        resenas.map((resena) => (
          <div
            key={resena.id}
            className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-bold text-gray-900 dark:text-gray-100">
                {resena.autor}
              </span>
              <div className="flex text-yellow-400">
                {/* Truco simple para repetir estrellas visualmente */}
                {'★'.repeat(resena.calificacion)}
                <span className="text-gray-300">
                  {'★'.repeat(5 - resena.calificacion)}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300">
              {resena.comentario}
            </p>
          </div>
        ))}
    </section>
  );
}
