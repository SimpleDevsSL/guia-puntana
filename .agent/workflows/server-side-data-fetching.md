---
description: Guía para implementar Server-Side Data Fetching en Next.js
---

# Server-Side Data Fetching Pattern

## 🎯 ¿Por qué es importante?

### Antes (Client-Side Fetching)

```tsx
'use client';
export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  return <Content data={data} />;
}
```

**Problemas:**

- ❌ El usuario ve un spinner de carga
- ❌ Parpadeo de contenido (layout shift)
- ❌ Peor experiencia de usuario
- ❌ Peor SEO (contenido no está en HTML inicial)

### Después (Server-Side Fetching)

```tsx
// page.tsx (Server Component)
export default async function Page() {
  const data = await fetchData(); // Se ejecuta en el servidor
  return <ClientComponent initialData={data} />;
}

// ClientComponent.tsx
('use client');
export default function ClientComponent({ initialData }) {
  const [data, setData] = useState(initialData);
  // Ya no hay loading state inicial!
  return <Content data={data} />;
}
```

**Beneficios:**

- ✅ Contenido instantáneo (sin spinner)
- ✅ Mejor experiencia de usuario
- ✅ Mejor SEO
- ✅ Menor tiempo de First Contentful Paint (FCP)

## 📋 Pasos para implementar

### 1. Identificar componentes candidatos

Busca páginas que tengan este patrón:

```tsx
'use client';
// ... imports
export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch data
  }, []);
}
```

### 2. Separar en dos componentes

**A. Crear el Client Component** (`components/services/ComponentClient.tsx`)

```tsx
'use client';

import { useState } from 'react';

interface Props {
  initialData: YourDataType[];
}

export default function ComponentClient({ initialData }: Props) {
  const [data, setData] = useState(initialData);

  // Mantén aquí toda la lógica interactiva:
  // - Event handlers (onClick, onChange, etc.)
  // - Mutaciones de estado
  // - Funciones para refetch

  const handleUpdate = async () => {
    // Lógica para actualizar datos
    const newData = await fetchData();
    setData(newData);
  };

  return <div>{/* Tu UI aquí */}</div>;
}
```

**B. Crear el Server Component** (`page.tsx`)

```tsx
import { createClient } from '@/utils/supabase/server';
import ComponentClient from '@/components/services/ComponentClient';
import { redirect } from 'next/navigation';

export default async function Page() {
  const supabase = await createClient();

  // 1. Autenticación (si es necesario)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // 2. Fetch de datos
  const { data } = await supabase
    .from('your_table')
    .select('*')
    .eq('user_id', user.id);

  // 3. Pasar datos al componente cliente
  return <ComponentClient initialData={data || []} />;
}
```

### 3. Usar el cliente correcto de Supabase

**Servidor:** `@/utils/supabase/server`

```tsx
import { createClient } from '@/utils/supabase/server';

export default async function ServerComponent() {
  const supabase = await createClient(); // ← await!
  // ...
}
```

**Cliente:** `@/utils/supabase/client`

```tsx
'use client';
import { createClient } from '@/utils/supabase/client';

export default function ClientComponent() {
  const supabase = createClient(); // ← sin await
  // ...
}
```

## 🎓 Ejemplo Real: Gestión de Servicios

### Antes

```tsx
// app/servicios/nuevo/page.tsx
'use client';

export default function GestionServiciosPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserServices();
  }, []);

  if (loading) return <Spinner />;
  return <ServicesList services={services} />;
}
```

### Después

**Server Component** (`page.tsx`):

```tsx
import { createClient } from '@/utils/supabase/server';
import GestionServiciosClient from '@/components/services/GestionServiciosClient';

export default async function GestionServiciosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('perfiles')
    .select('id')
    .eq('usuario_id', user.id)
    .single();

  let initialServices = [];
  if (profile) {
    const { data } = await supabase
      .from('servicios')
      .select('*, categoria:categorias(id, nombre)')
      .eq('proveedor_id', profile.id)
      .eq('es_activo', true);

    initialServices = data || [];
  }

  return <GestionServiciosClient initialServices={initialServices} />;
}
```

**Client Component** (`components/services/GestionServiciosClient.tsx`):

```tsx
'use client';

interface Props {
  initialServices: ServiceWithProfile[];
}

export default function GestionServiciosClient({ initialServices }: Props) {
  const [services, setServices] = useState(initialServices);
  // Ya no hay loading state inicial!

  const handleDelete = async (id: string) => {
    // Lógica de eliminación
  };

  return (
    <div>
      {services.map((service) => (
        <ServiceCard key={service.id} {...service} />
      ))}
    </div>
  );
}
```

## 🔄 Cuándo refetch en el cliente

Después de mutaciones (crear, actualizar, eliminar):

```tsx
'use client';

export default function ComponentClient({ initialData }: Props) {
  const [data, setData] = useState(initialData);
  const supabase = createClient(); // Cliente de Supabase

  const refetchData = async () => {
    const { data: newData } = await supabase
      .from('your_table')
      .select('*');
    setData(newData || []);
  };

  const handleCreate = async (newItem) => {
    await supabase.from('your_table').insert(newItem);
    await refetchData(); // Actualizar después de crear
  };

  const handleDelete = async (id) => {
    await supabase.from('your_table').delete().eq('id', id);
    await refetchData(); // Actualizar después de eliminar
  };

  return (
    // UI
  );
}
```

## 📊 Comparación de Performance

| Métrica                | Client-Side | Server-Side | Mejora  |
| ---------------------- | ----------- | ----------- | ------- |
| First Contentful Paint | ~2s         | ~0.5s       | 75% ⬇️  |
| Time to Interactive    | ~2.5s       | ~1s         | 60% ⬇️  |
| Layout Shift           | Alto        | Ninguno     | 100% ⬇️ |
| SEO Score              | Bajo        | Alto        | ⬆️      |

## ✅ Checklist de implementación

- [ ] Identificar componente con client-side fetching
- [ ] Crear nuevo archivo `ComponentClient.tsx` con `'use client'`
- [ ] Mover lógica interactiva al client component
- [ ] Agregar prop `initialData` al client component
- [ ] Convertir `page.tsx` en async server component
- [ ] Usar `createClient()` de `@/utils/supabase/server`
- [ ] Fetch datos en el servidor
- [ ] Pasar datos como props al client component
- [ ] Eliminar estado `loading` inicial
- [ ] Probar que funcione correctamente

## 🚀 Próximos pasos

1. Aplicar este patrón a otras páginas:
   - `/feed` - Lista de servicios
   - `/perfil` - Datos del perfil
   - Cualquier página con `useEffect` + fetch

2. Considerar usar React Server Actions para mutaciones

3. Implementar Streaming con Suspense para datos lentos

## 📚 Recursos adicionales

- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Server vs Client Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side)
