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
 * @param savedScrollPosition - Posición de scroll opcional a restaurar (si no se provee, usa la posición actual)
 */
export function useBodyScrollLock(isOpen: boolean, savedScrollPosition?: number) {
  useEffect(() => {
    if (!isOpen) return;

    // Incrementar el contador de modales
    modalCount++;

    // Solo aplicar el lock si es el primer modal Y no está ya aplicado
    if (modalCount === 1 && !document.body.style.position) {
      // Guardar el scroll actual (usar el proporcionado o el actual)
      originalScrollY = savedScrollPosition ?? window.scrollY;

      // Calcular el ancho de la scrollbar antes de ocultarla
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // Aplicar todos los estilos de una vez para evitar repaints
      const bodyStyle = document.body.style;
      
      // Aplicar el ancho de la scrollbar como variable CSS
      bodyStyle.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
      
      // Aplicar todos los estilos necesarios ANTES de agregar la clase
      bodyStyle.position = 'fixed';
      bodyStyle.top = `-${originalScrollY}px`;
      bodyStyle.left = '0';
      bodyStyle.right = '0';
      bodyStyle.overflow = 'hidden';
      bodyStyle.width = '100%';

      // Agregar la clase que bloquea el scroll (ahora solo para estilos adicionales)
      document.body.classList.add('no-scroll');
    } else if (modalCount === 1) {
      // Si los estilos ya están aplicados, solo guardar la posición
      originalScrollY = savedScrollPosition ?? window.scrollY;
    }

    // Cleanup: restaurar el scroll cuando el modal se cierre
    return () => {
      // Decrementar el contador
      modalCount--;

      // Solo remover el lock cuando no hay más modales abiertos
      if (modalCount === 0) {
        const bodyStyle = document.body.style;
        
        // Remover la clase
        document.body.classList.remove('no-scroll');
        
        // Remover todas las propiedades inline
        bodyStyle.removeProperty('--scrollbar-width');
        bodyStyle.removeProperty('position');
        bodyStyle.removeProperty('top');
        bodyStyle.removeProperty('left');
        bodyStyle.removeProperty('right');
        bodyStyle.removeProperty('overflow');
        bodyStyle.removeProperty('width');

        // Restaurar la posición de scroll
        window.scrollTo(0, originalScrollY);
      }
    };
  }, [isOpen, savedScrollPosition]);
}
