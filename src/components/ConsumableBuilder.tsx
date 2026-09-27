import React, { useState, useEffect } from 'react';
import { 
  ConsumableCategory, 
  ConsumableItem, 
  Spell, 
  SpellEnergy, 
  SpellLevel, 
  SpellAffinity, 
  SpellType, 
  DisadvantageId, 
  AttributeName,
  PriceConditionId,
  ExpirationPeriod
} from '../types/papa';
import { GRIMOIRE_SPELLS } from '../data/grimoireSpells';
import { 
  calculateConsumablePrice, 
  getCraftingDetails, 
  CATEGORY_ACTIVATION_INFO, 
  PRICE_CONDITIONS_META, 
  EXPIRATION_META, 
  DISADVANTAGES_CATALOG,
  BACKUP_ND_BY_LEVEL
} from '../utils/consumableCalculator';
import { ConsumableCard } from './ConsumableCard';
import { 
  Wand2, 
  Sparkles, 
  Flame, 
  Droplets, 
  Mountain, 
  Sword, 
  TreeDeciduous, 
  CircleDot, 
  AlertTriangle, 
  Coins, 
  Clock, 
  CheckCircle, 
  Save, 
  RefreshCw, 
  Shuffle, 
  BookOpen, 
  ChevronRight,
  ShieldCheck,
  Info
} from 'lucide-react';

interface ConsumableBuilderProps {
  initialItem?: ConsumableItem | null;
  onSaveConsumable: (item: ConsumableItem) => void;
  onNavigateToGrimoire: () => void;
}

const NARRATIVE_FORMS = [
  'Poción',
  'Elixir',
  'Ungüento',
  'Bálsamo',
  'Aceite',
  'Bomba',
  'Vial arrojadizo',
  'Polvo arrojadizo',
  'Talismán / Sello',
  'Pergamino',
  'Hongo preparado',
  'Sal ritual',
  'Filtro alquímico',
  'Brebaje',
  'Ración especial'
];

const RANDOM_NAMES = [
  'Filtro de Ceniza Argéntea',
  'Bálsamo de la Zarzaígnea',
  'Poción de la Piel Férrea',
  'Sello del Umbral Silente',
  'Aceite de Reflejo Helado',
  'Ungüento de Sangre de Sauce',
  'Bomba de Azufre Ciego',
  'Elixir de Voluntad Inquebrantable',
  'Chispa Líquida de Vorágine',
  'Polvo de Espuela de Niebla',
  'Poción de Paso entre Sombras',
  'Tónico del Cazador Sombrío',
  'Veneno del Sueño Profundo',
  'Talismán del Último Aliento',
  'Aceite de Cuchilla Hambrienta'
];

export const ConsumableBuilder: React.FC<ConsumableBuilderProps> = ({
  initialItem,
  onSaveConsumable,
  onNavigateToGrimoire
}) => {
  // Form State
  const [name, setName] = useState(initialItem?.name || 'Tónico de Vigor');
  const [narrativeForm, setNarrativeForm] = useState(initialItem?.narrativeForm || 'Poción');
  const [category, setCategory] = useState<ConsumableCategory>(initialItem?.category || 'Comestible');
  const [level, setLevel] = useState<SpellLevel>(initialItem?.level || 1);
  const [energy, setEnergy] = useState<SpellEnergy>(initialItem?.energy || 'Conservación');
  const [affinity, setAffinity] = useState<SpellAffinity>(initialItem?.affinity || 'Sin Afinidad');
  const [spellType, setSpellType] = useState<SpellType>(initialItem?.spellType || 'Apoyo');
  const [effect, setEffect] = useState(initialItem?.effect || 'Recuperás 2+1d6 de Resistencia de inmediato al beberlo.');
  const [sourceSpellName, setSourceSpellName] = useState(initialItem?.sourceSpellName || 'Manos que Sanan (adaptado)');
  const [sourceSpellId, setSourceSpellId] = useState(initialItem?.sourceSpellId || '');
  const [description, setDescription] = useState(initialItem?.description || 'Brebaje ambarino brillante de aroma balsámico.');
  
  // Disadvantages
  const [selectedDisadvantages, setSelectedDisadvantages] = useState<{
    id: DisadvantageId;
    attribute?: AttributeName;
    customDetail?: string;
  }[]>(initialItem?.disadvantages.map(d => ({ id: d.id, attribute: d.attribute, customDetail: d.customDetail })) || []);

  // Price conditions and expiration
  const [priceConditions, setPriceConditions] = useState<PriceConditionId[]>(initialItem?.priceConditions || []);
  const [expiration, setExpiration] = useState<ExpirationPeriod>(initialItem?.expiration || 'estable_anos');
  const [isRareEffect, setIsRareEffect] = useState<boolean>(initialItem?.isRareEffect || false);
  const [customPrice, setCustomPrice] = useState<number | undefined>(initialItem?.customPrice);
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Sync if initialItem changes
  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name);
      setNarrativeForm(initialItem.narrativeForm);
      setCategory(initialItem.category);
      setLevel(initialItem.level);
      setEnergy(initialItem.energy);
      setAffinity(initialItem.affinity);
      setSpellType(initialItem.spellType);
      setEffect(initialItem.effect);
      setSourceSpellName(initialItem.sourceSpellName || '');
      setSourceSpellId(initialItem.sourceSpellId || '');
      setDescription(initialItem.description || '');
      setSelectedDisadvantages(initialItem.disadvantages.map(d => ({ id: d.id, attribute: d.attribute, customDetail: d.customDetail })));
      setPriceConditions(initialItem.priceConditions || []);
      setExpiration(initialItem.expiration || 'estable_anos');
      setIsRareEffect(initialItem.isRareEffect || false);
      setCustomPrice(initialItem.customPrice);
    }
  }, [initialItem]);

  // Handle Spell quick loader from Grimoire dropdown
  const handleSelectSpellFromDropdown = (spellId: string) => {
    const found = GRIMOIRE_SPELLS.find(s => s.id === spellId);
    if (!found) return;

    setSourceSpellId(found.id);
    setSourceSpellName(found.name);
    setLevel(found.level);
    setEnergy(found.energy);
    setAffinity(found.affinity);
    setSpellType(found.type);
    setEffect(found.effect);
    if (found.flavor && (!description || description === '')) {
      setDescription(found.flavor);
    }
    // Set appropriate category based on spell type and current narrative form
    if (found.type === 'Ataque') {
      if (category === 'Comestible') setCategory('Activable');
    }
  };

  // Toggle Disadvantage
  const handleToggleDisadvantage = (disId: DisadvantageId) => {
    const exists = selectedDisadvantages.some(d => d.id === disId);
    if (exists) {
      setSelectedDisadvantages(prev => prev.filter(d => d.id !== disId));
    } else {
      if (selectedDisadvantages.length >= 3) {
        alert('Un consumible solo puede tener como máximo 3 Desventajas.');
        return;
      }
      const meta = DISADVANTAGES_CATALOG.find(d => d.id === disId);
      setSelectedDisadvantages(prev => [
        ...prev,
        { id: disId, attribute: meta?.defaultAttribute || 'Cuerpo' }
      ]);
    }
  };

  // Update Disadvantage attribute
  const handleUpdateDisadvantageAttr = (disId: DisadvantageId, attr: AttributeName) => {
    setSelectedDisadvantages(prev => prev.map(d => d.id === disId ? { ...d, attribute: attr } : d));
  };

  // Toggle Price Condition
  const handleTogglePriceCondition = (condId: PriceConditionId) => {
    // Cannot pick both x2 and x3 for illegal ingredients
    if (condId === 'ingredientes_ilegales_x2') {
      setPriceConditions(prev => prev.filter(c => c !== 'ingredientes_ilegales_x3'));
    }
    if (condId === 'ingredientes_ilegales_x3') {
      setPriceConditions(prev => prev.filter(c => c !== 'ingredientes_ilegales_x2'));
    }

    setPriceConditions(prev => 
      prev.includes(condId) ? prev.filter(c => c !== condId) : [...prev, condId]
    );
  };

  // Random Name generator
  const handleRandomizeName = () => {
    const random = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
    setName(random);
  };

  // Reconstruct current item for preview & save
  const backupNd = BACKUP_ND_BY_LEVEL[level];

  const disadvantagesList = selectedDisadvantages.map(sd => {
    const meta = DISADVANTAGES_CATALOG.find(d => d.id === sd.id);
    let desc = meta?.descriptionTemplate || '';
    desc = desc.replace('{nd}', String(backupNd));
    if (sd.attribute) {
      desc = desc.replace('Atributo', sd.attribute);
    }
    return {
      id: sd.id,
      name: meta?.name || sd.id,
      pc: meta?.pc || 0,
      attribute: sd.attribute,
      description: desc,
      customDetail: sd.customDetail
    };
  });

  const currentPreviewItem: ConsumableItem = {
    id: initialItem?.id || 'temp-' + Date.now(),
    name: name || 'Consumible sin nombre',
    narrativeForm,
    category,
    level,
    energy,
    affinity,
    spellType,
    sourceSpellId,
    sourceSpellName,
    effect,
    disadvantages: disadvantagesList,
    priceConditions,
    expiration,
    isRareEffect,
    description,
    customPrice,
    createdAt: initialItem?.createdAt || Date.now()
  };

  const priceResult = calculateConsumablePrice(currentPreviewItem);
  const crafting = getCraftingDetails(level, category, priceResult.basePrice);
  const activationMeta = CATEGORY_ACTIVATION_INFO[category];

  // Validation questions
  const validationChecks = [
    { text: 'Categoría coherente con la forma de aplicación (' + category + ')', valid: true },
    { text: `Nivel del Conjuro (${level}) adecuado al impacto`, valid: true },
    { text: 'Activación y duración definidas claramente', valid: effect.trim().length > 10 },
    { text: 'Desventajas limitadas a máximo 3 (' + selectedDisadvantages.length + '/3)', valid: selectedDisadvantages.length <= 3 },
    { text: 'Un solo uso (se gasta al activarse)', valid: true }
  ];

  const handleSave = () => {
    onSaveConsumable(currentPreviewItem);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Creator Form Controls */}
      <div className="lg:col-span-7 space-y-6">
        {/* Step 1: Identity & Category */}
        <div className="p-5 rounded-2xl bg-[#232326] border border-[#3b3d43] shadow-md space-y-5">
          <div className="flex items-center justify-between border-b border-[#35373d] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#de3468] text-white flex items-center justify-center text-xs font-bold font-mono">
                1
              </span>
              <h3 className="font-serif font-bold text-base text-[#ede8df]">
                Identidad y Categoría Oficial
              </h3>
            </div>
            <button
              type="button"
              onClick={handleRandomizeName}
              className="text-xs text-[#e5cf87] hover:underline flex items-center gap-1 font-medium"
            >
              <Shuffle size={13} />
              Nombre al azar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name Input */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#a4a7ac] mb-1.5 uppercase tracking-wider">
                Nombre del Consumible *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej: Poción de Piedra Viva, Bomba Aturdidora..."
                className="w-full bg-[#1c1d1f] border border-[#3f4247] rounded-lg px-3.5 py-2.5 text-sm text-[#ede8df] focus:border-[#c47474] focus:ring-1 focus:ring-[#c47474] outline-none font-medium"
              />
            </div>

            {/* Narrative Form */}
            <div>
              <label className="block text-xs font-semibold text-[#a4a7ac] mb-1.5 uppercase tracking-wider">
                Forma Física / Narrativa
              </label>
              <select
                value={narrativeForm}
                onChange={(e) => setNarrativeForm(e.target.value)}
                className="w-full bg-[#1c1d1f] border border-[#3f4247] rounded-lg px-3 py-2 text-sm text-[#ede8df] focus:border-[#c47474] outline-none"
              >
                {NARRATIVE_FORMS.map(form => (
                  <option key={form} value={form}>{form}</option>
                ))}
              </select>
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#a4a7ac] mb-1.5 uppercase tracking-wider">
                Categoría Mecánica PAPA *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ConsumableCategory)}
                className="w-full bg-[#1c1d1f] border border-[#3f4247] rounded-lg px-3 py-2 text-sm text-[#e5cf87] font-semibold focus:border-[#c47474] outline-none"
              >
                <option value="Comestible">Comestible (Acción Rápida)</option>
                <option value="Aplicable">Aplicable (1 min, fuera de combate)</option>
                <option value="Activable">Activable (Acción Principal / Hostil)</option>
              </select>
            </div>
          </div>

          {/* Category Rule Note */}
          <div className="p-3 rounded-xl bg-[#1b1c1e] border border-[#33353b] text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#e5cf87] font-semibold">
              <Info size={14} />
              <span>Reglas de activación: {category}</span>
            </div>
            <p className="text-[#a4a7ac] leading-relaxed">
              <strong className="text-[#ede8df]">Activación:</strong> {activationMeta.activation}
            </p>
            <p className="text-[#a4a7ac] leading-relaxed">
              <strong className="text-[#ede8df]">Efectos recomendados:</strong> {activationMeta.appropriateEffects}
            </p>
          </div>
        </div>

        {/* Step 2: Spell Foundation (Grimorio de Conjuros) */}
        <div className="p-5 rounded-2xl bg-[#232326] border border-[#3b3d43] shadow-md space-y-5">
          <div className="flex items-center justify-between border-b border-[#35373d] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#c47474] text-white flex items-center justify-center text-xs font-bold font-mono">
                2
              </span>
              <h3 className="font-serif font-bold text-base text-[#ede8df]">
                Conjuro Base o Efecto Alquímico
              </h3>
            </div>
            <button
              type="button"
              onClick={onNavigateToGrimoire}
              className="text-xs text-[#c47474] hover:underline flex items-center gap-1 font-semibold"
            >
              <BookOpen size={13} />
              Explorar 150 Conjuros
            </button>
          </div>

          {/* Quick Grimoire Spell Preset Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-[#a4a7ac] mb-1.5 uppercase tracking-wider">
              Cargar Conjuro del Grimorio oficial:
            </label>
            <select
              value={sourceSpellId}
              onChange={(e) => handleSelectSpellFromDropdown(e.target.value)}
              className="w-full bg-[#1c1d1f] border border-[#3f4247] rounded-lg px-3 py-2 text-sm text-[#ede8df] focus:border-[#c47474] outline-none"
            >
              <option value="">-- Personalizado / Elige un conjuro de la lista --</option>
              {GRIMOIRE_SPELLS.map(s => (
                <option key={s.id} value={s.id}>
                  [{s.energy}] Nivel {s.level} · {s.name} ({s.type} · {s.affinity})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Level */}
            <div>
              <label className="block text-xs font-semibold text-[#a4a7ac] mb-1.5">
                Nivel (I - V)
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(parseInt(e.target.value) as SpellLevel)}
                className="w-full bg-[#1c1d1f] border border-[#3f4247] rounded-lg px-3 py-2 text-sm font-mono font-bold text-[#e5cf87] outline-none"
              >
                <option value={1}>Nivel I</option>
                <option value={2}>Nivel II</option>
                <option value={3}>Nivel III</option>
                <option value={4}>Nivel IV</option>
                <option value={5}>Nivel V (Legendario)</option>
              </select>
            </div>

            {/* Energy */}
            <div>
              <label className="block text-xs font-semibold text-[#a4a7ac] mb-1.5">
                Energía
              </label>
              <select
                value={energy}
                onChange={(e) => setEnergy(e.target.value as SpellEnergy)}
                className="w-full bg-[#1c1d1f] border border-[#3f4247] rounded-lg px-3 py-2 text-sm text-[#ede8df] outline-none"
              >
                <option value="Destrucción">Destrucción</option>
                <option value="Creación">Creación</option>
                <option value="Transformación">Transformación</option>
                <option value="Conservación">Conservación</option>
                <option value="Orden">Orden</option>
                <option value="Caos">Caos</option>
              </select>
            </div>

            {/* Affinity */}
            <div>
              <label className="block text-xs font-semibold text-[#a4a7ac] mb-1.5">
                Afinidad
              </label>
              <select
                value={affinity}
                onChange={(e) => setAffinity(e.target.value as SpellAffinity)}
                className="w-full bg-[#1c1d1f] border border-[#3f4247] rounded-lg px-3 py-2 text-sm text-[#ede8df] outline-none"
              >
                <option value="Sin Afinidad">Sin Afinidad</option>
                <option value="Fuego">Fuego</option>
                <option value="Agua">Agua</option>
                <option value="Tierra">Tierra</option>
                <option value="Metal">Metal</option>
                <option value="Madera">Madera</option>
              </select>
            </div>

            {/* Spell Type */}
            <div>
              <label className="block text-xs font-semibold text-[#a4a7ac] mb-1.5">
                Tipo Acción
              </label>
              <select
                value={spellType}
                onChange={(e) => setSpellType(e.target.value as SpellType)}
                className="w-full bg-[#1c1d1f] border border-[#3f4247] rounded-lg px-3 py-2 text-sm text-[#ede8df] outline-none"
              >
                <option value="Ataque">Ataque</option>
                <option value="Apoyo">Apoyo</option>
                <option value="Reacción">Reacción</option>
                <option value="Utilidad">Utilidad</option>
              </select>
            </div>
          </div>

          {/* Effect Text */}
          <div>
            <label className="block text-xs font-semibold text-[#a4a7ac] mb-1.5 uppercase tracking-wider">
              Efecto Mecánico Detallado *
            </label>
            <textarea
              rows={3}
              value={effect}
              onChange={(e) => setEffect(e.target.value)}
              placeholder="Indica el alcance, daño, curación, tirada de salvación o bonificador que produce..."
              className="w-full bg-[#1c1d1f] border border-[#3f4247] rounded-lg p-3 text-sm text-[#ede8df] focus:border-[#c47474] outline-none leading-relaxed"
            />
          </div>

          {/* Flavor/Description */}
          <div>
            <label className="block text-xs font-semibold text-[#a4a7ac] mb-1.5 uppercase tracking-wider">
              Descripción Sensorial & Apariencia
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Color, aroma, efervescencia, recipiente..."
              className="w-full bg-[#1c1d1f] border border-[#3f4247] rounded-lg px-3 py-2 text-xs text-[#ede8df] italic outline-none"
            />
          </div>
        </div>

        {/* Step 3: Consumable Disadvantages */}
        <div className="p-5 rounded-2xl bg-[#232326] border border-[#3b3d43] shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-[#35373d] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#e5cf87] text-[#1b1c1e] flex items-center justify-center text-xs font-bold font-mono">
                3
              </span>
              <h3 className="font-serif font-bold text-base text-[#ede8df]">
                Desventajas de Consumible (Máx. 3)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#e5cf87]">
              {selectedDisadvantages.length}/3 seleccionadas
            </span>
          </div>

          <p className="text-xs text-[#a4a7ac] leading-relaxed">
            Las desventajas añaden riesgos mecánicos o efectos colaterales (ND de respaldo para Nivel {level}: <strong className="text-[#ede8df]">ND {backupNd}</strong>).
          </p>

          <div className="space-y-2.5">
            {DISADVANTAGES_CATALOG.map(dis => {
              if (dis.onlyFor && dis.onlyFor !== category) return null;

              const isChecked = selectedDisadvantages.some(d => d.id === dis.id);
              const selectedItem = selectedDisadvantages.find(d => d.id === dis.id);

              return (
                <div
                  key={dis.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isChecked
                      ? 'bg-[#2f1f22] border-[#c47474]/60'
                      : 'bg-[#1c1d1f] border-[#36383e] hover:border-[#4c4f57]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <label className="flex items-start gap-2.5 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleDisadvantage(dis.id)}
                        className="mt-0.5 accent-[#c47474] w-4 h-4 rounded cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${isChecked ? 'text-[#f1a2a2]' : 'text-[#ede8df]'}`}>
                            {dis.name}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#161719] text-[#e5cf87] border border-[#e5cf87]/30">
                            {dis.pc} PC
                          </span>
                        </div>
                        <p className="text-xs text-[#a4a7ac] mt-1 leading-relaxed">
                          {dis.descriptionTemplate.replace('{nd}', String(backupNd))}
                        </p>
                      </div>
                    </label>

                    {/* If selected and requires attribute choice */}
                    {isChecked && dis.defaultAttribute && (
                      <div className="shrink-0 flex items-center gap-1 text-xs">
                        <span className="text-[#808388]">Atributo:</span>
                        <select
                          value={selectedItem?.attribute || dis.defaultAttribute}
                          onChange={(e) => handleUpdateDisadvantageAttr(dis.id, e.target.value as AttributeName)}
                          className="bg-[#242528] border border-[#555] rounded px-2 py-1 text-xs text-[#ede8df] outline-none"
                        >
                          <option value="Cuerpo">Cuerpo</option>
                          <option value="Destreza">Destreza</option>
                          <option value="Aura">Aura</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 4: Price Conditions, Expiration & Calculation */}
        <div className="p-5 rounded-2xl bg-[#232326] border border-[#3b3d43] shadow-md space-y-5">
          <div className="flex items-center gap-2 border-b border-[#35373d] pb-3">
            <span className="w-6 h-6 rounded-full bg-[#808388] text-white flex items-center justify-center text-xs font-bold font-mono">
              4
            </span>
            <h3 className="font-serif font-bold text-base text-[#ede8df]">
              Economía, Caducidad y Costes en Lectos (L)
            </h3>
          </div>

          {/* Conditions Grid */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#a4a7ac] uppercase tracking-wider">
              Condiciones de Precio Alquímico:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {(Object.keys(PRICE_CONDITIONS_META) as PriceConditionId[]).map(condId => {
                const meta = PRICE_CONDITIONS_META[condId];
                const isChecked = priceConditions.includes(condId);

                return (
                  <label
                    key={condId}
                    className={`flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-[#31291d] border-[#e5cf87]/60 text-[#f1dfa8]'
                        : 'bg-[#1c1d1f] border-[#36383e] text-[#a4a7ac] hover:text-[#ede8df]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleTogglePriceCondition(condId)}
                      className="mt-0.5 accent-[#e5cf87]"
                    />
                    <div className="flex-1">
                      <span className="font-medium block">{meta.label}</span>
                      <span className="text-[10px] text-[#808388]">{meta.description}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Expiration Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#313337]">
            <div>
              <label className="block text-xs font-semibold text-[#a4a7ac] mb-1.5 uppercase tracking-wider">
                Caducidad del Consumible
              </label>
              <select
                value={expiration}
                onChange={(e) => setExpiration(e.target.value as ExpirationPeriod)}
                className="w-full bg-[#1c1d1f] border border-[#3f4247] rounded-lg px-3 py-2 text-xs text-[#ede8df] outline-none"
              >
                {(Object.keys(EXPIRATION_META) as ExpirationPeriod[]).map(expId => (
                  <option key={expId} value={expId}>
                    {EXPIRATION_META[expId].label} ({EXPIRATION_META[expId].note})
                  </option>
                ))}
              </select>
            </div>

            {expiration === 'estable_indefinidamente' && (
              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="rareEffectCheck"
                  checked={isRareEffect}
                  onChange={(e) => setIsRareEffect(e.target.checked)}
                  className="accent-[#e5cf87] w-4 h-4"
                />
                <label htmlFor="rareEffectCheck" className="text-xs text-[#ede8df] cursor-pointer">
                  ¿Es efecto raro o exótico? (×2 precio)
                </label>
              </div>
            )}
          </div>

          {/* Price Calculation Breakdown Display */}
          <div className="p-4 rounded-xl bg-[#1a1b1d] border border-[#36383e] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#a4a7ac] flex items-center gap-1.5">
                <Coins size={14} className="text-[#e5cf87]" />
                Precio Final en Lectos:
              </span>
              <div className="text-right">
                <span className="font-serif font-black text-2xl text-[#e5cf87]">
                  {priceResult.finalPrice !== null ? `${priceResult.finalPrice} L` : 'Sin precio común'}
                </span>
              </div>
            </div>

            <div className="text-xs text-[#a4a7ac] space-y-1 bg-[#141517] p-2.5 rounded-lg border border-[#2b2d31]">
              <span className="text-[10px] text-[#808388] font-mono uppercase block">Pasos de cálculo:</span>
              {priceResult.steps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-1 font-mono text-[11px] text-[#cfcfcf]">
                  <ChevronRight size={11} className="text-[#e5cf87]" />
                  <span>{step}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-[#2d2f34] flex justify-between text-xs text-[#e5cf87]">
                <span>Coste de materiales de fabricación (50% base):</span>
                <span className="font-mono font-bold">
                  {priceResult.materialsCost !== null ? `${priceResult.materialsCost} L` : 'Variable'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Save & Action Bar */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#c47474] hover:bg-[#d68585] text-white font-serif font-bold text-sm tracking-wide shadow-lg transition-all active:scale-98"
          >
            <Save size={18} />
            <span>Guardar en mi Inventario</span>
          </button>

          {savedFeedback && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 animate-in fade-in">
              <CheckCircle size={15} /> ¡Guardado con éxito!
            </span>
          )}
        </div>
      </div>

      {/* Right Column: Live Card Preview & Quality Checklist */}
      <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-serif font-bold text-[#e5cf87] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} />
              Vista Previa en Vivo (Carta de Juego)
            </span>
            <span className="text-[10px] text-[#808388]">Descargable en PNG y TXT</span>
          </div>

          <ConsumableCard item={currentPreviewItem} />
        </div>

        {/* Quality Control Checklist from Section 2 */}
        <div className="p-4 rounded-xl bg-[#232326] border border-[#3b3d42] space-y-3">
          <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#ede8df] uppercase tracking-wider">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>Preguntas de Control & Balance</span>
          </div>

          <p className="text-[11px] text-[#a4a7ac] leading-relaxed">
            Criterios de diseño oficial del Sistema P.A.P.A. para asegurar que el objeto sea balanceado y no reemplace una senda o herencia.
          </p>

          <div className="space-y-1.5">
            {validationChecks.map((chk, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                {chk.valid ? (
                  <CheckCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle size={14} className="text-[#c47474] shrink-0 mt-0.5" />
                )}
                <span className={chk.valid ? 'text-[#cfcfcf]' : 'text-[#f1a2a2]'}>
                  {chk.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Crafting Summary */}
        <div className="p-4 rounded-xl bg-[#1d1e21] border border-[#35373d] space-y-2 text-xs">
          <div className="flex items-center justify-between font-serif font-bold text-[#e5cf87]">
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              Requisitos de Fabricación
            </span>
            <span className="font-mono">ND {crafting.ndCraft}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-[#a4a7ac] pt-1">
            <div>
              <span className="text-[#808388] block">Tiempo mínimo:</span>
              <strong className="text-[#ede8df]">{crafting.timeRequired}</strong>
            </div>
            <div>
              <span className="text-[#808388] block">Coste materiales:</span>
              <strong className="text-[#ede8df]">
                {crafting.baseMaterialCost > 0 ? `${crafting.baseMaterialCost} L` : 'Aventura'}
              </strong>
            </div>
          </div>

          <div className="text-[11px] text-[#a4a7ac] pt-1 border-t border-[#2e3035]">
            <span className="text-[#808388] block mb-1">Conceptos idóneos:</span>
            <div className="flex flex-wrap gap-1">
              {crafting.recommendedConcepts.map(c => (
                <span key={c} className="px-1.5 py-0.5 rounded bg-[#28292d] text-[#cfcfcf] text-[10px] border border-[#3e4147]">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
