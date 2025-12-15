// components/profile/useProfileForm.ts
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
  profileSchema,
  serviceSchema,
  type ProfileFormData,
  type ServiceFormData,
  type Category,
} from "./form-schema";

export function useProfileForm() {
  const supabase = createClient();
  const router = useRouter();

  // Estados
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [profileData, setProfileData] = useState<ProfileFormData>({
    nombre_completo: "",
    rol: "user",
  });
  const [servicesData, setServicesData] = useState<ServiceFormData[]>([]);

  // Errores
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [serviceErrors, setServiceErrors] = useState<Record<string, string>>(
    {}
  );
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Efectos de carga inicial
  useEffect(() => {
    const init = async () => {
      // Usuario
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
      else setGeneralError("Sesión no válida.");

      // Categorías
      const { data: cats } = await supabase
        .from("categorias")
        .select("id, nombre, descripcion")
        .eq("es_activa", true)
        .order("nombre");
      if (cats) setCategories(cats);
    };
    init();
  }, []);

  // Handlers
  const handleProfileChange = (field: keyof ProfileFormData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const n = { ...prev };
        delete n[field];
        return n;
      });
    }
  };

  const addService = () => {
    setServicesData((prev) => [
      ...prev,
      {
        tempId: Date.now(),
        categoria_id: "",
        nombre: "",
        descripcion: "",
        telefono: "",
        direccion: "",
        localidad: "",
        barrio: "",
      },
    ]);
  };

  const removeService = (tempId: number) => {
    setServicesData((prev) => prev.filter((s) => s.tempId !== tempId));
  };

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
    const errKey = `${index}.${field}`;
    if (serviceErrors[errKey]) {
      setServiceErrors((prev) => {
        const n = { ...prev };
        delete n[errKey];
        return n;
      });
    }
  };

  // Submit Logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError(null);
    setValidationErrors({});
    setServiceErrors({});

    if (!userId) {
      setLoading(false);
      return setGeneralError("Usuario no identificado.");
    }

    // Validación Zod
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

    if (profileData.rol === "proveedor" && servicesData.length > 0) {
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

    // Persistencia
    try {
      const { data: profile, error: pError } = await supabase
        .from("perfiles")
        .insert({
          usuario_id: userId,
          nombre_completo: profileData.nombre_completo,
          rol: profileData.rol,
          es_activo: true,
          created_by: userId,
          updated_by: userId,
        })
        .select()
        .single();

      if (pError) throw pError;

      if (profileData.rol === "proveedor" && servicesData.length > 0) {
        const servicesPayload = servicesData.map((s) => ({
          proveedor_id: profile.id,
          categoria_id: s.categoria_id,
          nombre: s.nombre,
          descripcion: s.descripcion,
          telefono: s.telefono || null,
          direccion: s.direccion,
          localidad: s.localidad,
          barrio: s.barrio || null,
          es_activo: true,
          estado: true,
          created_by: userId,
          updated_by: userId,
        }));

        const { error: sError } = await supabase
          .from("servicios")
          .insert(servicesPayload);
        if (sError) throw sError;
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setGeneralError(err.message || "Error al guardar.");
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
    handleProfileChange,
    addService,
    removeService,
    handleServiceChange,
    handleSubmit,
  };
}
