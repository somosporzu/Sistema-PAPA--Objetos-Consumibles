import React, { useState, useRef } from 'react';
import { ConsumableItem } from '../types/papa';
import { 
  calculateConsumablePrice, 
  getCraftingDetails, 
  formatConsumableMarkdown,
  formatConsumablePlainText,
  downloadTextFile,
  CATEGORY_ACTIVATION_INFO 
} from '../utils/consumableCalculator';
import { toPng } from 'html-to-image';
import { PorzuuLogo } from './PorzuuLogo';
import { DiceSimulatorModal } from './DiceSimulatorModal';
import { 
  Sparkles, 
  Dices, 
  Copy, 
  Check, 
  Clock, 
  Hammer, 
  AlertTriangle, 
  Coins, 
  Trash2, 
  Edit3, 
  Share2, 
  ShieldAlert,
  Flame,
  Droplets,
  Mountain,
  Sword,
  TreeDeciduous,
  CircleDot,
  Download,
  Image as ImageIcon,
  FileText,
  ChevronDown
} from 'lucide-react';

interface ConsumableCardProps {
  item: ConsumableItem;
  onEdit?: (item: ConsumableItem) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (item: ConsumableItem) => void;
  isCompact?: boolean;
}

export const ConsumableCard: React.FC<ConsumableCardProps> = ({
  item,
  onEdit,
  onDelete,
  onDuplicate,
  isCompact = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isDiceModalOpen, setIsDiceModalOpen] = useState(false);
  const [showCrafting, setShowCrafting] = useState(!isCompact);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const priceCalc = calculateConsumablePrice(item);
  const crafting = getCraftingDetails(item.level, item.category, priceCalc.basePrice);
  const activationMeta = CATEGORY_ACTIVATION_INFO[item.category];

  const handleCopyMarkdown = () => {
    const md = formatConsumableMarkdown(item);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const txt = formatConsumablePlainText(item);
    const filename = `${item.name.toLowerCase().replace(/[^a-z0-9]/gi, '_')}_papa.txt`;
    downloadTextFile(txt, filename);
    setShowDownloadMenu(false);
  };

  const handleDownloadMd = () => {
    const md = formatConsumableMarkdown(item);
    const filename = `${item.name.toLowerCase().replace(/[^a-z0-9]/gi, '_')}_papa.md`;
    downloadTextFile(md, filename, 'text/markdown;charset=utf-8');
    setShowDownloadMenu(false);
  };

  const handleDownloadPng = async () => {
    if (!cardRef.current) return;
    setIsExportingImage(true);
    setShowDownloadMenu(false);

    try {
      // Temporarily hide elements with class 'no-print' inside during screenshot if needed
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: '#242528',
        filter: (node) => {
          // Do not include buttons bar in clean card export
          if (node.classList && node.classList.contains('no-export-image')) {
            return false;
          }
          return true;
        }
      });

      const anchor = document.createElement('a');
      anchor.download = `${item.name.toLowerCase().replace(/[^a-z0-9]/gi, '_')}_carta_papa.png`;
      anchor.href = dataUrl;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } catch (err) {
      console.error('Error generating card image:', err);
      alert('Error al generar la imagen de la carta: ' + (err as Error).message);
    } finally {
      setIsExportingImage(false);
    }
  };

  const getEnergyColor = (energy: string) => {
    switch (energy) {
      case 'Destrucción': return 'text-[#c47474] border-[#c47474]/40 bg-[#c47474]/10';
      case 'Creación': return 'text-[#88b04b] border-[#88b04b]/40 bg-[#88b04b]/10';
      case 'Transformación': return 'text-[#a284e3] border-[#a284e3]/40 bg-[#a284e3]/10';
      case 'Conservación': return 'text-[#48bfe3] border-[#48bfe3]/40 bg-[#48bfe3]/10';
      case 'Orden': return 'text-[#e5cf87] border-[#e5cf87]/40 bg-[#e5cf87]/10';
      case 'Caos': return 'text-[#de3468] border-[#de3468]/40 bg-[#de3468]/10';
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Comestible': return 'bg-amber-900/30 text-amber-200 border-amber-600/40';
      case 'Aplicable': return 'bg-emerald-900/30 text-emerald-200 border-emerald-600/40';
      case 'Activable': return 'bg-rose-900/30 text-rose-200 border-rose-600/40';
      default: return 'bg-zinc-800 text-zinc-200 border-zinc-700';
    }
  };

  return (
    <>
      <div 
        ref={cardRef}
        className="print-card relative flex flex-col bg-[#242528] rounded-xl border border-[#3c3e44] shadow-lg hover:border-[#52555d] transition-all overflow-hidden group"
      >
        {/* Top 4-Color Accent Band from Palette */}
        <div className="h-1.5 w-full flex">
          <div className="flex-1 bg-[#c47474]" />
          <div className="flex-1 bg-[#e5cf87]" />
          <div className="flex-1 bg-[#28282a]" />
          <div className="flex-1 bg-[#808388]" />
        </div>

        {/* Card Header */}
        <div className="p-4 sm:p-5 border-b border-[#35373d] bg-[#1d1e20]/60 flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {/* Category */}
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getCategoryColor(item.category)}`}>
                {item.category}
              </span>

              {/* Level */}
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#161719] text-[#e5cf87] border border-[#e5cf87]/30">
                Nivel {item.level}
              </span>

              {/* Narrative Form */}
              <span className="text-xs text-[#a4a7ac] italic font-medium">
                {item.narrativeForm}
              </span>
            </div>

            <h3 className="font-serif font-bold text-lg text-[#ede8df] group-hover:text-[#f1dfa8] transition-colors leading-snug">
              {item.name}
            </h3>

            {/* Spell Metadata: Energy, Affinity, Spell Type */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold ${getEnergyColor(item.energy)}`}>
                {item.energy}
              </span>
              <span className="flex items-center gap-1 text-[#cfcfcf] text-[11px]">
                {getAffinityIcon(item.affinity)}
                {item.affinity}
              </span>
              <span className="text-[#808388] text-[11px]">·</span>
              <span className="text-[#a4a7ac] text-[11px] font-medium">
                {item.spellType}
              </span>
              {item.sourceSpellName && (
                <span className="text-[#808388] text-[11px] italic truncate max-w-[150px]">
                  ({item.sourceSpellName})
                </span>
              )}
            </div>
          </div>

          {/* Porzuu Mini Watermark Logo */}
          <div className="shrink-0 flex flex-col items-end gap-1">
            <PorzuuLogo size={28} />
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 font-serif font-black text-sm text-[#e5cf87]">
                <Coins size={14} className="text-[#e5cf87]" />
                {priceCalc.finalPrice !== null ? `${priceCalc.finalPrice} L` : 'Sin precio'}
              </div>
              {priceCalc.materialsCost !== null && (
                <span className="text-[10px] text-[#808388]">
                  Mat: {priceCalc.materialsCost} L
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 space-y-4 flex-1">
          {/* Activation & Usage Quick Banner */}
          <div className="p-2.5 rounded-lg bg-[#1a1b1d] border border-[#313338] text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-[#e5cf87] font-semibold">
              <Clock size={13} />
              <span>{activationMeta.activation}</span>
            </div>
            <p className="text-[11px] text-[#a4a7ac] leading-relaxed">
              {activationMeta.usage}
            </p>
          </div>

          {/* Mechanical Effect Box */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#a4a7ac] block">
              Efecto Mecánico:
            </span>
            <div className="p-3 rounded-lg bg-[#1c1d1f] border border-[#383a40] text-xs text-[#ede8df] leading-relaxed font-sans shadow-inner">
              {item.effect}
            </div>
          </div>

          {/* Disadvantages (Desventajas) */}
          {item.disadvantages && item.disadvantages.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#c47474] flex items-center gap-1.5">
                <AlertTriangle size={13} />
                Desventajas del Consumible ({item.disadvantages.length}/3):
              </span>
              <div className="space-y-1.5">
                {item.disadvantages.map((dis, idx) => (
                  <div
                    key={dis.id + idx}
                    className="p-2.5 rounded-md bg-[#2d1f22] border border-[#c47474]/30 text-xs text-[#f1a2a2] space-y-0.5"
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span>{dis.name}</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[#c47474]/20 border border-[#c47474]/40">
                        {dis.pc} PC
                      </span>
                    </div>
                    <p className="text-[11px] text-[#e0b4b4] leading-relaxed">
                      {dis.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flavor/Narrative Description */}
          {item.description && (
            <p className="text-xs text-[#9a9da3] italic leading-relaxed pt-1 border-t border-[#313338]">
              "{item.description}"
            </p>
          )}

          {/* Crafting accordion / details */}
          {showCrafting && (
            <div className="pt-2 border-t border-[#313338] text-xs space-y-2 bg-[#1b1c1e]/40 p-2.5 rounded-lg border">
              <div className="flex items-center justify-between text-[#e5cf87] font-medium">
                <span className="flex items-center gap-1.5">
                  <Hammer size={13} />
                  Fabricación:
                </span>
                <span className="font-mono font-bold">ND {crafting.ndCraft}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#a4a7ac]">
                <div>
                  <span className="text-[#808388]">Tiempo mínimo:</span> {crafting.timeRequired}
                </div>
                <div>
                  <span className="text-[#808388]">Coste materiales:</span> {crafting.baseMaterialCost > 0 ? `${crafting.baseMaterialCost} L` : 'Especial'}
                </div>
              </div>
              <div className="text-[11px] text-[#a4a7ac]">
                <span className="text-[#808388]">Conceptos idóneos:</span> {crafting.recommendedConcepts.slice(0, 4).join(', ')}...
              </div>
            </div>
          )}
        </div>

        {/* Card Footer Actions (Excluded from exported PNG image) */}
        <div className="no-print no-export-image p-3 sm:px-4 bg-[#1b1c1e] border-t border-[#313338] flex flex-wrap items-center justify-between gap-2">
          {/* Roll test dice button */}
          <button
            onClick={() => setIsDiceModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#de3468]/15 hover:bg-[#de3468]/25 text-[#de3468] border border-[#de3468]/40 text-xs font-semibold transition-all hover:scale-102 active:scale-98"
          >
            <Dices size={14} />
            <span>Tirar Dados</span>
          </button>

          <div className="flex items-center gap-1.5">
            {/* Download Menu Button */}
            <div className="relative">
              <button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                disabled={isExportingImage}
                title="Descargar en imagen o texto"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#e5cf87]/15 hover:bg-[#e5cf87]/25 text-[#e5cf87] border border-[#e5cf87]/40 text-xs font-semibold transition-colors"
              >
                {isExportingImage ? (
                  <span className="animate-spin text-xs">⏳</span>
                ) : (
                  <Download size={14} />
                )}
                <span>Descargar</span>
                <ChevronDown size={12} />
              </button>

              {/* Download Dropdown */}
              {showDownloadMenu && (
                <div className="absolute right-0 bottom-full mb-1.5 w-52 bg-[#232326] border border-[#3f4247] rounded-xl shadow-2xl p-1.5 z-30 space-y-1 animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[#808388] border-b border-[#313337]">
                    Opciones de Descarga
                  </div>

                  <button
                    onClick={handleDownloadPng}
                    disabled={isExportingImage}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#ede8df] hover:bg-[#2e3035] rounded-lg transition-colors text-left"
                  >
                    <ImageIcon size={14} className="text-[#de3468]" />
                    <div>
                      <span className="font-semibold block">Imagen de Carta (.PNG)</span>
                      <span className="text-[10px] text-[#808388]">Alta resolución lista para mesa</span>
                    </div>
                  </button>

                  <button
                    onClick={handleDownloadTxt}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#ede8df] hover:bg-[#2e3035] rounded-lg transition-colors text-left"
                  >
                    <FileText size={14} className="text-[#e5cf87]" />
                    <div>
                      <span className="font-semibold block">Ficha en Texto (.TXT)</span>
                      <span className="text-[10px] text-[#808388]">Plantilla oficial Sistema P.A.P.A.</span>
                    </div>
                  </button>

                  <button
                    onClick={handleDownloadMd}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#ede8df] hover:bg-[#2e3035] rounded-lg transition-colors text-left"
                  >
                    <FileText size={14} className="text-sky-400" />
                    <div>
                      <span className="font-semibold block">Markdown (.MD)</span>
                      <span className="text-[10px] text-[#808388]">Formato con formato para notas</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Copy Markdown */}
            <button
              onClick={handleCopyMarkdown}
              title="Copiar plantilla Markdown de Sistema PAPA"
              className="p-1.5 rounded-lg bg-[#28292c] hover:bg-[#323337] text-[#a4a7ac] hover:text-[#ede8df] border border-[#3b3d42] transition-colors"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>

            {/* Duplicate */}
            {onDuplicate && (
              <button
                onClick={() => onDuplicate(item)}
                title="Duplicar como plantilla"
                className="p-1.5 rounded-lg bg-[#28292c] hover:bg-[#323337] text-[#a4a7ac] hover:text-[#ede8df] border border-[#3b3d42] transition-colors"
              >
                <Share2 size={14} />
              </button>
            )}

            {/* Edit */}
            {onEdit && (
              <button
                onClick={() => onEdit(item)}
                title="Editar consumible"
                className="p-1.5 rounded-lg bg-[#28292c] hover:bg-[#323337] text-[#e5cf87] hover:bg-[#e5cf87]/10 border border-[#3b3d42] transition-colors"
              >
                <Edit3 size={14} />
              </button>
            )}

            {/* Delete */}
            {onDelete && (
              <button
                onClick={() => onDelete(item.id)}
                title="Eliminar de mi inventario"
                className="p-1.5 rounded-lg bg-[#28292c] hover:bg-[#c47474]/20 text-[#c47474] border border-[#3b3d42] transition-colors"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Simulator Modal */}
      {isDiceModalOpen && (
        <DiceSimulatorModal
          item={item}
          isOpen={isDiceModalOpen}
          onClose={() => setIsDiceModalOpen(false)}
        />
      )}
    </>
  );
};
