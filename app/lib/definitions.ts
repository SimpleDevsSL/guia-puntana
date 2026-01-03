export interface Review {
  author: string;
  rating: number;
  comment: string;
}

export interface Professional {
  id: string;
  name: string;
  category: string;
  specialization: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  distanceKm: number;
  isVerified: boolean;
  description: string;
  imageUrl: string;
  badges: string[];
}

export enum Category {
  PLOMERIA = 'Plomería',
  GASISTA = 'Gasista',
  ELECTRICIDAD = 'Electricidad',
  PINTURA = 'Pintura',
  CARPINTERIA = 'Carpintería',
  LIMPIEZA = 'Limpieza',
}