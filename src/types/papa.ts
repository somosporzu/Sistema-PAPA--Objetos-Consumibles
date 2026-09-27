export type ConsumableCategory = 'Comestible' | 'Aplicable' | 'Activable';

export type SpellEnergy = 
  | 'Destrucción' 
  | 'Creación' 
  | 'Transformación' 
  | 'Conservación' 
  | 'Orden' 
  | 'Caos';

export type SpellAffinity = 
  | 'Sin Afinidad' 
  | 'Fuego' 
  | 'Agua' 
  | 'Tierra' 
  | 'Metal' 
  | 'Madera';

export type SpellType = 'Ataque' | 'Apoyo' | 'Reacción' | 'Utilidad';

export type SpellLevel = 1 | 2 | 3 | 4 | 5;

export type DistanceBand = 'Contacto' | 'Cerca' | 'Lejos' | 'Distante';

export type AttributeName = 'Cuerpo' | 'Destreza' | 'Aura';

export interface Spell {
  id: string;
  name: string;
  energy: SpellEnergy;
  affinity: SpellAffinity;
  level: SpellLevel;
  type: SpellType;
  costResistance: number;
  range?: string;
  savingThrow?: string;
  duration?: string;
  flavor?: string;
  effect: string;
}

export type DisadvantageId = 
  | 'uso_complejo'
  | 'efecto_adverso_menor'
  | 'efecto_adverso'
  | 'efecto_adverso_grave'
  | 'formula_inestable'
  | 'fragil'
  | 'adictiva';

export interface ConsumableDisadvantage {
  id: DisadvantageId;
  name: string;
  pc: number;
  description: string;
  attribute?: AttributeName;
  customDetail?: string;
}

export type PriceConditionId = 
  | 'ingredientes_raros'
  | 'ingredientes_ilegales_x2'
  | 'ingredientes_ilegales_x3'
  | 'fabricacion_peligrosa'
  | 'uso_militar_prohibido'
  | 'requiere_maestro'
  | 'produccion_abundante'
  | 'baja_estabilidad'
  | 'caduca_pronto';

export type ExpirationPeriod = 
  | '1_dia'
  | '1_semana'
  | '1_mes'
  | 'estable_anos'
  | 'estable_indefinidamente';

export interface ConsumableItem {
  id: string;
  name: string;
  narrativeForm: string; // Poción, Aceite, Ungüento, Bomba, etc.
  category: ConsumableCategory;
  level: SpellLevel;
  energy: SpellEnergy;
  affinity: SpellAffinity;
  spellType: SpellType;
  sourceSpellId?: string;
  sourceSpellName?: string;
  effect: string;
  disadvantages: ConsumableDisadvantage[];
  priceConditions: PriceConditionId[];
  expiration: ExpirationPeriod;
  isRareEffect?: boolean; // For 'estable indefinidamente' x2
  description?: string;
  flavor?: string;
  customPrice?: number; // Override if desired
  createdAt: number;
  customConcepts?: string[];
}

export interface CraftingInfo {
  timeRequired: string;
  ndCraft: number;
  baseMaterialCost: number;
  recommendedConcepts: string[];
}
