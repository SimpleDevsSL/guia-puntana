/**
 * @file Prueba Unitaria — Utilidades de Localidades
 *
 * ¿Qué es una prueba unitaria?
 * Una prueba unitaria verifica el comportamiento de una ÚNICA función o módulo
 * de forma AISLADA, sin depender de bases de datos, APIs, ni navegadores.
 *
 * ¿Por qué estas funciones?
 * `filterLocalidades` e `isValidLocalidad` son funciones puras:
 * reciben un input → devuelven un output, sin efectos secundarios.
 * Eso las hace candidatas PERFECTAS para pruebas unitarias.
 *
 * Herramienta: Vitest (compatible con el ecosistema de Vite/Next.js)
 */

import { describe, it, expect } from 'vitest';
import {
  LOCALIDADES_SAN_LUIS,
  filterLocalidades,
  isValidLocalidad,
} from '@/utils/localidades';

// ─────────────────────────────────────────────────────────────
// 🧪 SUITE: filterLocalidades
// ─────────────────────────────────────────────────────────────
describe('filterLocalidades', () => {
  it('devuelve TODAS las localidades cuando el término de búsqueda está vacío', () => {
    // Arrange: preparamos el input
    const searchTerm = '';

    // Act: ejecutamos la función
    const result = filterLocalidades(searchTerm);

    // Assert: verificamos que el resultado sea el esperado
    expect(result).toEqual(LOCALIDADES_SAN_LUIS);
    expect(result).toHaveLength(LOCALIDADES_SAN_LUIS.length);
  });

  it('devuelve TODAS las localidades cuando el término es solo espacios', () => {
    const result = filterLocalidades('   ');

    expect(result).toEqual(LOCALIDADES_SAN_LUIS);
  });

  it('filtra correctamente al buscar "Merlo"', () => {
    const result = filterLocalidades('Merlo');

    // Solo debería devolver localidades que contengan "Merlo"
    expect(result).toContain('Merlo');
    expect(result).toHaveLength(1);
  });

  it('la búsqueda es case-insensitive (no distingue mayúsculas/minúsculas)', () => {
    const resultLower = filterLocalidades('merlo');
    const resultUpper = filterLocalidades('MERLO');
    const resultMixed = filterLocalidades('mErLo');

    // Las tres búsquedas deberían dar el mismo resultado
    expect(resultLower).toEqual(resultUpper);
    expect(resultUpper).toEqual(resultMixed);
    expect(resultLower).toContain('Merlo');
  });

  it('filtra por fragmento parcial — buscar "San" devuelve "San Luis Capital"', () => {
    const result = filterLocalidades('San');

    expect(result).toContain('San Luis Capital');
    // Puede haber más localidades con "San" en el nombre en el futuro
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it('devuelve un array vacío si no hay coincidencias', () => {
    const result = filterLocalidades('Córdoba'); // No existe en San Luis

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('buscar "la" devuelve múltiples localidades (La Punta, San Luis Capital, etc.)', () => {
    const result = filterLocalidades('la');

    // Verificamos que haya más de una coincidencia
    expect(result.length).toBeGreaterThan(1);

    // Cada resultado debe contener "la" (case-insensitive)
    result.forEach((localidad) => {
      expect(localidad.toLowerCase()).toContain('la');
    });
  });
});

// ─────────────────────────────────────────────────────────────
// 🧪 SUITE: isValidLocalidad
// ─────────────────────────────────────────────────────────────
describe('isValidLocalidad', () => {
  it('devuelve true para una localidad válida con nombre exacto', () => {
    expect(isValidLocalidad('Merlo')).toBe(true);
  });

  it('devuelve true incluso si el case no coincide exactamente', () => {
    // La función compara en lowercase internamente
    expect(isValidLocalidad('merlo')).toBe(true);
    expect(isValidLocalidad('VILLA MERCEDES')).toBe(true);
    expect(isValidLocalidad('juana koslay')).toBe(true);
  });

  it('devuelve false para una localidad que NO pertenece a San Luis', () => {
    expect(isValidLocalidad('Buenos Aires')).toBe(false);
    expect(isValidLocalidad('Córdoba')).toBe(false);
    expect(isValidLocalidad('')).toBe(false);
  });

  it('devuelve false para nombres parciales (no acepta fragmentos)', () => {
    // "Merl" NO es una localidad válida, aunque "Merlo" sí existe
    expect(isValidLocalidad('Merl')).toBe(false);
    expect(isValidLocalidad('Villa')).toBe(false);
  });

  it('valida cada localidad de la lista oficial', () => {
    // Verificamos que TODAS las localidades de la lista sean válidas
    LOCALIDADES_SAN_LUIS.forEach((localidad) => {
      expect(isValidLocalidad(localidad)).toBe(true);
    });
  });
});
