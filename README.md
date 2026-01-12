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

2.  **Instalar dependencias:**

    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env.local` con tus credenciales de Supabase:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=tu_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
    ```

4.  **Correr el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    Abre http://localhost:3000 en tu navegador.

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**.
