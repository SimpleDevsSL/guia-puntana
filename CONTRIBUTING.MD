# Contribuyendo a Guía Puntana 🤝

¡Gracias por tu interés en colaborar! [cite_start]Este es un proyecto **pro-bono y open source** mantenido por voluntarios[cite: 22, 23].

## 🛣️ Flujo de Trabajo (Git)
[cite_start]Utilizamos un flujo de ramas organizado para mantener la estabilidad del código[cite: 69]:
* `main`: Rama de producción (solo código estable).
* `dev`: Rama de desarrollo donde se integran las nuevas funcionalidades.
* **Feature Branches**: Crea una rama para cada cambio (`feature/nombre-de-la-mejora`).

**Pasos para contribuir:**
1. Haz un Fork del proyecto.
2. Crea tu rama de funcionalidad: `git checkout -b feature/mi-mejora`.
3. Realiza tus cambios y asegúrate de que el linter pase.
4. [cite_start]Abre un **Pull Request (PR)** hacia la rama `dev`[cite: 70].

## 💻 Estándares de Código
[cite_start]Para mantener la consistencia, todos los colaboradores deben seguir estas reglas[cite: 51]:
* [cite_start]**Formato:** Es obligatorio el uso de `ESLint` y `Prettier` (configurados en el proyecto)[cite: 52, 53].
* [cite_start]**Documentación:** Usa `JSDoc/TSDoc` para documentar funciones clave, parámetros y retornos[cite: 55].
* [cite_start]**TypeScript:** Asegúrate de tipar correctamente tus componentes y funciones de lógica[cite: 48].

## 🧪 Pruebas
[cite_start]Antes de enviar un PR, verifica que[cite: 78, 79]:
* La lógica de negocio (validaciones de formularios, queries) pase las pruebas unitarias.
* El flujo de autenticación y subida de servicios funcione correctamente.