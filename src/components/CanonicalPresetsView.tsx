import React, { useState, useMemo } from 'react';
import { ConsumableCategory, ConsumableItem } from '../types/papa';
import { CANONICAL_CONSUMABLES } from '../data/canonicalConsumables';
import { ConsumableCard } from './ConsumableCard';
import { Search, Sparkles, Filter, X, ArrowUpRight } from 'lucide-react';

interface CanonicalPresetsViewProps {
  onLoadPresetIntoBuilder: (item: ConsumableItem) => void;
}

export const CanonicalPresetsView: React.FC<CanonicalPresetsViewProps> = ({
  onLoadPresetIntoBuilder
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ConsumableCategory | 'TODAS'>('TODAS');

  const filteredItems = useMemo(() => {
    return CANONICAL_CONSUMABLES.filter(item => {
      if (categoryFilter !== 'TODAS' && item.category !== categoryFilter) return false;
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesEffect = item.effect.toLowerCase().includes(q);
        const matchesForm = item.narrativeForm.toLowerCase().includes(q);
        if (!matchesName && !matchesEffect && !matchesForm) return false;
      }
      return true;
    });
  }, [searchTerm, categoryFilter]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#242529] via-[#1d1e21] to-[#28292d] border border-[#3c3e44] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#e5cf87]">
            <Sparkles size={14} />
            <span>Colección Oficial</span>
          </div>
          <h2 className="font-serif font-black text-2xl text-[#ede8df] mt-1">
            Consumibles Canónicos del Manual
          </h2>
          <p className="text-xs text-[#a4a7ac] max-w-xl mt-1 leading-relaxed">
            Objetos consumibles de referencia documentados en la <em>Revisión 2 de Creación de Consumibles</em> y la <em>Tabla 12 de Consumibles Básicos</em> del Sistema P.A.P.A. Podés probar sus tiradas o cargarlos en el Creador para personalizarlos.
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs text-[#808388] block">Consumibles oficiales</span>
          <span className="font-serif font-black text-xl text-[#e5cf87]">
            {filteredItems.length} <span className="text-xs font-normal text-[#808388]">/ {CANONICAL_CONSUMABLES.length}</span>
          </span>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="p-4 rounded-xl bg-[#232326] border border-[#393b41] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#808388]" size={16} />
          <input
            type="text"
            placeholder="Buscar por nombre o efecto (ej: Vigor, Fuego, Resistencia, Fatiga)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1c1d1f] border border-[#3f4247] rounded-lg pl-10 pr-10 py-2 text-xs text-[#ede8df] placeholder-[#808388] focus:border-[#c47474] outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#808388] hover:text-[#ede8df]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <span className="text-xs text-[#808388] font-medium mr-1 flex items-center gap-1">
            <Filter size={12} /> Categoría:
          </span>
          {(['TODAS', 'Comestible', 'Aplicable', 'Activable'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all border ${
                categoryFilter === cat
                  ? 'bg-[#c47474] text-white border-[#c47474]'
                  : 'bg-[#1c1d1f] text-[#a4a7ac] border-[#36383e] hover:border-[#555]'
              }`}
            >
              {cat === 'TODAS' ? 'Todas' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredItems.map(item => (
          <div key={item.id} className="relative flex flex-col">
            <ConsumableCard
              item={item}
              onDuplicate={() => onLoadPresetIntoBuilder(item)}
            />
            <div className="mt-2 text-right">
              <button
                onClick={() => onLoadPresetIntoBuilder(item)}
                className="inline-flex items-center gap-1 text-xs text-[#e5cf87] hover:underline font-semibold"
              >
                <span>Cargar en Creador como plantilla</span>
                <ArrowUpRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
