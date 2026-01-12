import { z } from 'zod';

export type Category = {
  id: string;
  nombre: string;
  descripcion: string | null;
};

// RegEx para validar teléfonos (mínimo 10 dígitos, permite +, espacios y guiones)
const phoneRegex = /^\+?[0-9\s-]{10,15}$/;

export const serviceSchema = z.object({
  categoria_id: z.string().min(1, { message: 'Selecciona una categoría.' }),
  nombre: z.string().min(3, { message: 'Mínimo 3 caracteres.' }),
  descripcion: z.string().min(10, { message: 'Mínimo 10 caracteres.' }),
  telefono: z
    .string()
    .min(1, { message: 'El teléfono es requerido.' })
    .regex(phoneRegex, {
      message: 'Formato de teléfono inválido (ej: +54 266 4123456).',
    }),
  direccion: z.string().min(5, { message: 'Requerido.' }),
  localidad: z.string().min(2, { message: 'Requerido.' }),
  barrio: z.string().optional(),
});

export const profileSchema = z.object({
  nombre_completo: z
    .string()
    .min(2, { message: 'Mínimo 2 caracteres.' })
    .max(100, { message: 'Máximo 100 caracteres.' }),
  rol: z.enum(['user', 'proveedor']),
  // foto_url es opcional porque puede no tener foto al principio
  foto_url: z.string().optional(),
  // Las insignias suelen ser asignadas por el sistema, pero las definimos aquí
  insignias: z.array(z.string()).default([]),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type ServiceFormData = z.infer<typeof serviceSchema> & {
  tempId: number;
};
