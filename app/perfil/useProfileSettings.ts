import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

/**
 * Custom hook for managing user profile settings and account operations.
 *
 * This hook provides functionality for:
 * - Loading user authentication and profile data
 * - Updating basic profile information (name, avatar)
 * - Email and password management with identity verification
 * - Role management (converting to provider)
 * - Account deletion
 *
 * @returns {Object} Profile settings state and handler functions
 * @returns {boolean} loading - Whether initial data is being loaded
 * @returns {boolean} saving - Whether a save operation is in progress
 * @returns {User | null} userData - Current Supabase auth user object
 * @returns {Object} profileData - User profile data (nombre_completo, foto_url)
 * @returns {Function} setProfileData - Updates profile data object
 * @returns {string | null} previewUrl - Local preview URL for selected avatar
 * @returns {Function} handleAvatarChange - Handles avatar file selection and preview
 * @returns {Function} handleSaveBasicInfo - Saves name and avatar changes to database
 * @returns {string} currentPassword - Current password input value
 * @returns {Function} setCurrentPassword - Updates current password field
 * @returns {string} newEmail - New email input value
 * @returns {Function} setNewEmail - Updates new email field
 * @returns {Function} handleUpdateEmail - Updates user email after verification
 * @returns {string} newPassword - New password input value
 * @returns {Function} setNewPassword - Updates new password field
 * @returns {string} confirmPassword - Password confirmation input value
 * @returns {Function} setConfirmPassword - Updates password confirmation field
 * @returns {Function} handleUpdatePassword - Updates user password after verification
 * @returns {Function} handleDeleteAccount - Permanently deletes user account and profile
 * @returns {string | null} role - User role ('user' or 'proveedor')
 * @returns {Function} handleBecomeProvider - Converts user role to provider
 *
 * @example
 * const {
 *   profileData,
 *   setProfileData,
 *   handleSaveBasicInfo,
 *   handleUpdatePassword,
 * } = useProfileSettings();
 */
export function useProfileSettings() {
  const supabase = createClient();
  const router = useRouter();

  // Estados de carga y datos
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [profileData, setProfileData] = useState({
    nombre_completo: '',
    foto_url: '',
  });

  // Estados para imagen
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Estados de Seguridad
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<string | null>(null);

  /**
   * Initializes the hook by loading current user data and profile information.
   * Redirects to login if user is not authenticated.
   */
  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUserData(user);

      const { data: profile } = await supabase
        .from('perfiles')
        .select('nombre_completo, foto_url, rol')
        .eq('usuario_id', user.id)
        .single();

      if (profile) {
        setProfileData({
          nombre_completo: profile.nombre_completo || '',
          foto_url: profile.foto_url || '',
        });
        setRole(profile.rol);
      }
      setLoading(false);
    };
    fetchData();
  }, [supabase, router]);

  /**
   * Upgrades user role from 'user' to 'proveedor' (provider).
   * Requires user confirmation and updates the database.
   * After successful upgrade, redirects to create first service.
   *
   * @async
   * @throws {Error} If database update fails
   */
  const handleBecomeProvider = async () => {
    const confirm = window.confirm(
      '¿Deseas convertirte en proveedor? Podrás publicar servicios. Esta acción no se puede deshacer manualmente.'
    );

    if (!confirm || !userData) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('perfiles')
        .update({ rol: 'proveedor' }) // Asegúrate que tu enum en DB acepte 'proveedor'
        .eq('usuario_id', userData.id);

      if (error) throw error;

      setRole('proveedor'); // Actualizamos el estado local
      alert('¡Felicidades! Ahora eres un proveedor.');
      // Opcional: router.refresh() o redirigir a crear servicio
      router.refresh();
      router.push('/servicios/nuevo');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      alert('Error al actualizar rol: ' + errorMessage);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Verifies user identity by re-authenticating with the current password.
   * Required before making critical changes like email or password updates.
   *
   * @async
   * @returns {Promise<boolean>} True if identity verification succeeds, false otherwise
   * @throws {Error} If authentication fails
   */
  const verifyIdentity = async () => {
    if (!currentPassword || !userData?.email) {
      alert(
        'Por favor, ingresa tu contraseña actual para confirmar los cambios de seguridad.'
      );
      return false;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password: currentPassword,
    });
    if (error) {
      alert('La contraseña actual es incorrecta.');
      return false;
    }
    return true;
  };

  /**
   * Handles avatar file selection and creates a local preview URL.
   *
   * @param {File} file - The image file selected by the user
   */
  const handleAvatarChange = (file: File) => {
    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  /**
   * Saves basic profile information (name and avatar) to the database.
   * If a new avatar is provided, uploads it to Supabase storage first.
   *
   * @async
   * @throws {Error} If upload or database update fails
   */
  const handleSaveBasicInfo = async () => {
    if (!userData) return;
    setSaving(true);
    try {
      let finalFotoUrl = profileData.foto_url;

      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${userData.id}-${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile);

        if (uploadError) throw uploadError;
        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        finalFotoUrl = data.publicUrl;
      }

      const { error } = await supabase.from('perfiles').upsert(
        {
          usuario_id: userData.id,
          nombre_completo: profileData.nombre_completo,
          foto_url: finalFotoUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'usuario_id' }
      );

      if (error) throw error;
      alert('Información básica actualizada.');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      alert('Error: ' + errorMessage);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Updates user email after identity verification.
   * Sends confirmation emails to both old and new addresses.
   *
   * @async
   * @throws {Error} If verification fails or email update fails
   */
  const handleUpdateEmail = async () => {
    const isVerified = await verifyIdentity();
    if (!isVerified) return;

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      alert(
        'Se ha enviado un correo a ambas direcciones. Debes confirmar el cambio en ambos para que sea efectivo.'
      );
      setNewEmail('');
      setCurrentPassword('');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      alert('Error: ' + errorMessage);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Updates user password after identity verification.
   * Requires new password and confirmation password to match.
   *
   * @async
   * @throws {Error} If verification fails or password update fails
   */
  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword)
      return alert('Las contraseñas no coinciden');

    const isVerified = await verifyIdentity();
    if (!isVerified) return;

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      alert('Contraseña actualizada correctamente.');
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      alert('Error: ' + errorMessage);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Permanently deletes the user account and associated profile.
   * This is irreversible and requires explicit user confirmation.
   * Uses a server API endpoint to handle cascading deletions safely.
   *
   * @async
   * @throws {Error} If deletion fails
   */
  const handleDeleteAccount = async () => {
    const confirm = window.confirm(
      '¿Estás 100% seguro? Esto borrará permanentemente tu perfil y cuenta.'
    );
    if (!confirm || !userData) return;

    setSaving(true); // Puedes usar un estado de carga
    try {
      // Llamamos a nuestra API interna en lugar de borrar directamente desde el cliente
      const response = await fetch('/api/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userData.id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al eliminar la cuenta');
      }

      // Si todo salió bien, cerramos sesión localmente y redirigimos
      await supabase.auth.signOut();
      router.push('/');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      alert('Error: ' + errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    userData,
    profileData,
    setProfileData,
    previewUrl,
    handleAvatarChange,
    handleSaveBasicInfo,
    currentPassword,
    setCurrentPassword,
    newEmail,
    setNewEmail,
    handleUpdateEmail,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    handleUpdatePassword,
    handleDeleteAccount,
    role,
    handleBecomeProvider,
  };
}
