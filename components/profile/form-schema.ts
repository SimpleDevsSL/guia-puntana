import { z } from "zod";

export type Category = {
  id: string;
  nombre: string;
  descripcion: string | null;
};

// Esquema para un solo servicio
export const serviceSchema = z.object({
  categoria_id: z.string().min(1, { message: "Selecciona una categoría." }),
  nombre: z.string().min(3, { message: "Mínimo 3 caracteres." }),
  descripcion: z.string().min(10, { message: "Mínimo 10 caracteres." }),
  telefono: z.string().optional(),
  direccion: z.string().min(5, { message: "Requerido." }),
  localidad: z.string().min(2, { message: "Requerido." }),
  barrio: z.string().optional(),
});

// Esquema para el perfil
export const profileSchema = z.object({
  nombre_completo: z
    .string()
    .min(2, { message: "Mínimo 2 caracteres." })
    .max(100, { message: "Máximo 100 caracteres." }),
  rol: z.enum(["user", "proveedor"]),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type ServiceFormData = z.infer<typeof serviceSchema> & {
  tempId: number;
};
