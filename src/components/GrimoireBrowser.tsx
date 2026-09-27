import React, { useState, useMemo } from 'react';
import { Spell, SpellEnergy, SpellLevel, SpellAffinity, SpellType } from '../types/papa';
import { GRIMOIRE_SPELLS } from '../data/grimoireSpells';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  PlusCircle, 
  Flame, 
  Droplets, 
  Mountain, 
  Sword, 
  TreeDeciduous, 
  CircleDot,
  Filter,
  X
} from 'lucide-react';

interface GrimoireBrowserProps {
  onSelectSpellForConsumable: (spell: Spell) => void;
}

export const GrimoireBrowser: React.FC<GrimoireBrowserProps> = ({
  onSelectSpellForConsumable
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnergy, setSelectedEnergy] = useState<SpellEnergy | 'TODAS'>('TODAS');
  const [selectedLevel, setSelectedLevel] = useState<SpellLevel | 0>(0);
  const [selectedAffinity, setSelectedAffinity] = useState<SpellAffinity | 'TODAS'>('TODAS');
  const [selectedType, setSelectedType] = useState<SpellType | 'TODOS'>('TODOS');

  const energies: SpellEnergy[] = ['Destrucción', 'Creación', 'Transformación', 'Conservación', 'Orden', 'Caos'];
  const affinities: SpellAffinity[] = ['Sin Afinidad', 'Fuego', 'Agua', 'Tierra', 'Metal', 'Madera'];
  const types: SpellType[] = ['Ataque', 'Apoyo', 'Reacción', 'Utilidad'];

  const filteredSpells = useMemo(() => {
    return GRIMOIRE_SPELLS.filter(spell => {
      if (selectedEnergy !== 'TODAS' && spell.energy !== selectedEnergy) return false;
      if (selectedLevel !== 0 && spell.level !== selectedLevel) return false;
      if (selectedAffinity !== 'TODAS' && spell.affinity !== selectedAffinity) return false;
      if (selectedType !== 'TODOS' && spell.type !== selectedType) return false;

      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesName = spell.name.toLowerCase().includes(query);
        const matchesEffect = spell.effect.toLowerCase().includes(query);
        const matchesFlavor = spell.flavor?.toLowerCase().includes(query) || false;
        if (!matchesName && !matchesEffect && !matchesFlavor) return false;
      }

      return true;
    });
  }, [searchTerm, selectedEnergy, selectedLevel, selectedAffinity, selectedType]);

  const getEnergyColor = (energy: string) => {
    switch (energy) {
      case 'Destrucción': return 'text-[#c47474] border-[#c47474]/50 bg-[#c47474]/10';
      case 'Creación': return 'text-[#88b04b] border-[#88b04b]/50 bg-[#88b04b]/10';
      case 'Transformación': return 'text-[#a284e3] border-[#a284e3]/50 bg-[#a284e3]/10';
      case 'Conservación': return 'text-[#48bfe3] border-[#48bfe3]/50 bg-[#48bfe3]/10';
      case 'Orden': return 'text-[#e5cf87] border-[#e5cf87]/50 bg-[#e5cf87]/10';
      case 'Caos': return 'text-[#de3468] border-[#de3468]/50 bg-[#de3468]/10';
      default: return 'text-[#ede8df] border-[#555] bg-[#333]';
    }
  };

  const getAffinityIcon = (affinity: string) => {
    switch (affinity) {
      case 'Fuego': return <Flame size={13} className="text-amber-400" />;
      case 'Agua': return <Droplets size={13} className="text-sky-400" />;
      case 'Tierra': return <Mountain size={13} className="text-stone-400" />;
      case 'Metal': return <Sword size={13} className="text-slate-300" />;
      case 'Madera': return <TreeDeciduous size={13} className="text-emerald-400" />;
      default: return <CircleDot size={13} className="text-[#a4a7ac]" />;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedEnergy('TODAS');
    setSelectedLevel(0);
    setSelectedAffinity('TODAS');
    setSelectedType('TODOS');
  };

  const hasActiveFilters = searchTerm !== '' || selectedEnergy !== 'TODAS' || selectedLevel !== 0 || selectedAffinity !== 'TODAS' || selectedType !== 'TODOS';

  return (
    <div className="space-y-6">
      {/* Top Banner & Info */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#25262a] via-[#1f2023] to-[#28292d] border border-[#3b3d43] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#e5cf87]">
            <BookOpen size={14} />
            <span>Grimorio del Sistema PAPA</span>
          </div>
          <h2 className="font-serif font-black text-2xl text-[#ede8df] mt-1">
            Catálogo Completo de 150 Conjuros
          </h2>
          <p className="text-xs text-[#a4a7ac] max-w-xl mt-1 leading-relaxed">
            Un consumible se construye sobre un Conjuro de personaje de Nivel I a V. Explorá las 6 Energías primigenias y convertí cualquier conjuro en poción, ungüento, talismán o bomba con un solo clic.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-xs text-[#808388] block">Conjuros listados</span>
            <span className="font-serif font-black text-xl text-[#e5cf87]">
              {filteredSpells.length} <span className="text-xs font-normal text-[#808388]">/ 150</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-[#232326] border border-[#3a3c42] space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#808388]" size={16} />
          <input
            type="text"
            placeholder="Buscar conjuro por nombre, efecto, palabras clave (ej: Fuego, Curar, estatua, daño)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1c1d1f] border border-[#3f4247] rounded-lg pl-10 pr-10 py-2.5 text-sm text-[#ede8df] placeholder-[#808388] focus:border-[#c47474] focus:ring-1 focus:ring-[#c47474] outline-none transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#808388] hover:text-[#ede8df]"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Energy Filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs text-[#808388] font-medium mr-1 flex items-center gap-1">
              <Filter size={12} /> Energía:
            </span>
            <button
              onClick={() => setSelectedEnergy('TODAS')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all border ${
                selectedEnergy === 'TODAS'
                  ? 'bg-[#e5cf87] text-[#1b1c1e] border-[#e5cf87]'
                  : 'bg-[#1c1d1f] text-[#a4a7ac] border-[#36383e] hover:border-[#555]'
              }`}
            >
              Todas
            </button>
            {energies.map(e => (
              <button
                key={e}
                onClick={() => setSelectedEnergy(e)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all border ${
                  selectedEnergy === e
                    ? `${getEnergyColor(e)} font-bold shadow-sm`
                    : 'bg-[#1c1d1f] text-[#a4a7ac] border-[#36383e] hover:border-[#555]'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Level & Type Sub-filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#313337] text-xs">
          <div className="flex flex-wrap items-center gap-4">
            {/* Level Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#808388]">Nivel:</span>
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4, 5].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl as SpellLevel | 0)}
                    className={`px-2 py-0.5 rounded text-xs font-mono font-semibold transition-colors border ${
                      selectedLevel === lvl
                        ? 'bg-[#c47474] text-white border-[#c47474]'
                        : 'bg-[#1c1d1f] text-[#808388] border-[#36383e] hover:text-[#ede8df]'
                    }`}
                  >
                    {lvl === 0 ? 'Todos' : `N${lvl}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#808388]">Tipo:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSelectedType('TODOS')}
                  className={`px-2 py-0.5 rounded text-xs transition-colors border ${
                    selectedType === 'TODOS'
                      ? 'bg-[#3b3d44] text-[#ede8df] border-[#555]'
                      : 'bg-[#1c1d1f] text-[#808388] border-[#36383e] hover:text-[#ede8df]'
                  }`}
                >
                  Todos
                </button>
                {types.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`px-2 py-0.5 rounded text-xs transition-colors border ${
                      selectedType === t
                        ? 'bg-[#3b3d44] text-[#e5cf87] border-[#e5cf87]/50 font-medium'
                        : 'bg-[#1c1d1f] text-[#808388] border-[#36383e] hover:text-[#ede8df]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Affinity Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#808388]">Afinidad:</span>
              <select
                value={selectedAffinity}
                onChange={(e) => setSelectedAffinity(e.target.value as SpellAffinity | 'TODAS')}
                className="bg-[#1c1d1f] border border-[#36383e] rounded px-2 py-0.5 text-xs text-[#ede8df] outline-none"
              >
                <option value="TODAS">Todas</option>
                {affinities.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-[#c47474] hover:underline flex items-center gap-1 font-medium"
            >
              <X size={12} /> Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Spells Grid */}
      {filteredSpells.length === 0 ? (
        <div className="text-center py-16 px-4 bg-[#212225] border border-dashed border-[#3a3c42] rounded-2xl">
          <BookOpen size={40} className="mx-auto text-[#808388] mb-3" />
          <h3 className="font-serif font-bold text-lg text-[#ede8df]">
            No se encontraron conjuros
          </h3>
          <p className="text-xs text-[#a4a7ac] max-w-sm mx-auto mt-1">
            Ningún conjuro del Grimorio coincide con los filtros aplicados. Probá modificando o limpiando la búsqueda.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 rounded-lg bg-[#323337] hover:bg-[#3c3e44] text-xs font-semibold text-[#e5cf87] border border-[#444]"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredSpells.map(spell => (
            <div
              key={spell.id}
              className="flex flex-col bg-[#242528] rounded-xl border border-[#383a40] hover:border-[#555] shadow-md transition-all p-4 space-y-3 relative group"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getEnergyColor(spell.energy)}`}>
                      {spell.energy}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#18191b] text-[#e5cf87] border border-[#e5cf87]/30">
                      Nivel {spell.level}
                    </span>
                    <span className="text-[10px] text-[#cfcfcf] flex items-center gap-1">
                      {getAffinityIcon(spell.affinity)}
                      {spell.affinity}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#ede8df] group-hover:text-[#f1dfa8] transition-colors">
                    {spell.name}
                  </h4>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-[10px] font-mono text-[#a4a7ac] block">
                    {spell.type}
                  </span>
                  <span className="text-[11px] font-mono text-[#e5cf87]">
                    {spell.costResistance} Res
                  </span>
                </div>
              </div>

              {/* Flavor quote */}
              {spell.flavor && (
                <p className="text-xs text-[#9a9da3] italic leading-relaxed">
                  "{spell.flavor}"
                </p>
              )}

              {/* Parameters (Range, Saving, Duration) */}
              {(spell.range || spell.savingThrow || spell.duration) && (
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[#a4a7ac] bg-[#1a1b1d] p-2 rounded-lg border border-[#303236]">
                  {spell.range && (
                    <div><strong className="text-[#808388]">Alcance:</strong> {spell.range}</div>
                  )}
                  {spell.savingThrow && (
                    <div><strong className="text-[#c47474]">Salvación:</strong> {spell.savingThrow}</div>
                  )}
                  {spell.duration && (
                    <div><strong className="text-[#e5cf87]">Duración:</strong> {spell.duration}</div>
                  )}
                </div>
              )}

              {/* Effect */}
              <div className="p-2.5 rounded-lg bg-[#1c1d1f] border border-[#34363c] text-xs text-[#ede8df] leading-relaxed flex-1">
                {spell.effect}
              </div>

              {/* Action Button */}
              <div className="pt-1">
                <button
                  onClick={() => onSelectSpellForConsumable(spell)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#de3468]/15 hover:bg-[#de3468] text-[#de3468] hover:text-white border border-[#de3468]/40 hover:border-[#de3468] text-xs font-semibold transition-all group-hover:shadow-md"
                >
                  <PlusCircle size={15} />
                  <span>Crear Consumible con este Conjuro</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
