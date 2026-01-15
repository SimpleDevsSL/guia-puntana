'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { filterLocalidades } from '@/utils/localidades';

interface LocalidadAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const LocalidadAutocomplete = ({
  value,
  onChange,
  error,
  className = '',
  placeholder = 'Ej. San Luis Capital',
  disabled = false,
}: LocalidadAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Derivar opciones filtradas sin usar efecto
  const filteredOptions = useMemo(() => filterLocalidades(value), [value]);

  // Cerrar dropdown cuando se hace clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setHighlightedIndex(-1);
    setIsOpen(true);
  };

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const inputClass = `w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 
    bg-white dark:bg-gray-950 text-gray-900 dark:text-white 
    focus:ring-2 focus:ring-orange-500 outline-none transition-all
    ${error ? 'border-red-500 ring-1 ring-red-200' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        disabled={disabled}
        className={`${inputClass} ${className}`}
        autoComplete="off"
      />

      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute top-full z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {filteredOptions.map((option, index) => (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                highlightedIndex === index
                  ? 'bg-orange-100 text-orange-900 dark:bg-orange-900/30 dark:text-orange-300'
                  : 'text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {error && <p className="mt-1 text-xs font-bold text-red-500">{error}</p>}
    </div>
  );
};
