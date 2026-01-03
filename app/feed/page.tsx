'use client';

import React, { useState, useEffect, useCallback } from 'react';
import HeroSection from '../../components/feed/HeroSection';
import CategoryList from '../../components/feed/CategoryList';
import ResultsGrid from '../../components/feed/ResultsGrid';
import { Header } from '../../components/feed/Header';
import { Professional, Category } from '../lib/definitions';
import { exampleProfessionals } from './testing';
/**
 * Página Feed
 * Ruta: /feed
 * Muestra el formulario para crear el perfil inicial del usuario.
 */

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>(Category.GASISTA);
  const [searchQuery, setSearchQuery] = useState<string>('Instalación y revisión de estufas');
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showConnectModal, setShowConnectModal] = useState<Professional | null>(null);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setProfessionals([]); 
    // Simulate slight network delay for better UX feel
    // await new Promise(r => setTimeout(r, 800)); 
    
    const results = exampleProfessionals.filter(prof =>
      prof.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
      prof.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setProfessionals(results);
    setLoading(false);
  }, [activeCategory, searchQuery]);

  // Initial load
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Auto-search when category changes
  useEffect(() => {
    handleSearch();
  }, [activeCategory, handleSearch]);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
      <main className="fgrow pt-16">

        <Header />

        <HeroSection 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
        />
        
        <CategoryList 
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        <ResultsGrid 
          loading={loading}
          professionals={professionals}
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          onConnect={setShowConnectModal}
          onRetry={handleSearch}
        />
      </main>

      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-brand-orange h-8 w-8 rounded flex items-center justify-center">
               <span className="text-white font-serif text-lg leading-none">V</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Guía Puntana</span>
          </div>
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} Guía Puntana. Conectando San Luis.
          </p>
        </div>
      </footer>

      {showConnectModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-2 text-brand-dark">Contactar a {showConnectModal.name}</h3>
            <p className="text-gray-600 mb-6">
              Estás a punto de solicitar un servicio de <span className="font-semibold text-brand-orange">{showConnectModal.category}</span>.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Tarifa estimada</span>
                  <span className="font-bold text-gray-900">${showConnectModal.hourlyRate}/hora</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ubicación</span>
                  <span className="text-gray-900 font-medium">A {showConnectModal.distanceKm.toFixed(1)} km</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowConnectModal(null)}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  alert("¡Solicitud enviada con éxito! El profesional te contactará pronto.");
                  setShowConnectModal(null);
                }}
                className="flex-1 py-3 bg-brand-orange hover:bg-orange-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-orange-500/20"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;