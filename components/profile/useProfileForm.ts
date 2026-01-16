import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { profileSchema, type ProfileFormData } from './form-schema';

/**
 * Custom hook for managing profile creation/editing form state.
 *
 * This hook handles:
 * - Loading user data
 * - Managing profile information (name, role, avatar)
 * - Avatar file upload to Supabase storage
 * - Form validation using Zod schemas
 * - Profile persistence to database
 *
 * @returns {Object} Profile form state and handler functions
 */
export function useProfileForm() {
  const supabase = createClient();
  const router = useRouter();

  // Estados
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Datos del formulario
  const [profileData, setProfileData] = useState<ProfileFormData>({
    nombre_completo: '',
    rol: 'user',
    foto_url: '',
    insignias: [],
  });

  // Estado específico para el archivo de imagen nuevo
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Errores
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  /**
   * Initializes the form by:
   * 1. Fetching the current authenticated user
   * 2. Loading existing profile data if available
   */
  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
      else setGeneralError('Sesión no válida.');

      // Cargar datos existentes del perfil si existen
      if (user) {
        const { data: existingProfile } = await supabase
          .from('perfiles')
          .select('nombre_completo, rol, foto_url, insignias')
          .eq('usuario_id', user.id)
          .single();

        if (existingProfile) {
          setProfileData({
            nombre_completo: existingProfile.nombre_completo || '',
            rol: existingProfile.rol as 'user' | 'proveedor',
            foto_url: existingProfile.foto_url || '',
            insignias: existingProfile.insignias || [],
          });
        }
      }
    };
    init();
  }, [supabase]);

  /**
   * Updates a profile field and clears its validation error if present.
   */
  const handleProfileChange = (
    field: keyof ProfileFormData,
    value: ProfileFormData[keyof ProfileFormData]
  ) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const n = { ...prev };
        delete n[field];
        return n;
      });
    }
  };

  /**
   * Handles avatar file selection and creates a local preview URL.
   */
  const handleAvatarChange = (file: File) => {
    setAvatarFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  /**
   * Uploads an avatar image to Supabase storage and returns the public URL.
   */
  const uploadAvatar = async (
    file: File,
    userId: string
  ): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      throw new Error('Error al subir la imagen de perfil');
    }
  };

  /**
   * Validates and submits the profile form.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError(null);
    setValidationErrors({});

    if (!userId) {
      setLoading(false);
      return setGeneralError('Usuario no identificado.');
    }

    // 1. Validar perfil
    const profVal = profileSchema.safeParse(profileData);
    if (!profVal.success) {
      const errors: Record<string, string> = {};
      profVal.error.issues.forEach(
        (i) => (errors[i.path[0].toString()] = i.message)
      );
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      // 2. Subir imagen si existe nueva
      let finalFotoUrl = profileData.foto_url;
      if (avatarFile) {
        const url = await uploadAvatar(avatarFile, userId);
        if (url) finalFotoUrl = url;
      }

      // 3. Insertar/Actualizar perfil
      const { error: pError } = await supabase
        .from('perfiles')
        .upsert(
          {
            usuario_id: userId,
            nombre_completo: profileData.nombre_completo,
            rol: profileData.rol,
            foto_url: finalFotoUrl,
            insignias: profileData.insignias,
            es_activo: true,
            updated_at: new Date().toISOString(),
            updated_by: userId,
          },
          { onConflict: 'usuario_id' }
        )
        .select()
        .single();

      if (pError) throw pError;

      router.push('/feed');
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : 'Error al guardar.';
      setGeneralError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    userId,
    loading,
    profileData,
    validationErrors,
    generalError,
    previewUrl,
    handleProfileChange,
    handleAvatarChange,
    handleSubmit,
  };
}
