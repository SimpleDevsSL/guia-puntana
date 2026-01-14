import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { authSchema, type AuthFormData } from './auth-schema';

/**
 * Custom hook for managing authentication form state and operations.
 *
 * This hook handles:
 * - Toggling between login and signup modes
 * - Form input validation using Zod schema
 * - Authentication with email/password and OAuth (Google)
 * - Error and success state management
 *
 * @returns {Object} Auth form state and handler functions
 * @returns {boolean} isLogin - Whether the form is in login mode (true) or signup mode (false)
 * @returns {boolean} loading - Whether an authentication operation is in progress
 * @returns {AuthFormData} formData - Current form input values (email, password)
 * @returns {Record<string, string>} validationErrors - Field-level validation error messages
 * @returns {string | null} generalError - General error message for the entire form
 * @returns {string | null} successMessage - Success message displayed after operations
 * @returns {Function} toggleMode - Switches between login and signup modes
 * @returns {Function} handleInputChange - Updates form field values and clears related errors
 * @returns {Function} handleGoogleLogin - Initiates OAuth login with Google
 * @returns {Function} handleSubmit - Validates and submits the authentication form
 *
 * @example
 * const {
 *   isLogin,
 *   loading,
 *   formData,
 *   handleInputChange,
 *   handleSubmit,
 * } = useAuthForm();
 */
export function useAuthForm() {
  const supabase = createClient();
  const router = useRouter();

  // Estados
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
  });

  // Feedback
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Toggles between login and signup modes.
   * Clears all error and success messages when switching modes.
   */
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setValidationErrors({});
    setGeneralError(null);
    setSuccessMessage(null);
  };

  /**
   * Updates a form field value and removes validation error for that field if present.
   *
   * @param {keyof AuthFormData} field - The field to update (e.g., 'email', 'password')
   * @param {string} value - The new value for the field
   */
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

  /**
   * Initiates OAuth login with Google using Supabase.
   * Sets loading state and handles errors gracefully.
   *
   * @async
   * @throws {Error} If OAuth configuration is invalid or network request fails
   */
  const handleGoogleLogin = async () => {
    setLoading(true);
    setGeneralError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      setGeneralError(errorMessage);
      setLoading(false);
    }
  };

  /**
   * Handles form submission for login or signup operations.
   *
   * Process:
   * 1. Validates form data using Zod schema
   * 2. For login: Authenticates user and redirects to feed
   * 3. For signup: Creates new account and prompts email confirmation
   *
   * @async
   * @param {React.FormEvent} e - The form submission event
   */
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
        router.push('/feed');
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
        setSuccessMessage('¡Cuenta creada! Revisa tu correo para confirmar.');
        setLoading(false);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Ocurrió un error inesperado.';
      setGeneralError(errorMessage);
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
