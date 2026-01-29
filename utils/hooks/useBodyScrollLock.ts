import { useEffect } from 'react';

/**
 * Hook personalizado para bloquear el scroll del body cuando un modal está abierto.
 * 
 * Previene el "scroll bleeding" (scroll del fondo mientras el modal está abierto)
 * y compensa el ancho de la scrollbar para evitar saltos en el layout.
 * 
 * @param isOpen - Boolean que indica si el modal está abierto
 */
export function useBodyScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;

    // Guardar el scroll actual
    const scrollY = window.scrollY;
    
    // Calcular el ancho de la scrollbar antes de ocultarla
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Aplicar el ancho de la scrollbar como variable CSS
    document.body.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    
    // Agregar la clase que bloquea el scroll
    document.body.classList.add('no-scroll');
    
    // Mantener la posición de scroll
    document.body.style.top = `-${scrollY}px`;

    // Cleanup: restaurar el scroll cuando el modal se cierre
    return () => {
      document.body.classList.remove('no-scroll');
      document.body.style.removeProperty('--scrollbar-width');
      document.body.style.removeProperty('top');
      
      // Restaurar la posición de scroll
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);
}
