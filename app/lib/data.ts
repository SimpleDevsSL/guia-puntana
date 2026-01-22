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

// Nueva función para obtener IDs de proveedores para el Sitemap
export const getAllProvidersForSitemap = unstable_cache(
  async () => {
    // ⚠️ Asegúrate de usar el nombre correcto de tu tabla de perfiles/proveedores
    // Asumo que es 'perfiles' y que tienen un campo 'id'.
    // Si solo quieres mostrar los que ofrecen servicios, quizás debas filtrar.
    const { data } = await supabase
      .from('perfiles')
      .select('id, updated_at') // Traemos updated_at para decirle a Google cuán fresco es
      .eq('es_activo', true) // Solo activos
      .eq('rol', 'proveedor') // Solo proveedores
      .throwOnError();

    return data || [];
  },
  ['providers-sitemap-list'],
  {
    revalidate: 3600 * 24, // Cache de 24 horas (no cambian tan seguido)
    tags: ['providers-sitemap'],
  }
);
