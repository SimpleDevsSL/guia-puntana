// Localidades principales de San Luis
export const LOCALIDADES_SAN_LUIS = [
  'San Luis Capital',
  'Juana Koslay',
  'La Punta',
  'Potrero de los Funes',
  'Merlo',
  'Villa Mercedes',
  'Justo Daract',
  'Tilisarao',
  'Concaran',
];

/**
 * Filtra localidades de San Luis según el término de búsqueda
 */
export const filterLocalidades = (searchTerm: string): string[] => {
  if (!searchTerm.trim()) {
    return LOCALIDADES_SAN_LUIS;
  }

  const term = searchTerm.toLowerCase();
  return LOCALIDADES_SAN_LUIS.filter((localidad) =>
    localidad.toLowerCase().includes(term)
  );
};

/**
 * Obtiene localidades de San Luis (actualmente usa lista estática)
 * Puede ser reemplazado por una API externa como Nominatim
 */
export const getLocalidades = async (): Promise<string[]> => {
  // Implementación actual con lista estática
  // En el futuro, puede ser reemplazado por:
  // const response = await fetch('https://nominatim.openstreetmap.org/search?...');
  return LOCALIDADES_SAN_LUIS;
};

/**
 * Valida si una localidad es válida
 */
export const isValidLocalidad = (localidad: string): boolean => {
  return LOCALIDADES_SAN_LUIS.some(
    (loc) => loc.toLowerCase() === localidad.toLowerCase()
  );
};
