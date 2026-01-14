import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email({ message: 'El correo electrónico no es válido.' }),
  password: z
    .string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' }),
});

export type AuthFormData = z.infer<typeof authSchema>;
