import React, { useState } from 'react';
import { AttributeName, ConsumableItem } from '../types/papa';
import { Dices, AlertTriangle, Sparkles, CheckCircle2, XCircle, ShieldAlert, Zap } from 'lucide-react';
import { calculateConsumablePrice, BACKUP_ND_BY_LEVEL } from '../utils/consumableCalculator';

interface DiceSimulatorModalProps {
  item: ConsumableItem;
  isOpen: boolean;
  onClose: () => void;
}

export const DiceSimulatorModal: React.FC<DiceSimulatorModalProps> = ({
  item,
  isOpen,
  onClose
}) => {
  const [selectedAttribute, setSelectedAttribute] = useState<AttributeName>('Cuerpo');
  const [attributeBonus, setAttributeBonus] = useState<number>(1);
  const [isExpertRoll, setIsExpertRoll] = useState<boolean>(false);
  const [hasAdvantage, setHasAdvantage] = useState<boolean>(false);
  const [hasDisadvantage, setHasDisadvantage] = useState<boolean>(false);

  // Results
  const [diceResults, setDiceResults] = useState<number[]>([]);
  const [customTotal, setCustomTotal] = useState<number | null>(null);
  const [lastAction, setLastAction] = useState<string>('');
  const [testResult, setTestResult] = useState<{
    status: 'success' | 'failure' | 'critical-success' | 'critical-complication' | 'addicted' | 'neutral';
    title: string;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const targetNd = BACKUP_ND_BY_LEVEL[item.level];

  // Roll helper
  const rollDie = () => Math.floor(Math.random() * 6) + 1;

  // Formula Inestable test (1d6)
  const rollFormulaInestable = () => {
    const d = rollDie();
    setDiceResults([d]);
    setLastAction('Test de Fórmula Inestable (1d6)');
    if (d === 1) {
      setTestResult({
        status: 'failure',
        title: '¡Fórmula Inestable Fallida (1)!',
        message: 'El consumible falla violentamente y se destruye sin producir ningún efecto.'
      });
    } else {
      setTestResult({
        status: 'success',
        title: `¡Fórmula Estable (${d})!`,
        message: 'La mezcla se activa correctamente y despliega todo su efecto previsto.'
      });
    }
  };

  // Adicción test (2d6, if 2 = addicted)
  const rollAdiccion = () => {
    const d1 = rollDie();
    const d2 = rollDie();
    const sum = d1 + d2;
    setDiceResults([d1, d2]);
    setLastAction('Test de Adicción (2d6 al consumir)');
    if (sum === 2) {
      setTestResult({
        status: 'addicted',
        title: '¡Resultado 2: Adicción Contraída!',
        message: 'El personaje queda Adicto a este consumible. Debe consumir al menos 1 dosis entre descansos largos o sufrirá Fatiga.'
      });
    } else {
      setTestResult({
        status: 'success',
        title: `Sin Adicción (${sum} en dados)`,
        message: 'El consumidor asimila la sustancia sin desarrollar dependencia.'
      });
    }
  };

  // Frágil test (Salvación ND 10)
  const rollFragil = () => {
    const d1 = rollDie();
    const d2 = rollDie();
    const sum = d1 + d2 + attributeBonus;
    const isCrit = d1 === d2;
    setDiceResults([d1, d2]);
    setLastAction(`Salvación de Fragilidad vs ND 10 (2d6 + ${attributeBonus} ${selectedAttribute})`);

    if (sum >= 10) {
      setTestResult({
        status: isCrit ? 'critical-success' : 'success',
        title: isCrit ? `¡Éxito Crítico (${sum} vs ND 10)!` : `¡Salvación Exitosa (${sum} vs ND 10)!`,
        message: 'El recipiente resiste el impacto/humedad sin romperse.'
      });
    } else {
      setTestResult({
        status: isCrit ? 'critical-complication' : 'failure',
        title: isCrit ? `¡Crítico con Complicación (${sum} vs ND 10)!` : `¡Fracaso (${sum} vs ND 10)!`,
        message: 'El consumible se rompe, se derrama o se arruina sin efecto.'
      });
    }
  };

  // Crafting inestability (1d6)
  const rollInestabilidadFabricacion = () => {
    const d = rollDie();
    setDiceResults([d]);
    setLastAction('Tirada de Consumible Inestable en Fabricación (1d6)');
    if (d === 1) {
      setTestResult({
        status: 'failure',
        title: 'Resultado 1: Fallo Total',
        message: 'Falla y se destruye sin efecto.'
      });
    } else if (d === 2) {
      setTestResult({
        status: 'critical-complication',
        title: 'Resultado 2: Efecto Reducido',
        message: 'Funciona, pero con efecto reducido a la mitad de su potencia.'
      });
    } else if (d >= 3 && d <= 5) {
      setTestResult({
        status: 'success',
        title: `Resultado ${d}: Funciona Normalmente`,
        message: 'La preparación no presenta taras ni degradaciones.'
      });
    } else {
      setTestResult({
        status: 'critical-success',
        title: 'Resultado 6: ¡Beneficio Menor Adicional!',
        message: 'Funciona plenamente y añade un beneficio secundario positivo apropiado a criterio del DJ.'
      });
    }
  };

  // Custom PAPA Roll: 2d6, 3d6 (expert), advantage/disadvantage, checks ND & criticals (matching pairs)
  const rollPapaCheck = (targetDifficulty: number, descriptionLabel: string) => {
    let numDice = 2;
    if (isExpertRoll) numDice = 3;
    if (hasAdvantage && !hasDisadvantage) numDice += 1;
    if (hasDisadvantage && !hasAdvantage) numDice -= 1;
    numDice = Math.max(1, numDice);

    const rolled: number[] = [];
    for (let i = 0; i < numDice; i++) {
      rolled.push(rollDie());
    }

    // Sort descending
    const sorted = [...rolled].sort((a, b) => b - a);
    const kept = sorted.slice(0, 2);
    const sumKept = kept.reduce((acc, val) => acc + val, 0);
    const total = sumKept + attributeBonus;

    // Critical check in Sistema PAPA: occurs when TWO OR MORE dice show the EXACT same value!
    const counts: Record<number, number> = {};
    rolled.forEach(d => { counts[d] = (counts[d] || 0) + 1; });
    const isCritical = Object.values(counts).some(c => c >= 2);

    setDiceResults(rolled);
    setCustomTotal(total);
    setLastAction(`${descriptionLabel} vs ND ${targetDifficulty}`);

    if (total >= targetDifficulty) {
      if (isCritical) {
        setTestResult({
          status: 'critical-success',
          title: `¡Éxito Crítico (${total} vs ND ${targetDifficulty})!`,
          message: '¡Dos dados iguales! Éxito rotundo con beneficio adicional (mayor rapidez, posición táctica favorable o ahorro de esfuerzo).'
        });
      } else {
        setTestResult({
          status: 'success',
          title: `¡Éxito (${total} vs ND ${targetDifficulty})!`,
          message: 'La acción se resuelve con éxito superando la dificultad fijada.'
        });
      }
    } else {
      if (isCritical) {
        setTestResult({
          status: 'critical-complication',
          title: `¡Crítico con Complicación (${total} vs ND ${targetDifficulty})!`,
          message: '¡Dos dados iguales! Lográs el objetivo básico pero con una complicación severa (ruido, coste inesperado o quedás expuesto).'
        });
      } else {
        setTestResult({
          status: 'failure',
          title: `Fallo (${total} vs ND ${targetDifficulty})`,
          message: 'No alcanza la dificultad necesaria. La acción falla o provoca una consecuencia negativa.'
        });
      }
    }
  };

  const hasInestable = item.disadvantages.some(d => d.id === 'formula_inestable');
  const hasAdictiva = item.disadvantages.some(d => d.id === 'adictiva');
  const hasFragil = item.disadvantages.some(d => d.id === 'fragil');
  const hasUsoComplejo = item.disadvantages.some(d => d.id === 'uso_complejo');
  const hasEfectoAdverso = item.disadvantages.some(d => d.id.startsWith('efecto_adverso'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#232326] border border-[#3f4247] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3b3d42] bg-[#1a1b1d]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#de3468]/15 text-[#de3468] border border-[#de3468]/30">
              <Dices size={20} />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-[#ede8df] flex items-center gap-2">
                Simulador de Mesa & Tiradas
              </h2>
              <p className="text-xs text-[#a4a7ac]">
                Consumible: <span className="text-[#e5cf87] font-semibold">{item.name}</span> (Nivel {item.level} · {item.category})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#808388] hover:text-[#ede8df] p-1.5 rounded-lg hover:bg-[#323337] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Tests based on Consumable Disadvantages */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#a4a7ac] flex items-center gap-1.5">
              <Zap size={14} className="text-[#e5cf87]" />
              Pruebas Específicas del Consumible
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {hasInestable && (
                <button
                  onClick={rollFormulaInestable}
                  className="flex items-center justify-between p-3 rounded-lg border border-[#c47474]/50 bg-[#c47474]/10 hover:bg-[#c47474]/20 text-left transition-all group"
                >
                  <div>
                    <span className="block text-sm font-semibold text-[#f1a2a2]">Fórmula Inestable (1d6)</span>
                    <span className="text-xs text-[#a4a7ac]">1 = Se destruye sin efecto</span>
                  </div>
                  <Dices size={18} className="text-[#c47474] group-hover:scale-110 transition-transform" />
                </button>
              )}

              {hasAdictiva && (
                <button
                  onClick={rollAdiccion}
                  className="flex items-center justify-between p-3 rounded-lg border border-[#de3468]/50 bg-[#de3468]/10 hover:bg-[#de3468]/20 text-left transition-all group"
                >
                  <div>
                    <span className="block text-sm font-semibold text-[#f67fa4]">Test de Adicción (2d6)</span>
                    <span className="text-xs text-[#a4a7ac]">Resultado 2 = Adicción contraída</span>
                  </div>
                  <ShieldAlert size={18} className="text-[#de3468] group-hover:scale-110 transition-transform" />
                </button>
              )}

              {hasFragil && (
                <button
                  onClick={rollFragil}
                  className="flex items-center justify-between p-3 rounded-lg border border-[#808388]/60 bg-[#2c2d31] hover:bg-[#36383e] text-left transition-all group"
                >
                  <div>
                    <span className="block text-sm font-semibold text-[#ede8df]">Test de Fragilidad (ND 10)</span>
                    <span className="text-xs text-[#a4a7ac]">2d6 + Atributo al recibir golpe/agua</span>
                  </div>
                  <AlertTriangle size={18} className="text-[#e5cf87] group-hover:scale-110 transition-transform" />
                </button>
              )}

              {hasUsoComplejo && (
                <button
                  onClick={() => rollPapaCheck(targetNd, `Uso Complejo (${selectedAttribute})`)}
                  className="flex items-center justify-between p-3 rounded-lg border border-[#e5cf87]/50 bg-[#e5cf87]/10 hover:bg-[#e5cf87]/20 text-left transition-all group"
                >
                  <div>
                    <span className="block text-sm font-semibold text-[#f1dfa8]">Uso Complejo (vs ND {targetNd})</span>
                    <span className="text-xs text-[#a4a7ac]">Fallo = se gasta sin efecto</span>
                  </div>
                  <Dices size={18} className="text-[#e5cf87] group-hover:scale-110 transition-transform" />
                </button>
              )}

              {hasEfectoAdverso && (
                <button
                  onClick={() => rollPapaCheck(targetNd, `Salvación contra Efecto Adverso (${selectedAttribute})`)}
                  className="flex items-center justify-between p-3 rounded-lg border border-[#c47474]/50 bg-[#c47474]/10 hover:bg-[#c47474]/20 text-left transition-all group"
                >
                  <div>
                    <span className="block text-sm font-semibold text-[#f1a2a2]">Salvación Efecto Adverso (ND {targetNd})</span>
                    <span className="text-xs text-[#a4a7ac]">Fallo = daño o estado adverso</span>
                  </div>
                  <AlertTriangle size={18} className="text-[#c47474] group-hover:scale-110 transition-transform" />
                </button>
              )}

              <button
                onClick={rollInestabilidadFabricacion}
                className="flex items-center justify-between p-3 rounded-lg border border-[#3b3d42] bg-[#28292c] hover:bg-[#323337] text-left transition-all group"
              >
                <div>
                  <span className="block text-sm font-semibold text-[#ede8df]">Inestabilidad en Fabricación</span>
                  <span className="text-xs text-[#a4a7ac]">Tabla de fallo al crear (1d6)</span>
                </div>
                <Dices size={18} className="text-[#a4a7ac] group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          {/* General PAPA Action / Saving Throw Roller */}
          <div className="p-4 rounded-xl bg-[#1c1d1f] border border-[#36383e] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-[#ede8df] flex items-center gap-2">
                <Sparkles size={16} className="text-[#e5cf87]" />
                Tirada General Sistema P.A.P.A.
              </h3>
              <span className="text-xs text-[#808388]">Crítico: 2+ dados con mismo valor</span>
            </div>

            {/* Modifiers controls */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div>
                <label className="block text-[#a4a7ac] mb-1 font-medium">Atributo</label>
                <select
                  value={selectedAttribute}
                  onChange={(e) => setSelectedAttribute(e.target.value as AttributeName)}
                  className="w-full bg-[#28292c] border border-[#3f4247] rounded-md px-2.5 py-1.5 text-[#ede8df] focus:border-[#c47474] outline-none"
                >
                  <option value="Cuerpo">Cuerpo</option>
                  <option value="Destreza">Destreza</option>
                  <option value="Aura">Aura</option>
                </select>
              </div>

              <div>
                <label className="block text-[#a4a7ac] mb-1 font-medium">Valor Atributo</label>
                <input
                  type="number"
                  min="-3"
                  max="5"
                  value={attributeBonus}
                  onChange={(e) => setAttributeBonus(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#28292c] border border-[#3f4247] rounded-md px-2.5 py-1.5 text-[#ede8df] focus:border-[#c47474] outline-none"
                />
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 p-1.5 rounded bg-[#28292c] border border-[#3f4247] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isExpertRoll}
                    onChange={(e) => setIsExpertRoll(e.target.checked)}
                    className="accent-[#c47474]"
                  />
                  <span className="text-[#ede8df] font-medium">Experto (3d6)</span>
                </label>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => { setHasAdvantage(!hasAdvantage); if (!hasAdvantage) setHasDisadvantage(false); }}
                  className={`flex-1 py-1.5 px-2 rounded font-semibold text-center transition-colors border ${
                    hasAdvantage 
                      ? 'bg-[#e5cf87]/20 border-[#e5cf87] text-[#f1dfa8]' 
                      : 'bg-[#28292c] border-[#3f4247] text-[#a4a7ac] hover:text-[#ede8df]'
                  }`}
                >
                  Ventaja (+1d)
                </button>
                <button
                  type="button"
                  onClick={() => { setHasDisadvantage(!hasDisadvantage); if (!hasDisadvantage) setHasAdvantage(false); }}
                  className={`flex-1 py-1.5 px-2 rounded font-semibold text-center transition-colors border ${
                    hasDisadvantage 
                      ? 'bg-[#c47474]/20 border-[#c47474] text-[#f1a2a2]' 
                      : 'bg-[#28292c] border-[#3f4247] text-[#a4a7ac] hover:text-[#ede8df]'
                  }`}
                >
                  Desv (-1d)
                </button>
              </div>
            </div>

            {/* Quick Difficulty buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs text-[#a4a7ac] self-center mr-1">Tirar contra ND:</span>
              {[
                { label: 'Fácil (8)', nd: 8 },
                { label: 'Normal (10)', nd: 10 },
                { label: `Conjuro N${item.level} (${targetNd})`, nd: targetNd },
                { label: 'Difícil (14)', nd: 14 },
                { label: 'Imposible (18)', nd: 18 }
              ].map(itemNd => (
                <button
                  key={itemNd.nd + itemNd.label}
                  onClick={() => rollPapaCheck(itemNd.nd, `Tirada contra ND ${itemNd.nd}`)}
                  className="px-3 py-1.5 rounded-lg bg-[#2f3136] hover:bg-[#3c3e45] text-xs font-semibold text-[#ede8df] border border-[#44474e] transition-colors"
                >
                  {itemNd.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Display */}
          {testResult && (
            <div className={`p-4 rounded-xl border animate-in slide-in-from-bottom-2 duration-300 ${
              testResult.status === 'success' || testResult.status === 'critical-success'
                ? 'bg-emerald-950/30 border-emerald-700/60'
                : testResult.status === 'addicted' || testResult.status === 'failure'
                ? 'bg-rose-950/30 border-rose-700/60'
                : 'bg-amber-950/30 border-amber-700/60'
            }`}>
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  {testResult.status === 'success' || testResult.status === 'critical-success' ? (
                    <CheckCircle2 className="text-emerald-400" size={24} />
                  ) : testResult.status === 'addicted' ? (
                    <ShieldAlert className="text-[#de3468]" size={24} />
                  ) : testResult.status === 'critical-complication' ? (
                    <AlertTriangle className="text-amber-400" size={24} />
                  ) : (
                    <XCircle className="text-rose-400" size={24} />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#a4a7ac] uppercase tracking-wider">{lastAction}</span>
                    {customTotal !== null && (
                      <span className="font-serif font-black text-sm text-[#e5cf87]">
                        Total: {customTotal}
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#ede8df]">
                    {testResult.title}
                  </h4>
                  <p className="text-xs text-[#cfcfcf] leading-relaxed">
                    {testResult.message}
                  </p>

                  {/* Dice faces */}
                  {diceResults.length > 0 && (
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-xs text-[#808388]">Dados:</span>
                      {diceResults.map((val, idx) => (
                        <span
                          key={idx}
                          className="w-8 h-8 rounded-lg bg-[#28292c] border border-[#484b52] flex items-center justify-center font-mono font-bold text-base text-[#e5cf87] shadow-inner"
                        >
                          {val}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#3b3d42] bg-[#1a1b1d] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#323337] hover:bg-[#3c3e44] text-xs font-semibold text-[#ede8df] transition-colors"
          >
            Cerrar Simulador
          </button>
        </div>
      </div>
    </div>
  );
};
