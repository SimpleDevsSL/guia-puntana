import { useEffect } from 'react';

// Contador global de modales abiertos
let modalCount = 0;
// Guardar el scroll Y original
let originalScrollY = 0;

/**
 * Hook personalizado para bloquear el scroll del body cuando un modal está abierto.
 *
 * Previene el "scroll bleeding" (scroll del fondo mientras el modal está abierto)
 * y compensa el ancho de la scrollbar para evitar saltos en el layout.
 *
 * Soporta modales anidados mediante un contador de referencias - el scroll solo
 * se desbloquea cuando TODOS los modales se han cerrado.
 *
 * @param isOpen - Boolean que indica si el modal está abierto
 */
export function useBodyScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;

    // Incrementar el contador de modales
    modalCount++;

    // Solo aplicar el lock si es el primer modal
    if (modalCount === 1) {
      // Guardar el scroll actual
      originalScrollY = window.scrollY;

      // Calcular el ancho de la scrollbar antes de ocultarla
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // Aplicar el ancho de la scrollbar como variable CSS
      document.body.style.setProperty(
        '--scrollbar-width',
        `${scrollbarWidth}px`
      );

      // Agregar la clase que bloquea el scroll
      document.body.classList.add('no-scroll');

      // Mantener la posición de scroll
      document.body.style.top = `-${originalScrollY}px`;
    }

    // Cleanup: restaurar el scroll cuando el modal se cierre
    return () => {
      // Decrementar el contador
      modalCount--;

      // Solo remover el lock cuando no hay más modales abiertos
      if (modalCount === 0) {
        document.body.classList.remove('no-scroll');
        document.body.style.removeProperty('--scrollbar-width');
        document.body.style.removeProperty('top');

        // Restaurar la posición de scroll
        window.scrollTo(0, originalScrollY);
      }
    };
  }, [isOpen]);
}
