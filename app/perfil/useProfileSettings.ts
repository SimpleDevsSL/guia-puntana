import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

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
        .select('nombre_completo, foto_url')
        .eq('usuario_id', user.id)
        .single();

      if (profile) {
        setProfileData({
          nombre_completo: profile.nombre_completo || '',
          foto_url: profile.foto_url || '',
        });
      }
      setLoading(false);
    };
    fetchData();
  }, [supabase, router]);

  // Función para verificar identidad antes de cambios críticos
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

  const handleAvatarChange = (file: File) => {
    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

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
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

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
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

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
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

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
    } catch (error: any) {
      alert('Error: ' + error.message);
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
  };
}
