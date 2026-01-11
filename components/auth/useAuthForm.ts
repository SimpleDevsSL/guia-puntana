import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { authSchema, type AuthFormData } from "./auth-schema";

export function useAuthForm() {
  const supabase = createClient();
  const router = useRouter();

  // Estados
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
  });

  // Feedback
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handlers
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setValidationErrors({});
    setGeneralError(null);
    setSuccessMessage(null);
  };

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setGeneralError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      setGeneralError(error.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError(null);
    setSuccessMessage(null);
    setValidationErrors({});

    // 1. Validación Zod
    const validation = authSchema.safeParse(formData);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) errors[issue.path[0].toString()] = issue.message;
      });
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const { email, password } = formData;

      if (isLogin) {
        // LOGIN
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        // Éxito: Redirigir al home (el Middleware verificará el perfil)
        router.push("/feed");
        router.refresh();
      } else {
        // REGISTRO
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setSuccessMessage("¡Cuenta creada! Revisa tu correo para confirmar.");
        setLoading(false);
      }
    } catch (err: any) {
      setGeneralError(err.message || "Ocurrió un error inesperado.");
      setLoading(false);
    }
  };

  return {
    isLogin,
    loading,
    formData,
    validationErrors,
    generalError,
    successMessage,
    toggleMode,
    handleInputChange,
    handleGoogleLogin,
    handleSubmit,
  };
}
