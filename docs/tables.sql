-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.categorias (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text,
  es_activa boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid,
  CONSTRAINT categorias_pkey PRIMARY KEY (id),
  CONSTRAINT categorias_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT categorias_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id)
);
CREATE TABLE public.keepalive (
  id integer NOT NULL DEFAULT nextval('keepalive_id_seq'::regclass),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT keepalive_pkey PRIMARY KEY (id)
);
CREATE TABLE public.perfiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL UNIQUE,
  nombre_completo text,
  rol USER-DEFINED DEFAULT 'user'::app_role,
  es_activo boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid,
  foto_url text,
  insignias ARRAY DEFAULT '{}'::text[],
  CONSTRAINT perfiles_pkey PRIMARY KEY (id),
  CONSTRAINT perfiles_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES auth.users(id),
  CONSTRAINT perfiles_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT perfiles_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id)
);
CREATE TABLE public.resenas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  servicio_id uuid NOT NULL,
  autor_id uuid NOT NULL,
  calificacion integer CHECK (calificacion >= 1 AND calificacion <= 5),
  comentario text,
  es_activo boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid,
  CONSTRAINT resenas_pkey PRIMARY KEY (id),
  CONSTRAINT resenas_servicio_id_fkey FOREIGN KEY (servicio_id) REFERENCES public.servicios(id),
  CONSTRAINT resenas_autor_id_fkey FOREIGN KEY (autor_id) REFERENCES public.perfiles(id),
  CONSTRAINT resenas_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT resenas_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id)
);
CREATE TABLE public.servicios (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  proveedor_id uuid NOT NULL,
  categoria_id uuid NOT NULL,
  nombre text NOT NULL,
  descripcion text NOT NULL,
  telefono text,
  direccion text NOT NULL,
  estado boolean NOT NULL DEFAULT true,
  es_activo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid,
  localidad text NOT NULL,
  barrio character varying,
  CONSTRAINT servicios_pkey PRIMARY KEY (id),
  CONSTRAINT servicios_proveedor_id_fkey FOREIGN KEY (proveedor_id) REFERENCES public.perfiles(id),
  CONSTRAINT servicios_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(id),
  CONSTRAINT servicios_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT servicios_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id)
);
CREATE TABLE public.solicitudes_presupuesto (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL,
  categoria_id uuid NOT NULL,
  mensaje text,
  estado USER-DEFINED DEFAULT 'PENDIENTE'::estado_solicitud_enum,
  es_activo boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid,
  CONSTRAINT solicitudes_presupuesto_pkey PRIMARY KEY (id),
  CONSTRAINT solicitudes_presupuesto_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.perfiles(id),
  CONSTRAINT solicitudes_presupuesto_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(id),
  CONSTRAINT solicitudes_presupuesto_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT solicitudes_presupuesto_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id)
);