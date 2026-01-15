import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import {
  profileSchema,
  serviceSchema,
  type ProfileFormData,
  type ServiceFormData,
  type Category,
} from './form-schema';

/**
 * Custom hook for managing profile and service creation/editing form state.
 *
 * This hook handles:
 * - Loading user data and available service categories
 * - Managing profile information (name, role, avatar)
 * - Managing multiple services (add, remove, update)
 * - Avatar file upload to Supabase storage
 * - Form validation using Zod schemas
 * - Profile and service persistence to database
 *
 * @returns {Object} Profile form state and handler functions
 * @returns {string | null} userId - Current authenticated user's ID
 * @returns {boolean} loading - Whether a save operation is in progress
 * @returns {Category[]} categories - Available service categories from database
 * @returns {ProfileFormData} profileData - Current profile form values
 * @returns {ServiceFormData[]} servicesData - Array of services being edited
 * @returns {Record<string, string>} validationErrors - Profile field validation errors
 * @returns {Record<string, string>} serviceErrors - Service field validation errors
 * @returns {string | null} generalError - General form error message
 * @returns {string | null} previewUrl - Local preview URL for selected avatar
 * @returns {Function} handleProfileChange - Updates a profile field value
 * @returns {Function} handleAvatarChange - Handles avatar file selection and preview
 * @returns {Function} addService - Adds a new empty service to the form
 * @returns {Function} removeService - Removes a service by its temporary ID
 * @returns {Function} handleServiceChange - Updates a service field value
 * @returns {Function} handleSubmit - Validates and saves profile and services to database
 *
 * @example
 * const {
 *   profileData,
 *   servicesData,
 *   handleProfileChange,
 *   handleSubmit,
 * } = useProfileForm();
 */
export function useProfileForm() {
  const supabase = createClient();
  const router = useRouter();

  // Estados
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

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

  const [servicesData, setServicesData] = useState<ServiceFormData[]>([]);

  // Errores
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [serviceErrors, setServiceErrors] = useState<Record<string, string>>(
    {}
  );
  const [generalError, setGeneralError] = useState<string | null>(null);

  /**
   * Initializes the form by:
   * 1. Fetching the current authenticated user
   * 2. Loading active service categories
   * 3. Loading existing profile data if available
   */
  useEffect(() => {
    const init = async () => {
      // 1. Obtener usuario
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
      else setGeneralError('Sesión no válida.');

      // 2. Obtener Categorías
      const { data: cats } = await supabase
        .from('categorias')
        .select('id, nombre, descripcion')
        .eq('es_activa', true)
        .order('nombre');
      if (cats) setCategories(cats);

      // 3. Cargar datos existentes del perfil si existen
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
   *
   * @param {keyof ProfileFormData} field - The profile field to update
   * @param {ProfileFormData[keyof ProfileFormData]} value - The new field value
   */
  const handleProfileChange = (
    field: keyof ProfileFormData,
    value: ProfileFormData[keyof ProfileFormData] // Tipado basado en el schema
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
   *
   * @param {File} file - The image file selected by the user
   */
  const handleAvatarChange = (file: File) => {
    setAvatarFile(file);
    // Crear URL local para preview inmediata
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  /**
   * Adds a new empty service object to the services array.
   * Uses current timestamp as temporary ID until saved to database.
   */
  const addService = () => {
    setServicesData((prev) => [
      ...prev,
      {
        tempId: Date.now(),
        categoria_id: '',
        nombre: '',
        descripcion: '',
        telefono: '',
        direccion: '',
        localidad: '',
        barrio: '',
        redes: '',
      },
    ]);
  };

  /**
   * Removes a service from the form by its temporary ID.
   *
   * @param {number} tempId - The temporary ID of the service to remove
   */
  const removeService = (tempId: number) => {
    setServicesData((prev) => prev.filter((s) => s.tempId !== tempId));
  };

  /**
   * Updates a service field and clears related validation errors.
   *
   * @param {number} index - The index of the service in the array
   * @param {keyof ServiceFormData} field - The service field to update
   * @param {string} value - The new field value
   */
  const handleServiceChange = (
    index: number,
    field: keyof ServiceFormData,
    value: string
  ) => {
    setServicesData((prev) => {
      const newData = [...prev];
      newData[index] = { ...newData[index], [field]: value };
      return newData;
    });
    // Limpiar errores
    const errKey = `${index}.${field}`;
    if (serviceErrors[errKey]) {
      setServiceErrors((prev) => {
        const n = { ...prev };
        delete n[errKey];
        return n;
      });
    }
  };

  /**
   * Uploads an avatar image to Supabase storage and returns the public URL.
   *
   * @async
   * @param {File} file - The image file to upload
   * @param {string} userId - The user ID for organizing the file path
   * @returns {Promise<string | null>} The public URL of the uploaded image or null on failure
   * @throws {Error} If the upload operation fails
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
   * Validates and submits the profile and services form.
   *
   * Process:
   * 1. Validates profile data against schema
   * 2. Validates all services if user is a provider
   * 3. Uploads avatar if a new one was selected
   * 4. Saves/updates profile in database
   * 5. Inserts services if user is a provider with services
   * 6. Redirects to feed on success
   *
   * @async
   * @param {React.FormEvent} e - The form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError(null);
    setValidationErrors({});
    setServiceErrors({});

    if (!userId) {
      setLoading(false);
      return setGeneralError('Usuario no identificado.');
    }

    // 1. Validaciones
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

    if (profileData.rol === 'proveedor' && servicesData.length > 0) {
      const newServErrors: Record<string, string> = {};
      let hasErr = false;
      servicesData.forEach((s, idx) => {
        const sVal = serviceSchema.safeParse(s);
        if (!sVal.success) {
          hasErr = true;
          sVal.error.issues.forEach(
            (i) => (newServErrors[`${idx}.${String(i.path[0])}`] = i.message)
          );
        }
      });
      if (hasErr) {
        setServiceErrors(newServErrors);
        setLoading(false);
        return;
      }
    }

    try {
      // 2. Subir Imagen si existe nueva
      let finalFotoUrl = profileData.foto_url;
      if (avatarFile) {
        const url = await uploadAvatar(avatarFile, userId);
        if (url) finalFotoUrl = url;
      }

      // 3. Insertar/Actualizar Perfil (Upsert es mejor aquí por si ya existe)
      const { data: profile, error: pError } = await supabase
        .from('perfiles')
        .upsert(
          {
            usuario_id: userId,
            nombre_completo: profileData.nombre_completo,
            rol: profileData.rol,
            foto_url: finalFotoUrl,
            insignias: profileData.insignias, // Se guardan si hubiera
            es_activo: true,
            updated_at: new Date().toISOString(),
            updated_by: userId,
          },
          { onConflict: 'usuario_id' }
        ) // Usamos upsert basado en usuario_id
        .select()
        .single();

      if (pError) throw pError;

      // 4. Guardar Servicios (Solo si es proveedor)
      if (profileData.rol === 'proveedor' && servicesData.length > 0) {
        // ... (Lógica de servicios existente)
        const servicesPayload = servicesData.map((s) => ({
          proveedor_id: profile.id, // Aseguramos usar el ID del perfil retornado
          categoria_id: s.categoria_id,
          nombre: s.nombre,
          descripcion: s.descripcion,
          telefono: s.telefono || null,
          direccion: s.direccion,
          localidad: s.localidad,
          barrio: s.barrio || null,
          redes: s.redes || null,
          es_activo: true,
          estado: true,
          created_by: userId,
          updated_by: userId,
        }));

        const { error: sError } = await supabase
          .from('servicios')
          .insert(servicesPayload);
        if (sError) throw sError;
      }

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
    categories,
    profileData,
    servicesData,
    validationErrors,
    serviceErrors,
    generalError,
    previewUrl, // Exportamos para el preview
    handleProfileChange,
    handleAvatarChange, // Exportamos el handler de archivo
    addService,
    removeService,
    handleServiceChange,
    handleSubmit,
  };
}
