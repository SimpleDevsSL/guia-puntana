export interface Category {
  id: string;
  nombre: string;
  slug?: string;
  descripcion?: string;
}

export interface NetworkUrl {
  url: string;
}

export interface ServiceWithProfile {
  id: string;
  nombre: string;
  descripcion: string;
  localidad: string;
  direccion?: string;
  barrio?: string;
  telefono?: string;
  redes?: NetworkUrl[];
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
