import { 
  ConsumableCategory, 
  ConsumableItem, 
  CraftingInfo, 
  DisadvantageId, 
  ExpirationPeriod, 
  PriceConditionId, 
  SpellLevel 
} from '../types/papa';

export const BASE_PRICES: Record<SpellLevel, number | null> = {
  1: 25,
  2: 75,
  3: 200,
  4: 500,
  5: null // Sin precio común
};

export const BACKUP_ND_BY_LEVEL: Record<SpellLevel, number> = {
  1: 9,
  2: 10,
  3: 11,
  4: 12,
  5: 13
};

export const CRAFTING_BY_LEVEL: Record<SpellLevel, { time: string; nd: number }> = {
  1: { time: '1 hora', nd: 9 },
  2: { time: '4 horas', nd: 12 },
  3: { time: '1 jornada', nd: 15 },
  4: { time: '3 jornadas', nd: 18 },
  5: { time: 'Variable (requiere aventura / condición especial)', nd: 21 }
};

export const CATEGORY_CONCEPTS: Record<ConsumableCategory, string[]> = {
  Comestible: ['Boticario', 'Alquimista', 'Curandero', 'Naturalista'],
  Aplicable: ['Boticario', 'Curandero', 'Naturalista', 'Alquimista', 'Herrero', 'Artesano', 'Cazador', 'Ladrón'],
  Activable: ['Hechicero', 'Espiritista', 'Acólito', 'Erudito', 'Lingüista', 'Artesano', 'Alquimista', 'Ingeniero', 'Ladrón']
};

export const CATEGORY_ACTIVATION_INFO: Record<ConsumableCategory, {
  activation: string;
  usage: string;
  checkRequirement: string;
  appropriateEffects: string;
}> = {
  Comestible: {
    activation: 'Acción Rápida (Acción Principal si se administra a alguien inconsciente)',
    usage: 'Se bebe, come o ingiere. Afecta a quien lo consume: usuario, aliado voluntario o ingesta inadvertida. Administrar por la fuerza exige Derribar o Apresar.',
    checkRequirement: 'No requiere tirada para consumir, salvo si posee la Desventaja Uso Complejo o Efecto Adverso.',
    appropriateEffects: 'Curación, vigor, atributos, resistencia física, transformación breve, respiración, recuperación interna, regeneración.'
  },
  Aplicable: {
    activation: '1 minuto, siempre fuera de combate',
    usage: 'Se aplica sobre piel, heridas, arma, armadura, comida o superficie. No puede usarse en combate activo. El efecto dura toda la Duración del conjuro; en armas o aceites se consume en el primer impacto exitoso.',
    checkRequirement: 'No requiere tirada para aplicar, salvo si posee la Desventaja Uso Complejo o Efecto Adverso.',
    appropriateEffects: 'Curación externa, protección ambiental, sentidos, piel, movilidad, resistencia a venenos o heridas, mejoras temporales de armas/armaduras, daño persistente, debilitamiento.'
  },
  Activable: {
    activation: 'Acción Principal (salvo que el conjuro contenido indique Rápida o Reacción)',
    usage: 'Se gasta la acción para activarlo (lanzar bomba, romper sello, quemar pergamino). Si tiene objetivo hostil, exige tirada de ataque a distancia.',
    checkRequirement: 'La que exija el conjuro contenido: tirada de ataque a distancia si es hostil, o Salvación del objetivo si el conjuro la exige.',
    appropriateEffects: 'Efectos complejos, sellos, movimiento especial, áreas, invocaciones, barreras, protección de emergencia, activación automática, daño de área, humo, luz, ruido, terreno, distracción.'
  }
};

export const PRICE_CONDITIONS_META: Record<PriceConditionId, {
  label: string;
  description: string;
  multiplier: number;
  divisor?: number;
}> = {
  ingredientes_raros: { label: 'Ingredientes raros', description: '×2 precio (flora mística, savias escasas)', multiplier: 2 },
  ingredientes_ilegales_x2: { label: 'Ingredientes ilegales (moderado)', description: '×2 precio (mercado negro común)', multiplier: 2 },
  ingredientes_ilegales_x3: { label: 'Ingredientes ilegales (prohibido)', description: '×3 precio (penas capitales / contrabando duro)', multiplier: 3 },
  fabricacion_peligrosa: { label: 'Fabricación peligrosa', description: '×2 precio (gases volátiles, reactivos tóxicos)', multiplier: 2 },
  uso_militar_prohibido: { label: 'Uso militar o prohibido', description: '×3 precio (monopolio de castas de guerra)', multiplier: 3 },
  requiere_maestro: { label: 'Requiere maestro especialista', description: '×2 precio (conocimiento hermético)', multiplier: 2 },
  produccion_abundante: { label: 'Producción local abundante', description: '÷2 precio (región con excedente natural)', multiplier: 0.5, divisor: 2 },
  baja_estabilidad: { label: 'Baja estabilidad o riesgo de fallo', description: '÷2 precio (preparado tosco o precipitado)', multiplier: 0.5, divisor: 2 },
  caduca_pronto: { label: 'Caduca pronto', description: '÷2 precio (preparado fresco de corta vida)', multiplier: 0.5, divisor: 2 },
};

export const EXPIRATION_META: Record<ExpirationPeriod, {
  label: string;
  multiplier: number;
  divisor?: number;
  note: string;
}> = {
  '1_dia': { label: 'Caduca en 1 día', multiplier: 1 / 3, divisor: 3, note: '÷3 precio' },
  '1_semana': { label: 'Caduca en 1 semana', multiplier: 0.5, divisor: 2, note: '÷2 precio' },
  '1_mes': { label: 'Caduca en 1 mes', multiplier: 0.75, note: '-25% precio' },
  'estable_anos': { label: 'Estable por años', multiplier: 1, note: 'Sin ajuste' },
  'estable_indefinidamente': { label: 'Estable indefinidamente', multiplier: 1, note: '×2 si el efecto es raro' },
};

export const DISADVANTAGES_CATALOG: {
  id: DisadvantageId;
  name: string;
  pc: number;
  onlyFor?: ConsumableCategory;
  defaultAttribute?: 'Cuerpo' | 'Destreza' | 'Aura';
  descriptionTemplate: string;
}[] = [
  {
    id: 'uso_complejo',
    name: 'Uso complejo',
    pc: 3,
    defaultAttribute: 'Destreza',
    descriptionTemplate: 'Activarlo exige una tirada de Atributo contra el ND de Salvación del conjuro ({nd}). Si falla, el consumible se gasta igual pero no produce efecto.'
  },
  {
    id: 'efecto_adverso_menor',
    name: 'Efecto Adverso menor',
    pc: 2,
    defaultAttribute: 'Cuerpo',
    descriptionTemplate: 'Al usarlo, Salvación contra ND 10 o sufre un efecto negativo menor (-1 a la próxima tirada o Desventaja puntual).'
  },
  {
    id: 'efecto_adverso',
    name: 'Efecto Adverso',
    pc: 4,
    defaultAttribute: 'Cuerpo',
    descriptionTemplate: 'Al usarlo, Salvación contra el ND de Salvación del conjuro ({nd}) o sufre un estado alterado menor/medio definido, o 1d6 de daño.'
  },
  {
    id: 'efecto_adverso_grave',
    name: 'Efecto Adverso grave',
    pc: 6,
    defaultAttribute: 'Cuerpo',
    descriptionTemplate: 'Al usarlo, Salvación contra el ND de Salvación del conjuro ({nd}) o el fallo causa un estado mayor definido o 2d6 de daño.'
  },
  {
    id: 'formula_inestable',
    name: 'Fórmula inestable',
    pc: 2,
    descriptionTemplate: 'Al usarlo, tirá 1d6. Con 1, falla y se destruye sin efecto. Con 2-6, funciona correctamente.'
  },
  {
    id: 'fragil',
    name: 'Frágil',
    pc: 2,
    defaultAttribute: 'Destreza',
    descriptionTemplate: 'Si el consumible recibe daño, se moja, se golpea con fuerza o pasa por condición adversa, el portador debe superar Salvación de Cuerpo o Destreza ND 10 o el consumible se arruina sin efecto.'
  },
  {
    id: 'adictiva',
    name: 'Adictiva (solo Comestibles)',
    pc: 4,
    onlyFor: 'Comestible',
    descriptionTemplate: 'Al consumirlo, tirá 2d6. Si el resultado es 2, el personaje queda Adicto a ese consumible específico. Mientras esté Adicto: si completa un Descanso Largo sin haber consumido al menos una dosis desde el anterior, no recupera Fatiga y gana 1d6/2 niveles de Fatiga consecutivos.'
  }
];

export function calculateConsumablePrice(item: Partial<ConsumableItem>): {
  basePrice: number | null;
  finalPrice: number | null;
  materialsCost: number | null;
  steps: string[];
} {
  const level = item.level || 1;
  const basePrice = BASE_PRICES[level];
  const steps: string[] = [];

  if (item.customPrice !== undefined && item.customPrice !== null) {
    return {
      basePrice: item.customPrice,
      finalPrice: item.customPrice,
      materialsCost: Math.floor(item.customPrice / 2),
      steps: ['Precio personalizado manual: ' + item.customPrice + ' L']
    };
  }

  if (level === 5 || basePrice === null) {
    return {
      basePrice: null,
      finalPrice: null,
      materialsCost: null,
      steps: ['Nivel V: Sin precio común (Objeto legendario / único, requiere aventura o trueque narrativo)']
    };
  }

  steps.push(`Precio base Nivel ${level}: ${basePrice} L`);
  let calculated = basePrice;

  // Process condition multipliers
  if (item.priceConditions && item.priceConditions.length > 0) {
    for (const condId of item.priceConditions) {
      const cond = PRICE_CONDITIONS_META[condId];
      if (cond) {
        if (cond.divisor) {
          calculated = Math.floor(calculated / cond.divisor);
          steps.push(`${cond.label}: ÷${cond.divisor} → ${calculated} L`);
        } else {
          calculated = Math.floor(calculated * cond.multiplier);
          steps.push(`${cond.label}: ×${cond.multiplier} → ${calculated} L`);
        }
      }
    }
  }

  // Process expiration
  if (item.expiration) {
    const exp = EXPIRATION_META[item.expiration];
    if (exp) {
      if (item.expiration === 'estable_indefinidamente' && item.isRareEffect) {
        calculated = Math.floor(calculated * 2);
        steps.push(`Estable indefinidamente con efecto raro: ×2 → ${calculated} L`);
      } else if (exp.divisor) {
        calculated = Math.floor(calculated / exp.divisor);
        steps.push(`${exp.label}: ÷${exp.divisor} → ${calculated} L`);
      } else if (exp.multiplier !== 1) {
        calculated = Math.floor(calculated * exp.multiplier);
        steps.push(`${exp.label}: ×${exp.multiplier} → ${calculated} L`);
      }
    }
  }

  const finalPrice = Math.max(1, calculated);
  // Materials cost is always 50% of the base price according to section 6
  const materialsCost = Math.max(1, Math.floor(basePrice / 2));

  return {
    basePrice,
    finalPrice,
    materialsCost,
    steps
  };
}

export function getCraftingDetails(level: SpellLevel, category: ConsumableCategory, basePrice: number | null): CraftingInfo {
  const info = CRAFTING_BY_LEVEL[level];
  const recommendedConcepts = CATEGORY_CONCEPTS[category];
  const baseMaterialCost = basePrice ? Math.max(1, Math.floor(basePrice / 2)) : 0;

  return {
    timeRequired: info.time,
    ndCraft: info.nd,
    baseMaterialCost,
    recommendedConcepts
  };
}

export function formatConsumableMarkdown(item: ConsumableItem): string {
  const priceInfo = calculateConsumablePrice(item);
  const priceStr = priceInfo.finalPrice !== null ? `${priceInfo.finalPrice} L` : 'Sin precio común';
  const materialsStr = priceInfo.materialsCost !== null ? `${priceInfo.materialsCost} L` : 'Incalculable / Aventura';
  const crafting = getCraftingDetails(item.level, item.category, priceInfo.basePrice);

  const lines = [
    `# ${item.name}`,
    `**Forma:** ${item.narrativeForm}`,
    `**Categoría:** ${item.category}`,
    `**Nivel del Conjuro:** Nivel ${item.level}`,
    `**Energía:** ${item.energy} | **Afinidad:** ${item.affinity}`,
    `**Tipo de Conjuro:** ${item.spellType}`,
    `**Precio:** ${priceStr} (Coste de materiales: ${materialsStr})`,
    '',
    `### Efecto`,
    `${item.effect}`,
    ''
  ];

  if (item.disadvantages && item.disadvantages.length > 0) {
    lines.push('### Desventajas');
    item.disadvantages.forEach(d => {
      lines.push(`- **${d.name} (${d.pc} PC):** ${d.description}`);
    });
    lines.push('');
  }

  lines.push('### Fabricación');
  lines.push(`- **Tiempo mínimo:** ${crafting.timeRequired}`);
  lines.push(`- **ND de fabricación:** ${crafting.ndCraft}`);
  lines.push(`- **Conceptos recomendados:** ${crafting.recommendedConcepts.join(', ')}`);
  lines.push('');

  if (item.description) {
    lines.push('### Descripción & Apariencia');
    lines.push(item.description);
    lines.push('');
  }

  lines.push('---');
  lines.push('*Sistema P.A.P.A. — Consumible oficial*');

  return lines.join('\n');
}

export function formatConsumablePlainText(item: ConsumableItem): string {
  const priceInfo = calculateConsumablePrice(item);
  const priceStr = priceInfo.finalPrice !== null ? `${priceInfo.finalPrice} L` : 'Sin precio común';
  const materialsStr = priceInfo.materialsCost !== null ? `${priceInfo.materialsCost} L` : 'Incalculable / Aventura';
  const crafting = getCraftingDetails(item.level, item.category, priceInfo.basePrice);

  const disadvantagesStr = item.disadvantages && item.disadvantages.length > 0
    ? item.disadvantages.map(d => `${d.name} (${d.pc} PC): ${d.description}`).join('; ')
    : 'Ninguna';

  return `====================================================
SISTEMA P.A.P.A. — PLANTILLA OFICIAL DE CONSUMIBLE
Revisión 2 de Creación de Consumibles
====================================================

Nombre: ${item.name}
Forma narrativa: ${item.narrativeForm}
Categoría: ${item.category}
Nivel del Conjuro: Nivel ${item.level}
Energía: ${item.energy}
Afinidad: ${item.affinity}
Tipo de Conjuro: ${item.spellType}

Efecto:
${item.effect}

Desventajas de Consumible:
${disadvantagesStr}

Precio:
${priceStr} (Coste de materiales de fabricación: ${materialsStr})

Fabricación:
- Tiempo mínimo: ${crafting.timeRequired}
- ND de fabricación: ND ${crafting.ndCraft}
- Conceptos apropiados: ${crafting.recommendedConcepts.join(', ')}

Descripción:
${item.description || 'Sin descripción adicional.'}

====================================================
Sistema P.A.P.A. — Documento de Juego
`;
}

export function downloadTextFile(content: string, filename: string, mime: string = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

