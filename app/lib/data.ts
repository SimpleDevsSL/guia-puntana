import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import { Category } from './definitions';

// Cliente simple para lecturas públicas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getCachedCategories = unstable_cache(
  async () => {
    const { data } = await supabase
      .from('categorias')
      .select('id, nombre, slug') // <--- 1. AGREGAMOS EL SLUG AQUÍ
      .eq('es_activa', true)
      .throwOnError();

    return (data as Category[]) || [];
  },
  ['categories-list-v3'], // <--- 2. CAMBIAMOS LA KEY (Truco para forzar actualización inmediata)
  {
    revalidate: 3600 * 4, // 4 horas
    tags: ['categories'],
  }
);