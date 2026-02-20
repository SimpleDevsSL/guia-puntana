# 🧪 Guía de Testing — Guía Puntana

> **Objetivo**: Que todos los miembros del proyecto entiendan qué tipos de tests existen, cuándo usar cada uno, y cómo correrlos en este repositorio.

---

## 📖 Tabla de Contenidos

1. [La Pirámide de Testing](#-la-pirámide-de-testing)
2. [Prueba Unitaria](#-prueba-unitaria)
3. [Prueba de Integración](#-prueba-de-integración)
4. [Prueba End-to-End (E2E)](#-prueba-end-to-end-e2e)
5. [Cómo Correr los Tests](#-cómo-correr-los-tests)
6. [Estructura de Archivos](#-estructura-de-archivos)
7. [Dependencias Instaladas](#-dependencias-instaladas)
8. [Convenciones del Equipo](#-convenciones-del-equipo)
9. [Recursos para Aprender Más](#-recursos-para-aprender-más)

---

## 🔺 La Pirámide de Testing

```
         ╱ ╲
        ╱ E2E ╲           ← Pocos, lentos, pero cubren el flujo real
       ╱───────╲
      ╱ Integra- ╲       ← Cantidad media, testean módulos juntos
     ╱   ción     ╲
    ╱───────────────╲
   ╱   Unitarios     ╲   ← Muchos, rápidos, funciones aisladas
  ╱___________________╲
```

| Tipo            | Velocidad     | Aislamiento | ¿Qué testea?                        |
| --------------- | ------------- | ----------- | ----------------------------------- |
| **Unitaria**    | ⚡ Muy rápida | Total       | Una función/módulo aislado          |
| **Integración** | 🔄 Media      | Parcial     | Varios módulos interactuando        |
| **E2E**         | 🐢 Lenta      | Ninguno     | El sistema completo como un usuario |

**Regla de oro**: Muchas pruebas unitarias, algunas de integración, pocas E2E.

---

## 🧩 Prueba Unitaria

### ¿Qué es?

Una prueba unitaria testea **una sola función** de forma completamente **aislada**. No necesita base de datos, ni servidor, ni navegador. Es la prueba más rápida de todas.

### ¿Qué testeamos?

Las funciones de `utils/localidades.ts` — específicamente `filterLocalidades` e `isValidLocalidad`. Son funciones **puras**: reciben un input, devuelven un output, sin efectos secundarios.

### 📁 Archivo: `__tests__/unit/localidades.test.ts`

### Flujo del test paso a paso:

```
┌─────────────────────────────────────────────────────┐
│           PRUEBA: filterLocalidades('')             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. ARRANGE (Preparar)                              │
│     └─ searchTerm = ''                              │
│                                                     │
│  2. ACT (Ejecutar)                                  │
│     └─ result = filterLocalidades(searchTerm)       │
│                                                     │
│  3. ASSERT (Verificar)                              │
│     └─ expect(result).toEqual(LOCALIDADES_SAN_LUIS) │
│     └─ ✅ PASA si devuelve todas las localidades   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Concepto clave: **Patrón AAA (Arrange, Act, Assert)**

Cada test sigue este patrón universal:

```typescript
it('filtra correctamente al buscar "Merlo"', () => {
  // 1️⃣ Arrange — Preparamos los datos de entrada
  const searchTerm = 'Merlo';

  // 2️⃣ Act — Ejecutamos la función que queremos testear
  const result = filterLocalidades(searchTerm);

  // 3️⃣ Assert — Verificamos que el resultado sea el esperado
  expect(result).toContain('Merlo');
  expect(result).toHaveLength(1);
});
```

### ¿Cuándo escribir una prueba unitaria?

- ✅ Funciones puras (input → output)
- ✅ Funciones utilitarias (`utils/`, helpers, formatters)
- ✅ Validaciones (formularios, datos)
- ✅ Cálculos y transformaciones de datos
- ❌ NO para componentes con estado complejo
- ❌ NO para flujos que involucran múltiples sistemas

---

## 🔗 Prueba de Integración

### ¿Qué es?

Una prueba de integración verifica que **varios módulos funcionen correctamente juntos**. A diferencia de una unitaria, aquí nos interesa cómo los componentes se **comunican entre sí**.

### ¿Qué testeamos?

El middleware `updateSession` (`utils/supabase/middleware.ts`), que integra:

| Sistema               | Rol                                  |
| --------------------- | ------------------------------------ |
| 🍪 Cookies de Next.js | Transportar la sesión                |
| 🔐 Supabase Auth      | Verificar si hay usuario autenticado |
| 📦 Supabase DB        | Consultar si el perfil está completo |
| 🚦 Next.js Router     | Decidir a dónde redirigir            |

### 📁 Archivo: `__tests__/integration/middleware.test.ts`

### Flujo del test paso a paso:

```
┌──────────────────────────────────────────────────────────────┐
│    ESCENARIO: Visitante intenta acceder a /perfil            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. CONFIGURAR MOCKS                                        │
│     └─ mockGetUser → devuelve { user: null }                 │
│     (Simulamos que Supabase dice "no hay usuario")           │
│                                                              │
│  2. CREAR REQUEST SIMULADO                                   │
│     └─ NextRequest('/perfil')                                │
│                                                              │
│  3. EJECUTAR EL MIDDLEWARE                                   │
│     └─ response = await updateSession(request)               │
│                                                              │
│  4. VERIFICAR LA RESPUESTA                                   │
│     └─ expect(response.status).toBe(307)  // Redirect        │
│     └─ expect(location).toContain('/login')                  │
│     └─ ✅ PASA: El visitante fue redirigido a login          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Concepto clave: **Mocking con `vi.mock()`**

En una prueba de integración **no nos conectamos** a la base de datos real. Usamos **mocks** para controlar lo que devuelve Supabase:

```typescript
// Creamos una función "falsa" que podemos controlar
const mockGetUser = vi.fn();

// Le decimos a Vitest: "cuando alguien importe @supabase/ssr,
// devolvé este objeto falso en lugar del real"
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
    // ... más métodos mockeados
  })),
}));

// En cada test, configuramos qué devuelve el mock:
mockGetUser.mockResolvedValue({ data: { user: null } }); // Sin usuario
mockGetUser.mockResolvedValue({ data: { user: { id: '123' } } }); // Con usuario
```

### Matriz de decisión del middleware:

| Estado del Usuario        | Ruta                | Resultado Esperado                |
| :------------------------ | :------------------ | :-------------------------------- |
| ❌ Sin sesión             | `/feed`             | ✅ Accede (público)               |
| ❌ Sin sesión             | `/perfil`           | 🔀 Redirige → `/login`            |
| ❌ Sin sesión             | `/completar-perfil` | 🔀 Redirige → `/login`            |
| 🔐 Con sesión, SIN perfil | `/feed`             | 🔀 Redirige → `/completar-perfil` |
| 🔐 Con sesión, SIN perfil | `/completar-perfil` | ✅ Accede (es la ruta correcta)   |
| ✅ Con sesión, CON perfil | `/`                 | 🔀 Redirige → `/feed`             |
| ✅ Con sesión, CON perfil | `/login`            | 🔀 Redirige → `/feed`             |
| ✅ Con sesión, CON perfil | `/completar-perfil` | 🔀 Redirige → `/feed`             |

### ¿Cuándo escribir una prueba de integración?

- ✅ Middleware que combina auth + routing
- ✅ Servicios que consultan la DB y transforman datos
- ✅ APIs que validan input, consultan DB, y devuelven respuesta
- ✅ Flujos que involucran 2+ módulos
- ❌ NO para lógica de una sola función (eso es unitaria)
- ❌ NO para flujos de usuario completos (eso es E2E)

---

## 🌐 Prueba End-to-End (E2E)

### ¿Qué es?

Una prueba E2E simula a un **usuario real** usando la app en un **navegador real**. No se mockea absolutamente nada: el frontend, backend, y base de datos funcionan como en producción.

### ¿Qué testeamos?

El flujo de un **visitante nuevo** que llega a la landing page:

1. Ve la landing page correctamente
2. Verifica que el contenido sea visible
3. Hace clic en "Comenzar ahora" y navega al feed
4. Verifica que el footer tenga los links legales

### 📁 Archivo: `__tests__/e2e/landing-navigation.spec.ts`

### Flujo del test paso a paso:

```
┌──────────────────────────────────────────────────────────────┐
│    TEST E2E: "Comenzar ahora" navega al feed                │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  🌐 Se abre un navegador Chromium real                       │
│                                                              │
│  1. page.goto('/')                                           │
│     └─ Playwright abre http://localhost:3000                 │
│     └─ Espera a que el DOM esté listo                        │
│                                                              │
│  2. page.getByRole('link', { name: /comenzar ahora/i })      │
│     └─ Busca el botón CTA usando accesibilidad (NO selectores CSS)│
│                                                              │
│  3. ctaButton.click()                                        │
│     └─ Simula un clic real del usuario                       │
│                                                              │
│  4. page.waitForURL('**/feed')                               │
│     └─ Espera hasta que la URL sea /feed                     │
│                                                              │
│  5. expect(page.url()).toContain('/feed')                     │
│     └─ ✅ PASA si la URL contiene /feed                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Concepto clave: **Locators Accesibles**

Playwright recomienda usar **roles de accesibilidad** en lugar de selectores CSS:

```typescript
// ❌ MAL — Frágil, se rompe si cambia la clase CSS
page.locator('.btn-orange-primary');

// ❌ REGULAR — Se rompe si cambia el atributo data-testid
page.locator('[data-testid="cta-button"]');

// ✅ BIEN — Busca por ROL semántico, como lo haría un usuario real
page.getByRole('link', { name: /comenzar ahora/i });
// Esto busca un <a> (link) cuyo texto contenga "comenzar ahora"
```

### ¿Cuándo escribir una prueba E2E?

- ✅ Flujos críticos de negocio (registro, login, compra)
- ✅ Navegación entre páginas principales
- ✅ Formularios complejos con validación
- ✅ Flujos que involucran redirecciones
- ❌ NO para lógica de utilidades (demasiado lento)
- ❌ NO para cada variación de un componente

---

## 🚀 Cómo Correr los Tests

### Instalación (una sola vez)

```bash
# 1. Instalar dependencias del proyecto (incluye Vitest)
npm install

# 2. Instalar los navegadores de Playwright (solo para E2E)
npx playwright install
```

### Comandos disponibles

```bash
# ── TODOS los tests (unitarios + integración) ──
npm test

# ── Solo unitarios ──
npm run test:unit

# ── Solo integración ──
npm run test:integration

# ── Modo watch (re-ejecuta al guardar cambios) ──
npm run test:watch

# ── E2E (requiere que la app esté corriendo) ──
npm run test:e2e

# ── E2E con interfaz visual de Playwright ──
npm run test:e2e:ui
```

### Diagrama de ejecución

```
npm test
  │
  ├─ Vitest lee vitest.config.ts
  │    │
  │    ├─ Busca archivos en __tests__/unit/**/*.test.ts
  │    │    └─ localidades.test.ts ──── ⚡ ~50ms
  │    │
  │    └─ Busca archivos en __tests__/integration/**/*.test.ts
  │         └─ middleware.test.ts ───── 🔄 ~200ms
  │
  └─ Total: ~300ms ✅


npm run test:e2e
  │
  ├─ Playwright lee playwright.config.ts
  │    │
  │    ├─ Arranca `npm run dev` automáticamente
  │    │    └─ Espera a que localhost:3000 responda
  │    │
  │    └─ Abre Chromium y ejecuta los tests
  │         └─ landing-navigation.spec.ts ── 🐢 ~5s
  │
  └─ Total: ~10-20s (incluye compilación) ✅
```

---

## 📂 Estructura de Archivos

```
guia-puntana/
├── __tests__/                          ← 📁 Carpeta de tests
│   ├── unit/                           ← 🧩 Tests unitarios
│   │   └── localidades.test.ts         ←    Testea utils/localidades.ts
│   ├── integration/                    ← 🔗 Tests de integración
│   │   └── middleware.test.ts          ←    Testea utils/supabase/middleware.ts
│   └── e2e/                            ← 🌐 Tests End-to-End
│       └── landing-navigation.spec.ts  ←    Testea el flujo de la landing
├── vitest.config.ts                    ← ⚙️ Configuración de Vitest
├── playwright.config.ts                ← ⚙️ Configuración de Playwright
└── package.json                        ← 📦 Scripts de testing
```

### Convención de nombres

| Tipo        | Patrón      | Ejemplo                      |
| ----------- | ----------- | ---------------------------- |
| Unitarios   | `*.test.ts` | `localidades.test.ts`        |
| Integración | `*.test.ts` | `middleware.test.ts`         |
| E2E         | `*.spec.ts` | `landing-navigation.spec.ts` |

---

## 📦 Dependencias Instaladas

| Paquete            | Tipo   | Para qué                                       |
| ------------------ | ------ | ---------------------------------------------- |
| `vitest`           | devDep | Framework de testing (unitarios + integración) |
| `jsdom`            | devDep | Simula el DOM del navegador para Vitest        |
| `@playwright/test` | devDep | Framework de testing E2E                       |

### ¿Por qué Vitest y no Jest?

- ⚡ **Más rápido** — Usa el bundler de Vite (esbuild)
- 🔧 **Misma API** — Compatible con la sintaxis de Jest (`describe`, `it`, `expect`)
- 🔌 **Mejor integración** — Se lleva nativamente con TypeScript y ESModules
- 📦 **Menos configuración** — No necesita Babel ni ts-jest

### ¿Por qué Playwright y no Cypress?

- 🏎️ **Más rápido** — Ejecuta en paralelo por defecto
- 🌐 **Multi-navegador** — Chrome, Firefox, Safari de forma nativa
- ⏳ **Auto-waiting** — Espera automáticamente por los elementos
- 🎯 **Locators semánticos** — `getByRole()`, `getByText()` por defecto

---

## 📏 Convenciones del Equipo

### 1. Nombre de los tests: Describe el COMPORTAMIENTO, no la implementación

```typescript
// ❌ MAL — Describe la implementación
it('llama a Array.filter con .toLowerCase()', () => { ... });

// ✅ BIEN — Describe el comportamiento esperado
it('la búsqueda es case-insensitive', () => { ... });
```

### 2. Un assert por concepto lógico

```typescript
// ❌ MAL — 10 asserts que testean cosas diferentes
it('el filtro funciona', () => {
  expect(filterLocalidades('')).toEqual(LOCALIDADES_SAN_LUIS);
  expect(filterLocalidades('Merlo')).toContain('Merlo');
  expect(isValidLocalidad('Buenos Aires')).toBe(false);
  // Demasiado — si falla uno, no sabes cuál ni por qué
});

// ✅ BIEN — Cada test es atómico y claro
it('devuelve todas si el término está vacío', () => { ... });
it('filtra correctamente al buscar "Merlo"', () => { ... });
it('devuelve false para localidades de otra provincia', () => { ... });
```

### 3. Aislar los tests con `beforeEach`

```typescript
beforeEach(() => {
  vi.clearAllMocks(); // Limpia todos los mocks entre tests
});
// Esto evita que un test contamine al siguiente
```

### 4. Nunca depender de la red o la base de datos en unitarios/integración

```typescript
// ❌ MAL — Se conecta a Supabase real
const supabase = createClient(url, key);
const { data } = await supabase.from('perfiles').select('*');

// ✅ BIEN — Mockea la respuesta
mockSelectProfile.mockResolvedValue({ data: { id: 'perfil-456' } });
```

---

## 📚 Recursos para Aprender Más

### Vitest (Unitarios + Integración)

- [Documentación oficial de Vitest](https://vitest.dev/)
- [API de expect](https://vitest.dev/api/expect.html)
- [Mocking con Vitest](https://vitest.dev/guide/mocking.html)

### Playwright (E2E)

- [Documentación oficial de Playwright](https://playwright.dev/)
- [Locators (cómo buscar elementos)](https://playwright.dev/docs/locators)
- [Best Practices](https://playwright.dev/docs/best-practices)

### General

- [Testing Trophy de Kent C. Dodds](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [Patrón AAA (Arrange, Act, Assert)](https://automationpanda.com/2020/07/07/arrange-act-assert-a-pattern-for-writing-good-tests/)

---

> 💡 **Tip final**: Si tenés dudas sobre si algo necesita un test, preguntate: _"¿Qué pasa si alguien cambia esta función sin querer?"_. Si la respuesta te da miedo, escribí un test. 🙂
