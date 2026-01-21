import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import { Category } from './definitions';

// Creamos un cliente "simple" solo para lecturas públicas estáticas.
// Esto evita el error de "Dynamic server usage" al no depender de cookies.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getCachedCategories = unstable_cache(
  async () => {
    const { data } = await supabase
      .from('categorias')
      .select('id, nombre')
      .eq('es_activa', true)
      .throwOnError();

    return (data as Category[]) || [];
  },
  ['categories-list'], // Key única para identificar este cache
  {
    revalidate: 3600 * 4,
    tags: ['categories'],
  }
);