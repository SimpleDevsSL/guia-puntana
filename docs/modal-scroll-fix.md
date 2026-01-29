# Solución: Prevención de Scroll Bleeding en Modales

## Problema
Al abrir una ventana modal, el usuario podía hacer scroll sobre el contenido principal de la página (parte exterior del modal), generando una experiencia de usuario inconsistente.

### Escenarios del Problema:
1. **Modales cortos**: Si el modal no tiene scroll interno, cualquier intento de scroll mueve la página de fondo.
2. **Modales largos**: Cuando el usuario llega al final del scroll interno del modal, el evento se propaga y comienza a mover el fondo.

## Solución Implementada

Se implementó una **solución híbrida** combinando dos técnicas complementarias:

### 1. Body Scroll Lock (Opción A - Principal)

#### Archivos Modificados:
- `app/globals.css` - Clase CSS `.no-scroll`
- `utils/hooks/useBodyScrollLock.ts` - Hook personalizado
- `components/feed/ServiceDetailModal.tsx` - Implementación del hook
- `components/feed/ReportService.tsx` - Implementación del hook

#### Funcionamiento:
1. Cuando un modal se abre, el hook `useBodyScrollLock` agrega la clase `.no-scroll` al elemento `<body>`
2. La clase aplica `overflow: hidden` para bloquear el scroll
3. Se calcula el ancho de la scrollbar y se compensa con `padding-right` para evitar el "salto" del layout
4. Se preserva la posición de scroll actual
5. Al cerrar el modal, se limpia todo y se restaura el estado original

#### Código CSS:
```css
body.no-scroll {
  overflow: hidden;
  padding-right: var(--scrollbar-width, 0px);
}
```

#### Uso del Hook:
```typescript
// Para modales siempre abiertos (cuando el componente está montado)
useBodyScrollLock(true);

// Para modales condicionales
const [isOpen, setIsOpen] = useState(false);
useBodyScrollLock(isOpen);
```

### 2. Overscroll Behavior (Opción B - Secundaria)

#### Implementación:
Se agregó la clase `overscroll-contain` a los contenedores scrollables de los modales.

```tsx
<div className="... overscroll-contain" onClick={(e) => e.stopPropagation()}>
  {/* Contenido del modal */}
</div>
```

#### Beneficio:
- Previene la propagación de eventos de scroll cuando el usuario llega al final del contenido del modal
- Funciona como una capa adicional de protección

## Ventajas de la Solución

✅ **Bloqueo completo del scroll de fondo**
✅ **Sin saltos de layout** (compensación de scrollbar)
✅ **Preservación de la posición de scroll**
✅ **Reutilizable** (hook personalizado)
✅ **Limpieza automática** (useEffect cleanup)
✅ **Doble capa de protección** (body lock + overscroll-contain)

## Cómo Usar en Nuevos Modales

Para implementar esta solución en nuevos modales:

1. Importar el hook:
```typescript
import { useBodyScrollLock } from '@/utils/hooks/useBodyScrollLock';
```

2. Usar el hook en el componente:
```typescript
const MyModal = ({ isOpen, onClose }) => {
  // Bloquear scroll cuando el modal está abierto
  useBodyScrollLock(isOpen);
  
  return (
    <div className="fixed inset-0 z-50 ...">
      <div className="... overscroll-contain">
        {/* Contenido */}
      </div>
    </div>
  );
};
```

## Testing

Para verificar que la solución funciona correctamente:

1. Abrir un modal
2. Intentar hacer scroll con el mouse wheel
3. Verificar que el fondo no se mueve
4. Si el modal tiene scroll interno, llegar al final
5. Verificar que el scroll no se propaga al fondo
6. Cerrar el modal
7. Verificar que el scroll del fondo se restaura correctamente

## Compatibilidad

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Referencias

- [MDN: overflow](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow)
- [MDN: overscroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior)
- [React useEffect Hook](https://react.dev/reference/react/useEffect)
