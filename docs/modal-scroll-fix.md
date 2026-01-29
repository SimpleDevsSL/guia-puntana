# Solución: Prevención de Scroll Bleeding en Modales

## Problema
Al abrir una ventana modal, el usuario podía hacer scroll sobre el contenido principal de la página (parte exterior del modal), generando una experiencia de usuario inconsistente.

### Escenarios del Problema:
1. **Modales cortos**: Si el modal no tiene scroll interno, cualquier intento de scroll mueve la página de fondo.
2. **Modales largos**: Cuando el usuario llega al final del scroll interno del modal, el evento se propaga y comienza a mover el fondo.
3. **Modales anidados**: Cuando un modal se abre sobre otro modal (ej: ReportService sobre ServiceDetailModal), los scroll locks deben coordinarse correctamente.

## Solución Implementada

Se implementó una **solución híbrida** combinando dos técnicas complementarias:

### 1. Body Scroll Lock con Soporte para Modales Anidados (Opción A - Principal)

#### Archivos Modificados:
- `app/globals.css` - Clase CSS `.no-scroll`
- `utils/hooks/useBodyScrollLock.ts` - Hook personalizado con contador de referencias
- `components/feed/ServiceDetailModal.tsx` - Implementación del hook
- `components/feed/ReportService.tsx` - Implementación del hook

#### Funcionamiento:
1. Cuando un modal se abre, el hook `useBodyScrollLock` incrementa un contador global de modales
2. Si es el **primer modal** (contador = 1), se aplica el bloqueo:
   - Agrega la clase `.no-scroll` al elemento `<body>`
   - Calcula el ancho de la scrollbar y se compensa con `padding-right` para evitar el "salto" del layout
   - Preserva la posición de scroll actual
3. Cuando un **segundo modal** se abre (ej: ReportService sobre ServiceDetailModal):
   - El contador se incrementa a 2
   - El bloqueo ya está activo, así que no hace nada más
4. Al cerrar un modal, el contador se decrementa
5. Solo cuando el contador llega a **0** (todos los modales cerrados), se restaura el scroll del body

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
✅ **Soporte para modales anidados** (contador de referencias automático)

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

### ⚠️ Importante: Modales Anidados

**Ahora puedes usar `useBodyScrollLock` en TODOS los modales, incluso si están anidados.**

El hook usa un **sistema de contador de referencias** que coordina automáticamente múltiples modales:

✅ **Correcto** (ambos modales usan el hook):
```typescript
// Modal Padre
const ParentModal = () => {
  useBodyScrollLock(true); // ✅ Incrementa contador a 1, aplica el lock
  return (
    <div className="fixed inset-0 z-50 ...">
      <div className="... overscroll-contain">
        {/* Contenido */}
      </div>
    </div>
  );
};

// Modal Hijo (anidado)
const ChildModal = ({ isOpen }) => {
  useBodyScrollLock(isOpen); // ✅ Cuando se abre, incrementa contador a 2
  return (
    <div className="fixed inset-0 z-[60] ..."> {/* z-index mayor que el padre */}
      <div className="... overscroll-contain">
        {/* Contenido */}
      </div>
    </div>
  );
};
```

**Cómo funciona:**
1. Se abre `ParentModal` → contador = 1 → scroll bloqueado ✅
2. Se abre `ChildModal` → contador = 2 → scroll sigue bloqueado ✅
3. Se cierra `ChildModal` → contador = 1 → scroll sigue bloqueado ✅
4. Se cierra `ParentModal` → contador = 0 → scroll desbloqueado ✅

**Regla general**: Usa `useBodyScrollLock` en TODOS los modales que quieras que bloqueen el scroll del fondo. El hook se encarga automáticamente de coordinar modales anidados.

## Testing

Para verificar que la solución funciona correctamente:

### Test 1: Modal Simple
1. Abrir un modal (ej: ServiceDetailModal)
2. Intentar hacer scroll con el mouse wheel
3. ✅ Verificar que el fondo no se mueve
4. Si el modal tiene scroll interno, llegar al final
5. ✅ Verificar que el scroll no se propaga al fondo
6. Cerrar el modal
7. ✅ Verificar que el scroll del fondo se restaura correctamente

### Test 2: Modales Anidados
1. Abrir el modal padre (ServiceDetailModal)
2. ✅ Verificar que el fondo no se mueve
3. Abrir el modal hijo (ReportService - botón "denunciar")
4. ✅ Verificar que el fondo sigue sin moverse
5. Cerrar el modal hijo
6. ✅ Verificar que el fondo SIGUE bloqueado (modal padre aún abierto)
7. Cerrar el modal padre
8. ✅ Verificar que ahora sí se restaura el scroll del fondo

## Compatibilidad

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Referencias

- [MDN: overflow](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow)
- [MDN: overscroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior)
- [React useEffect Hook](https://react.dev/reference/react/useEffect)
