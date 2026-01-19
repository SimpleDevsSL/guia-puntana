import { createClient } from '@/utils/supabase/server';

export default async function sitemap() {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from('perfiles')
    .select('id, updated_at');

  const providerUrls = (profiles || []).map((p) => ({
    url: `https://guiapuntana.com/proveedor/${p.id}`,
    lastModified: new Date(p.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: 'https://guiapuntana.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://guiapuntana.com/feed',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...providerUrls,
  ];
}
