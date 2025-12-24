import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email({ message: "Correo electrónico inválido." }),
  password: z.string().min(8, { message: "Mínimo 8 caracteres." }),
});

export type AuthFormData = z.infer<typeof authSchema>;
