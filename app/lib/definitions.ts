export interface Category {
  id: string;
  nombre: string;
  descripcion?: string;
}

export interface ServiceWithProfile {
  id: string;
  nombre: string;
  descripcion: string;
  localidad: string;
  barrio?: string;
  telefono?: string;
  categoria: {
    id: string;
    nombre: string;
  };
  proveedor: {
    id: string;
    nombre_completo: string;
    foto_url: string;
    insignias: string[];
  };
}
