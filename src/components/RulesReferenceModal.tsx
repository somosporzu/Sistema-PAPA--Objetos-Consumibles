import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  AlertTriangle, 
  Hammer, 
  Coins, 
  Clock, 
  Zap, 
  ShieldAlert, 
  Sparkles,
  Layers,
  X
} from 'lucide-react';
import { PorzuuLogo } from './PorzuuLogo';

interface RulesReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesReferenceModal: React.FC<RulesReferenceModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'consumibles' | 'fabricacion' | 'desventajas' | 'estados' | 'sistema'>('consumibles');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#232326] border border-[#3f4247] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:px-6 border-b border-[#3b3d42] bg-[#1a1b1d]">
          <div className="flex items-center gap-3">
            <PorzuuLogo size={32} />
            <div>
              <h2 className="font-serif font-bold text-lg text-[#ede8df] flex items-center gap-2">
                Compendio de Reglas & Consumibles
              </h2>
              <p className="text-xs text-[#a4a7ac]">
                Manual del Sistema P.A.P.A. (Revisión 2 de Creación de Consumibles)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#808388] hover:text-[#ede8df] p-1.5 rounded-lg hover:bg-[#323337] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#33353b] bg-[#1d1e21] px-4 overflow-x-auto gap-2 text-xs">
          {[
            { id: 'consumibles', label: 'Consumibles & Categorías', icon: Sparkles },
            { id: 'fabricacion', label: 'Fabricación & Inestabilidad', icon: Hammer },
            { id: 'desventajas', label: 'Catálogo de Desventajas', icon: AlertTriangle },
            { id: 'estados', label: 'Estados Alterados (14)', icon: ShieldAlert },
            { id: 'sistema', label: 'Tiradas & Críticos', icon: Layers }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3 font-semibold border-b-2 transition-all shrink-0 ${
                  isActive
                    ? 'border-[#c47474] text-[#ede8df] bg-[#26272b]'
                    : 'border-transparent text-[#808388] hover:text-[#ede8df]'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-[#c47474]' : ''} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#ede8df] leading-relaxed">
          {activeTab === 'consumibles' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif font-bold text-base text-[#e5cf87] mb-2">
                  Reglas Generales de Consumibles
                </h3>
                <p className="text-xs text-[#cfcfcf]">
                  Un consumible se construye igual que un Conjuro de personaje de Nivel I a V empaquetado en un objeto de un solo uso. Se destruye, gasta o pierde su poder tras activarse. Nunca usa sistema de cargas recargables.
                </p>
              </div>

              {/* The 3 Categories */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#28292d] border border-[#3b3d43] space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
                    Comestible
                  </span>
                  <div className="text-xs text-[#a4a7ac] space-y-1">
                    <p><strong className="text-[#ede8df]">Activación:</strong> Acción Rápida (Acción Principal si se administra a alguien inconsciente).</p>
                    <p><strong className="text-[#ede8df]">Uso:</strong> Se bebe, come o ingiere. Afecta al consumidor. Administrar a la fuerza exige Derribar o Apresar.</p>
                    <p><strong className="text-[#ede8df]">Tirada:</strong> No requiere, salvo Uso Complejo o Efecto Adverso.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#28292d] border border-[#3b3d43] space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 block">
                    Aplicable
                  </span>
                  <div className="text-xs text-[#a4a7ac] space-y-1">
                    <p><strong className="text-[#ede8df]">Activación:</strong> 1 minuto, siempre fuera de combate.</p>
                    <p><strong className="text-[#ede8df]">Uso:</strong> Se aplica sobre piel, heridas, armas o armaduras. En armas/aceites se consume al 1er impacto exitoso.</p>
                    <p><strong className="text-[#ede8df]">Tirada:</strong> No requiere, salvo Uso Complejo o Efecto Adverso.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#28292d] border border-[#3b3d43] space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-300 block">
                    Activable
                  </span>
                  <div className="text-xs text-[#a4a7ac] space-y-1">
                    <p><strong className="text-[#ede8df]">Activación:</strong> Acción Principal (salvo que el conjuro indique Rápida o Reacción).</p>
                    <p><strong className="text-[#ede8df]">Uso:</strong> Se gasta la acción para activarlo (lanzar bomba, quebrar sello). Exige ataque a distancia si es hostil.</p>
                    <p><strong className="text-[#ede8df]">Tirada:</strong> Ataque a distancia si es hostil, o Salvación del objetivo si el conjuro la exige.</p>
                  </div>
                </div>
              </div>

              {/* Price Base Table */}
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#e5cf87]">
                  Precios Base por Nivel (Lectos - L)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-[#1c1d1f] border border-[#36383e]">
                    <span className="text-[#808388] block">Nivel I</span>
                    <strong className="text-[#e5cf87] text-base font-serif">25 L</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#1c1d1f] border border-[#36383e]">
                    <span className="text-[#808388] block">Nivel II</span>
                    <strong className="text-[#e5cf87] text-base font-serif">75 L</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#1c1d1f] border border-[#36383e]">
                    <span className="text-[#808388] block">Nivel III</span>
                    <strong className="text-[#e5cf87] text-base font-serif">200 L</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#1c1d1f] border border-[#36383e]">
                    <span className="text-[#808388] block">Nivel IV</span>
                    <strong className="text-[#e5cf87] text-base font-serif">500 L</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#1c1d1f] border border-[#36383e]">
                    <span className="text-[#808388] block">Nivel V</span>
                    <strong className="text-[#c47474] text-xs font-serif block mt-1">Sin precio común</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fabricacion' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif font-bold text-base text-[#e5cf87] mb-2">
                  Reglas de Fabricación Alquímica y Mágica
                </h3>
                <p className="text-xs text-[#cfcfcf]">
                  Fabricar requiere materiales por valor de la mitad del precio base (50%). Si se recolectan ingredientes durante la aventura, el DJ puede reducir o eliminar el coste.
                </p>
              </div>

              {/* Table of Crafting per Level */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-[#383a40] rounded-lg overflow-hidden">
                  <thead className="bg-[#1c1d1f] text-[#e5cf87] font-serif uppercase tracking-wider">
                    <tr>
                      <th className="p-2.5 border-b border-[#383a40]">Nivel</th>
                      <th className="p-2.5 border-b border-[#383a40]">Tiempo Mínimo</th>
                      <th className="p-2.5 border-b border-[#383a40]">ND Fabricación</th>
                      <th className="p-2.5 border-b border-[#383a40]">Coste de Materiales</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2f3136]">
                    <tr>
                      <td className="p-2.5 font-bold font-mono">Nivel I</td>
                      <td className="p-2.5">1 hora</td>
                      <td className="p-2.5 font-mono text-[#e5cf87]">ND 9</td>
                      <td className="p-2.5">12 L</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold font-mono">Nivel II</td>
                      <td className="p-2.5">4 horas</td>
                      <td className="p-2.5 font-mono text-[#e5cf87]">ND 12</td>
                      <td className="p-2.5">37 L</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold font-mono">Nivel III</td>
                      <td className="p-2.5">1 jornada (8 horas)</td>
                      <td className="p-2.5 font-mono text-[#e5cf87]">ND 15</td>
                      <td className="p-2.5">100 L</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold font-mono">Nivel IV</td>
                      <td className="p-2.5">3 jornadas</td>
                      <td className="p-2.5 font-mono text-[#e5cf87]">ND 18</td>
                      <td className="p-2.5">250 L</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold font-mono">Nivel V</td>
                      <td className="p-2.5">Variable (aventura / condición especial)</td>
                      <td className="p-2.5 font-mono text-[#c47474]">ND 21+</td>
                      <td className="p-2.5">Incalculable / Único</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Inestability Table */}
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#e5cf87]">
                  Tabla de Fallo / Inestabilidad de Fabricación (1d6)
                </h4>
                <p className="text-xs text-[#a4a7ac]">
                  Si falla la tirada por 5 o más, se pierden todos los materiales o surge una versión inestable:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#2f1f22] border border-[#c47474]/40">
                    <strong className="text-[#f1a2a2]">1 en 1d6:</strong> Falla y se destruye sin producir efecto.
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#312a1d] border border-amber-600/40">
                    <strong className="text-amber-200">2 en 1d6:</strong> Funciona, pero con efecto reducido a la mitad.
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#1c1d1f] border border-[#383a40]">
                    <strong className="text-[#ede8df]">3 a 5 en 1d6:</strong> Funciona normalmente sin alteración.
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#1b2b23] border border-emerald-600/40">
                    <strong className="text-emerald-300">6 en 1d6:</strong> Funciona y añade un beneficio menor apropiado.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'desventajas' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-serif font-bold text-base text-[#e5cf87] mb-2">
                  Desventajas Exclusivas de Consumibles
                </h3>
                <p className="text-xs text-[#a4a7ac]">
                  Un consumible puede tener como máximo 3 Desventajas. Cuando exigen Salvación "contra el ND del conjuro" y el conjuro no tiene ND propio fijado, se usa el <strong className="text-[#ede8df]">ND de respaldo = 8 + Nivel</strong> (I: 9, II: 10, III: 11, IV: 12, V: 13).
                </p>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-lg bg-[#1c1d1f] border border-[#36383e]">
                  <div className="flex justify-between font-bold text-[#ede8df]">
                    <span>Uso complejo</span>
                    <span className="font-mono text-[#e5cf87]">3 PC</span>
                  </div>
                  <p className="text-[#a4a7ac] mt-1">Activarlo exige una tirada de Atributo (elegido al crear) contra el ND de Salvación del propio conjuro. Si falla, el consumible se gasta igual pero no produce efecto.</p>
                </div>

                <div className="p-3 rounded-lg bg-[#1c1d1f] border border-[#36383e]">
                  <div className="flex justify-between font-bold text-[#ede8df]">
                    <span>Efecto Adverso menor</span>
                    <span className="font-mono text-[#e5cf87]">2 PC</span>
                  </div>
                  <p className="text-[#a4a7ac] mt-1">Al usarlo, Salvación (Atributo elegido) contra ND 10 o sufre un efecto negativo menor (-1 a la próxima tirada o Desventaja puntual).</p>
                </div>

                <div className="p-3 rounded-lg bg-[#1c1d1f] border border-[#36383e]">
                  <div className="flex justify-between font-bold text-[#ede8df]">
                    <span>Efecto Adverso</span>
                    <span className="font-mono text-[#e5cf87]">4 PC</span>
                  </div>
                  <p className="text-[#a4a7ac] mt-1">Al usarlo, Salvación contra ND del conjuro o sufre un estado alterado menor/medio definido, o 1d6 de daño.</p>
                </div>

                <div className="p-3 rounded-lg bg-[#1c1d1f] border border-[#36383e]">
                  <div className="flex justify-between font-bold text-[#ede8df]">
                    <span>Efecto Adverso grave</span>
                    <span className="font-mono text-[#e5cf87]">6 PC</span>
                  </div>
                  <p className="text-[#a4a7ac] mt-1">Igual que Efecto Adverso, pero el fallo causa un estado mayor definido o 2d6 de daño.</p>
                </div>

                <div className="p-3 rounded-lg bg-[#1c1d1f] border border-[#36383e]">
                  <div className="flex justify-between font-bold text-[#ede8df]">
                    <span>Fórmula inestable</span>
                    <span className="font-mono text-[#e5cf87]">2 PC</span>
                  </div>
                  <p className="text-[#a4a7ac] mt-1">Al usarlo, tirá 1d6. Con 1, falla y se destruye sin efecto. Con 2-6 funciona correctamente.</p>
                </div>

                <div className="p-3 rounded-lg bg-[#1c1d1f] border border-[#36383e]">
                  <div className="flex justify-between font-bold text-[#ede8df]">
                    <span>Frágil</span>
                    <span className="font-mono text-[#e5cf87]">2 PC</span>
                  </div>
                  <p className="text-[#a4a7ac] mt-1">Si el consumible recibe daño, se moja, se golpea o pasa por condición adversa, Salvación de Cuerpo o Destreza ND 10 o el consumible se arruina sin efecto.</p>
                </div>

                <div className="p-3 rounded-lg bg-[#1c1d1f] border border-[#36383e]">
                  <div className="flex justify-between font-bold text-[#de3468]">
                    <span>Adictiva (solo Comestibles)</span>
                    <span className="font-mono text-[#e5cf87]">4 PC</span>
                  </div>
                  <p className="text-[#a4a7ac] mt-1">Al consumirlo, tirá 2d6. Con 2, quedás Adicto: si completás un Descanso Largo sin dosis desde el anterior, no recuperás Fatiga y ganás 1d6/2 niveles de Fatiga consecutivos.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'estados' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-serif font-bold text-base text-[#e5cf87] mb-2">
                  Los 14 Estados Alterados del Sistema P.A.P.A.
                </h3>
                <p className="text-xs text-[#a4a7ac]">
                  Los estados alterados modifican la forma en que una criatura actúa. No se acumulan copias del mismo estado; se aplica la duración más larga o el efecto más grave.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {[
                  { name: 'Derribado', desc: 'En el suelo. Movimiento nulo, Desventaja en ataques cuerpo a cuerpo y tiradas/Salvaciones de Destreza. Ponerse de pie cuesta su acción.' },
                  { name: 'Inmovilizado', desc: 'No puede moverse de su posición. Movimiento nulo y Desventaja en tiradas/Salvaciones de Destreza. Puede atacar o actuar si no exige desplazarse.' },
                  { name: 'Ralentizado', desc: 'Todo terreno cuenta como difícil. Iniciativa a la mitad (redondeando abajo) y Desventaja en tiradas y Salvaciones de Destreza.' },
                  { name: 'Asustado', desc: 'No puede acercarse voluntariamente a la fuente de miedo. Desventaja en tiradas/Salvaciones de Aura y ataques contra la fuente.' },
                  { name: 'Confundido', desc: 'Desventaja en tiradas/Salvaciones de Aura. Si intenta atacar o usar técnica/conjuro dirigido, el objetivo se elige al azar entre los visibles a su alcance (incluso aliados).' },
                  { name: 'Controlado', desc: 'Quien impuso el estado decide sus acciones y movimiento. Desventaja en tiradas/Salvaciones de Aura; sin reacciones propias.' },
                  { name: 'Cegado', desc: 'Falla tiradas de vista. Desventaja en ataques, evasión, orientación. Los ataques contra él tienen Ventaja.' },
                  { name: 'Ensordecido', desc: 'Falla tiradas de oído; no recibe órdenes, advertencias o cantos que requieran escuchar.' },
                  { name: 'Silenciado', desc: 'No puede emitir sonido articulado ni lanzar conjuros ni usar técnicas que exijan voz.' },
                  { name: 'Aturdido', desc: 'No puede usar Reacciones y sufre Desventaja en tiradas de ataque, Salvaciones de Destreza y concentración.' },
                  { name: 'Envenenado', desc: 'Sufre Desventaja en tiradas y Salvaciones de Cuerpo.' },
                  { name: 'Desarmado', desc: 'Pierde el arma u objeto que sostenía (cae a sus pies). Recogerlo toma Acción Rápida.' },
                  { name: 'Incapacitado', desc: 'No puede realizar Acciones Principales, Acciones Rápida ni Reacciones.' },
                  { name: 'Inconsciente', desc: 'Cae Derribado y suelta objetos. No actúa ni usa reacciones. Ataques cuerpo a cuerpo adyacentes tienen Ventaja.' }
                ].map(st => (
                  <div key={st.name} className="p-3 rounded-lg bg-[#1c1d1f] border border-[#383a40]">
                    <strong className="text-[#f1dfa8] font-serif block mb-0.5">{st.name}</strong>
                    <span className="text-[#a4a7ac] leading-relaxed">{st.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sistema' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-serif font-bold text-base text-[#e5cf87] mb-2">
                  Tiradas Básicas, Dificultades y Críticos
                </h3>
                <p className="text-xs text-[#a4a7ac]">
                  La tirada normal usa <strong className="text-[#ede8df]">2d6 + Atributo</strong>. Con un Concepto adecuado se realiza una <strong className="text-[#ede8df]">Tirada de Experto (3d6, suma los 2 más altos)</strong>.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#1c1d1f] border border-[#3b3d42] space-y-2 text-xs">
                <span className="font-bold text-[#c47474] uppercase tracking-wider block">
                  Regla de Críticos en Sistema PAPA:
                </span>
                <p className="text-[#cfcfcf]">
                  Un crítico ocurre cuando <strong className="text-[#ede8df]">dos o más dados muestran el mismo resultado</strong>.
                </p>
                <ul className="list-disc list-inside space-y-1 text-[#a4a7ac]">
                  <li><strong className="text-emerald-300">Total ≥ Dificultad:</strong> Éxito con beneficio adicional extraordinario.</li>
                  <li><strong className="text-amber-300">Total &lt; Dificultad:</strong> Logra su objetivo básico, pero con una complicación o coste severo.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-serif font-bold text-[#e5cf87] block uppercase tracking-wider">
                  Tabla de Dificultades (ND)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#1c1d1f] border border-[#383a40]">
                    <span className="text-[#808388] block">Fácil</span>
                    <strong className="text-emerald-400 font-mono text-base">ND 8</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#1c1d1f] border border-[#383a40]">
                    <span className="text-[#808388] block">Normal</span>
                    <strong className="text-sky-400 font-mono text-base">ND 10</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#1c1d1f] border border-[#383a40]">
                    <span className="text-[#808388] block">Difícil</span>
                    <strong className="text-amber-400 font-mono text-base">ND 14</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#1c1d1f] border border-[#383a40]">
                    <span className="text-[#808388] block">Imposible</span>
                    <strong className="text-rose-400 font-mono text-base">ND 18</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#1c1d1f] border border-[#383a40]">
                    <span className="text-[#808388] block">Legendaria</span>
                    <strong className="text-purple-400 font-mono text-base">ND 21+</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#3b3d42] bg-[#1a1b1d] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#808388]">
            <span>Paleta oficial: Terracota, Oro, Obsidiana y Pizarra</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#323337] hover:bg-[#3c3e44] text-xs font-semibold text-[#ede8df]"
          >
            Cerrar Compendio
          </button>
        </div>
      </div>
    </div>
  );
};
