# Guía Puntana 🏔️

**Guía Puntana** es una plataforma de código abierto diseñada para conectar a emprendedores y proveedores de servicios locales de San Luis, Argentina, con ciudadanos que buscan servicios confiables de manera directa y gratuita.

## 🎯 Objetivo del Proyecto

El propósito central es brindar visibilidad a los trabajadores locales sin cobrar comisiones ni intermediarios, fomentando el crecimiento económico regional mediante una herramienta pro-bono.

## ✨ Funcionalidades (MVP)

- **Autenticación:** Registro y acceso para proveedores vía Supabase Auth.
- **Perfiles de Servicio:** Los proveedores pueden publicar su contacto, descripción y categoría.
- **Búsqueda y Filtros:** Exploración de servicios por categorías (ej. Plomería, Electricidad).
- **Contacto Directo:** Botones funcionales para contactar vía WhatsApp o llamada telefónica.

## 🛠️ Stack Tecnológico

- **Framework:** [Next.js 15](https://nextjs.org/) (React + TypeScript).
- **Base de Datos y Auth:** [Supabase](https://supabase.com/) (PostgreSQL).
- **Estilos:** Tailwind CSS.
- **Despliegue:** Vercel.

## 🚀 Instalación y Desarrollo Local

1.  **Clonar el repositorio:**

    ```bash
    git clone [https://github.com/simpledevssl/guia-puntana.git](https://github.com/simpledevssl/guia-puntana.git)
    cd guia-puntana
    ```

2.  **Configurar variables de entorno:**
    Crea un archivo `.env.local` con tus credenciales de Supabase:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=tu_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
    ```

3.  **Configuración automática (recomendado):**

    ```bash
    npm run setup
    ```

    Este comando ejecuta automáticamente:
    - Instalación de dependencias (`npm install`)
    - Formateo de código (`npm run format`)
    - Corrección de linting (`npm run lint:fix`)
    - Build del proyecto (`npm run build`)
    - Inicio del servidor de desarrollo (`npm run dev`)

    **Nota:** Este es el método recomendado para configurar el proyecto por primera vez.

4.  **Configuración manual (alternativa):**

    Si prefieres ejecutar los comandos manualmente:

    ```bash
    # Instalar dependencias
    npm install

    # Formatear código
    npm run format

    # Corregir problemas de linting
    npm run lint:fix

    # Construir el proyecto
    npm run build

    # Correr el servidor de desarrollo
    npm run dev
    ```

    Abre http://localhost:3000 en tu navegador.

## 📜 Scripts Disponibles

- **`npm run dev`** - Inicia el servidor de desarrollo
- **`npm run build`** - Construye la aplicación para producción
- **`npm start`** - Inicia el servidor de producción
- **`npm run lint`** - Ejecuta el linter
- **`npm run lint:fix`** - Corrige automáticamente problemas de linting
- **`npm run format`** - Formatea el código con Prettier
- **`npm run setup`** - Configuración completa del proyecto (instala, formatea, corrige linting, construye e inicia)
- **`npm run validate`** - Valida el proyecto (instala, formatea, corrige linting y construye)

## 📄 Licencia

Este proyecto está bajo la **Licencia GNU Affero General Public License v3.0 (AGPL-3.0)**.

Esto significa que:

- ✅ Puedes usar, modificar y distribuir este software libremente
- ✅ Debes compartir el código fuente de cualquier versión modificada
- ✅ Si ejecutas una versión modificada en un servidor, debes ofrecer el código fuente a los usuarios
- ✅ Cualquier trabajo derivado debe usar la misma licencia AGPL-3.0

Para más información, consulta el archivo [LICENSE](LICENSE) o visita [https://www.gnu.org/licenses/agpl-3.0.html](https://www.gnu.org/licenses/agpl-3.0.html).
