// scripts/keep-alive.js
const { createClient } = require('@supabase/supabase-js');

// Usamos las variables de entorno que inyectará GitHub Actions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Error: Faltan las variables de entorno SUPABASE_URL o SUPABASE_KEY'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function ping() {
  console.log('📡 Iniciando ping a Supabase...');

  const { data, error } = await supabase
    .from('keepalive')
    .select('id')
    .limit(1);

  if (error) {
    console.error('❌ Error haciendo ping:', error.message);
    process.exit(1);
  }

  console.log('✅ Ping exitoso. Supabase sigue activo.');
}

ping();
