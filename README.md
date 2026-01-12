# Guía Puntana 🏔️

[cite_start]**Guía Puntana** es una plataforma de código abierto diseñada para conectar a emprendedores y proveedores de servicios locales de San Luis, Argentina, con ciudadanos que buscan servicios confiables de manera directa y gratuita[cite: 5, 17].

## 🎯 Objetivo del Proyecto
[cite_start]El propósito central es brindar visibilidad a los trabajadores locales sin cobrar comisiones ni intermediarios, fomentando el crecimiento económico regional mediante una herramienta pro-bono[cite: 17, 24].

## ✨ Funcionalidades (MVP)
* [cite_start]**Autenticación:** Registro y acceso para proveedores vía Supabase Auth[cite: 10, 90].
* [cite_start]**Perfiles de Servicio:** Los proveedores pueden publicar su contacto, descripción y categoría[cite: 11, 91].
* [cite_start]**Búsqueda y Filtros:** Exploración de servicios por categorías (ej. Plomería, Electricidad)[cite: 12, 93].
* [cite_start]**Contacto Directo:** Botones funcionales para contactar vía WhatsApp o llamada telefónica[cite: 13, 94].

## 🛠️ Stack Tecnológico
* [cite_start]**Framework:** [Next.js 15](https://nextjs.org/) (React + TypeScript)[cite: 48].
* [cite_start]**Base de Datos y Auth:** [Supabase](https://supabase.com/) (PostgreSQL)[cite: 47, 49].
* **Estilos:** Tailwind CSS.
* [cite_start]**Despliegue:** Vercel[cite: 50].

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
    Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📄 Licencia
[cite_start]Este proyecto está bajo la **Licencia MIT**[cite: 57, 58].