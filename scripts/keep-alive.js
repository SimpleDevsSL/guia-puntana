import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Faltan variables de entorno');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function ping() {
  console.log('📡 Iniciando ping...');
  const { error } = await supabase.from('keepalive').select('id').limit(1); // Quitamos 'data' no usado

  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
  console.log('✅ Ping exitoso.');
}

ping();
