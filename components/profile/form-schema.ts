import { z } from 'zod';

export type Category = {
  id: string;
  nombre: string;
  descripcion: string | null;
};

// RegEx para validar teléfonos (mínimo 10 dígitos, permite +, espacios y guiones)
const phoneRegex = /^\+?[0-9\s-]{10,15}$/;

// Schema para validar URLs de redes
const networkUrlSchema = z.object({
  url: z
    .string()
    .min(1, { message: 'La URL no puede estar vacía.' })
    .refine(
      (val) => {
        // Valida URLs o menciones de usuario (@usuario)
        const isUrl = val.startsWith('http://') || val.startsWith('https://');
        const isHandle = /^@[a-zA-Z0-9_]{1,30}$/.test(val);
        return isUrl || isHandle;
      },
      {
        message:
          'Ingresa una URL válida o un usuario (ej: @usuario o https://instagram.com/usuario)',
      }
    ),
});

export const serviceSchema = z.object({
  categoria_id: z
    .string()
    .min(1, { message: 'Debes seleccionar una categoría.' }),
  nombre: z.string().min(8, {
    message: 'El título del servicio debe tener al menos 8 caracteres.',
  }),
  descripcion: z.string().min(10, {
    message: 'La descripción del servicio debe tener al menos 10 caracteres.',
  }),
  telefono: z
    .string()
    .min(7, { message: 'El número de WhatsApp es requerido.' })
    .regex(phoneRegex, {
      message: 'El formato del WhatsApp no es válido (ej: +54 266 4123456).',
    }),
  direccion: z
    .string()
    .min(5, { message: 'La dirección es requerida (mínimo 5 caracteres).' }),
  localidad: z.string().min(3, { message: 'La localidad es requerida.' }),
  barrio: z.string().optional(),

  redes: z
    .array(networkUrlSchema)
    .max(3, { message: 'Máximo 3 redes permitidas.' })
    .optional()
    .default([]),
});

export const profileSchema = z.object({
  nombre_completo: z
    .string()
    .min(8, { message: 'El nombre completo debe tener al menos 8 caracteres.' })
    .max(100, {
      message: 'El nombre completo no puede exceder los 100 caracteres.',
    }),
  rol: z.enum(['user', 'proveedor']),
  foto_url: z.string().optional(),
  insignias: z.array(z.string()).default([]),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type ServiceFormData = z.infer<typeof serviceSchema> & {
  tempId: number;
};
export type NetworkUrl = z.infer<typeof networkUrlSchema>;
