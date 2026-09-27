import React, { useState, useEffect } from 'react';
import { ConsumableItem, Spell } from './types/papa';
import { CANONICAL_CONSUMABLES } from './data/canonicalConsumables';
import { PorzuuLogo } from './components/PorzuuLogo';
import { ConsumableBuilder } from './components/ConsumableBuilder';
import { GrimoireBrowser } from './components/GrimoireBrowser';
import { CanonicalPresetsView } from './components/CanonicalPresetsView';
import { InventoryView } from './components/InventoryView';
import { RulesReferenceModal } from './components/RulesReferenceModal';
import { 
  Wand2, 
  BookOpen, 
  Package, 
  Sparkles, 
  HelpCircle, 
  Layers, 
  PlusCircle,
  FlaskConical
} from 'lucide-react';

const STORAGE_KEY = 'papa_user_saved_consumables_v2';

export default function App() {
  const [activeTab, setActiveTab] = useState<'creador' | 'grimorio' | 'canonicos' | 'inventario'>('creador');
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ConsumableItem | null>(null);

  // User saved items
  const [savedItems, setSavedItems] = useState<ConsumableItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading saved consumables from localStorage:', e);
    }
    // Default initial seed: 3 favorite items from the book
    return CANONICAL_CONSUMABLES.slice(0, 3).map(item => ({
      ...item,
      id: 'saved-' + item.id + '-' + Math.random().toString(36).substring(2, 7)
    }));
  });

  // Save to localStorage whenever savedItems changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedItems));
    } catch (e) {
      console.error('Error saving consumables to localStorage:', e);
    }
  }, [savedItems]);

  // Handler: Save or Update consumable
  const handleSaveConsumable = (item: ConsumableItem) => {
    setSavedItems(prev => {
      const index = prev.findIndex(i => i.id === item.id);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = item;
        return copy;
      } else {
        return [item, ...prev];
      }
    });
    setEditingItem(item);
  };

  // Handler: Delete consumable
  const handleDeleteItem = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este consumible de tu inventario?')) {
      setSavedItems(prev => prev.filter(i => i.id !== id));
      if (editingItem?.id === id) {
        setEditingItem(null);
      }
    }
  };

  // Handler: Edit consumable
  const handleEditItem = (item: ConsumableItem) => {
    setEditingItem(item);
    setActiveTab('creador');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Duplicate consumable as new
  const handleDuplicateItem = (item: ConsumableItem) => {
    const duplicated: ConsumableItem = {
      ...item,
      id: 'item-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: `${item.name} (Copia)`,
      createdAt: Date.now()
    };
    setEditingItem(duplicated);
    setActiveTab('creador');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Select Spell from Grimoire
  const handleSelectSpellForConsumable = (spell: Spell) => {
    const newFromSpell: ConsumableItem = {
      id: 'spell-item-' + Date.now(),
      name: `${spell.name} Preparado`,
      narrativeForm: spell.type === 'Ataque' ? 'Vial arrojadizo' : spell.affinity === 'Tierra' ? 'Ungüento' : 'Poción',
      category: spell.type === 'Ataque' ? 'Activable' : 'Comestible',
      level: spell.level,
      energy: spell.energy,
      affinity: spell.affinity,
      spellType: spell.type,
      sourceSpellId: spell.id,
      sourceSpellName: spell.name,
      effect: spell.effect,
      disadvantages: [],
      priceConditions: [],
      expiration: 'estable_anos',
      description: spell.flavor || '',
      createdAt: Date.now()
    };
    setEditingItem(newFromSpell);
    setActiveTab('creador');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Import multiple items
  const handleImportItems = (imported: ConsumableItem[]) => {
    setSavedItems(prev => {
      const existingIds = new Set(prev.map(i => i.id));
      const valid = imported.map(item => ({
        ...item,
        id: existingIds.has(item.id) ? 'import-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6) : item.id
      }));
      return [...valid, ...prev];
    });
  };

  return (
    <div className="min-h-screen bg-[#1b1c1e] text-[#ede8df] flex flex-col selection:bg-[#c47474] selection:text-white">
      {/* Top Application Header */}
      <header className="no-print sticky top-0 z-40 bg-[#161719]/95 backdrop-blur-md border-b border-[#2d2f34] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo & Game Branding */}
          <div className="flex items-center gap-3">
            <PorzuuLogo size={38} withText subtitle="Creador Oficial de Consumibles" />
          </div>

          {/* Center Tabs for Desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-[#222326] p-1 rounded-xl border border-[#34363c]">
            <button
              onClick={() => setActiveTab('creador')}
              className={`flex items-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'creador'
                  ? 'bg-[#c47474] text-white shadow-sm font-bold'
                  : 'text-[#a4a7ac] hover:text-[#ede8df] hover:bg-[#2c2d31]'
              }`}
            >
              <FlaskConical size={14} />
              <span>Creador</span>
            </button>

            <button
              onClick={() => setActiveTab('grimorio')}
              className={`flex items-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'grimorio'
                  ? 'bg-[#c47474] text-white shadow-sm font-bold'
                  : 'text-[#a4a7ac] hover:text-[#ede8df] hover:bg-[#2c2d31]'
              }`}
            >
              <BookOpen size={14} />
              <span>Grimorio (150 Conjuros)</span>
            </button>

            <button
              onClick={() => setActiveTab('canonicos')}
              className={`flex items-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'canonicos'
                  ? 'bg-[#c47474] text-white shadow-sm font-bold'
                  : 'text-[#a4a7ac] hover:text-[#ede8df] hover:bg-[#2c2d31]'
              }`}
            >
              <Sparkles size={14} />
              <span>Ejemplos Canónicos</span>
            </button>

            <button
              onClick={() => setActiveTab('inventario')}
              className={`flex items-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'inventario'
                  ? 'bg-[#c47474] text-white shadow-sm font-bold'
                  : 'text-[#a4a7ac] hover:text-[#ede8df] hover:bg-[#2c2d31]'
              }`}
            >
              <Package size={14} />
              <span>Mi Alijo</span>
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-[#161719] text-[#e5cf87] border border-[#e5cf87]/30">
                {savedItems.length}
              </span>
            </button>
          </nav>

          {/* Right Action: Rules modal & Official Color Palette indicator */}
          <div className="flex items-center gap-3">
            <PorzuuLogo withPaletteBar />

            <button
              onClick={() => setIsRulesModalOpen(true)}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#2b2c30] hover:bg-[#383a40] text-[#e5cf87] text-xs font-serif font-bold border border-[#44474e] transition-colors"
            >
              <HelpCircle size={15} />
              <span className="hidden sm:inline">Reglas & Tablas</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden border-t border-[#292a2e] px-2 py-1.5 flex items-center justify-around bg-[#191a1d] text-xs">
          <button
            onClick={() => setActiveTab('creador')}
            className={`flex flex-col items-center py-1 px-2 rounded font-medium ${
              activeTab === 'creador' ? 'text-[#c47474] font-bold' : 'text-[#808388]'
            }`}
          >
            <FlaskConical size={16} />
            <span className="text-[10px]">Creador</span>
          </button>

          <button
            onClick={() => setActiveTab('grimorio')}
            className={`flex flex-col items-center py-1 px-2 rounded font-medium ${
              activeTab === 'grimorio' ? 'text-[#c47474] font-bold' : 'text-[#808388]'
            }`}
          >
            <BookOpen size={16} />
            <span className="text-[10px]">Grimorio</span>
          </button>

          <button
            onClick={() => setActiveTab('canonicos')}
            className={`flex flex-col items-center py-1 px-2 rounded font-medium ${
              activeTab === 'canonicos' ? 'text-[#c47474] font-bold' : 'text-[#808388]'
            }`}
          >
            <Sparkles size={16} />
            <span className="text-[10px]">Canónicos</span>
          </button>

          <button
            onClick={() => setActiveTab('inventario')}
            className={`flex flex-col items-center py-1 px-2 rounded font-medium ${
              activeTab === 'inventario' ? 'text-[#c47474] font-bold' : 'text-[#808388]'
            }`}
          >
            <Package size={16} />
            <span className="text-[10px]">Alijo ({savedItems.length})</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'creador' && (
          <ConsumableBuilder
            initialItem={editingItem}
            onSaveConsumable={handleSaveConsumable}
            onNavigateToGrimoire={() => setActiveTab('grimorio')}
          />
        )}

        {activeTab === 'grimorio' && (
          <GrimoireBrowser
            onSelectSpellForConsumable={handleSelectSpellForConsumable}
          />
        )}

        {activeTab === 'canonicos' && (
          <CanonicalPresetsView
            onLoadPresetIntoBuilder={(item) => {
              setEditingItem(item);
              setActiveTab('creador');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'inventario' && (
          <InventoryView
            items={savedItems}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onDuplicateItem={handleDuplicateItem}
            onImportItems={handleImportItems}
            onCreateNew={() => {
              setEditingItem(null);
              setActiveTab('creador');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-[#292a2e] bg-[#141517] py-6 px-4 text-xs text-[#808388]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <PorzuuLogo size={24} />
            <span>Sistema P.A.P.A. · Creador de Consumibles según la Revisión 2</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsRulesModalOpen(true)}
              className="hover:text-[#e5cf87] underline"
            >
              Compendio de Reglas
            </button>
            <span>·</span>
            <span>Energías: Destrucción, Creación, Transformación, Conservación, Orden, Caos</span>
          </div>
        </div>
      </footer>

      {/* Rules & Tables Modal */}
      <RulesReferenceModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
    </div>
  );
}
