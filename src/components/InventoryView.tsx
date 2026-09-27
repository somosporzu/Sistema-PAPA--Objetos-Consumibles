import React, { useState, useMemo, useRef } from 'react';
import { ConsumableItem } from '../types/papa';
import { ConsumableCard } from './ConsumableCard';
import { 
  Package, 
  Search, 
  Download, 
  Upload, 
  Printer, 
  Plus, 
  Trash2, 
  AlertCircle,
  FileJson,
  X
} from 'lucide-react';

interface InventoryViewProps {
  items: ConsumableItem[];
  onEditItem: (item: ConsumableItem) => void;
  onDeleteItem: (id: string) => void;
  onDuplicateItem: (item: ConsumableItem) => void;
  onImportItems: (imported: ConsumableItem[]) => void;
  onCreateNew: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  items,
  onEditItem,
  onDeleteItem,
  onDuplicateItem,
  onImportItems,
  onCreateNew
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesEffect = item.effect.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        if (!matchesName && !matchesEffect && !matchesCategory) return false;
      }
      return true;
    });
  }, [items, searchTerm]);

  // Export all to JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `consumibles_papa_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import from JSON
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          onImportItems(json);
          alert(`Se importaron ${json.length} consumibles exitosamente.`);
        } else if (json.name && json.category) {
          onImportItems([json]);
          alert(`Se importó 1 consumible exitosamente.`);
        } else {
          alert('El archivo JSON no tiene un formato válido de consumibles.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON: ' + (err as Error).message);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Print all cards for physical table play
  const handlePrintCards = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="no-print p-5 rounded-2xl bg-gradient-to-r from-[#242529] via-[#1d1e21] to-[#28292d] border border-[#3c3e44] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#e5cf87]">
            <Package size={14} />
            <span>Alijo de Campaña</span>
          </div>
          <h2 className="font-serif font-black text-2xl text-[#ede8df] mt-1">
            Mi Inventario de Consumibles
          </h2>
          <p className="text-xs text-[#a4a7ac] max-w-xl mt-1 leading-relaxed">
            Consumibles personalizados creados por vos para tu personaje o partida. Guardados en tu navegador, listos para tirar dados, exportar en JSON o imprimir en cartas físicas para la mesa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onCreateNew}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-lg bg-[#c47474] hover:bg-[#d68585] text-white text-xs font-bold font-serif tracking-wide shadow transition-all"
          >
            <Plus size={15} />
            <span>Crear Consumible</span>
          </button>

          {items.length > 0 && (
            <>
              <button
                onClick={handlePrintCards}
                title="Imprimir cartas para recortar"
                className="flex items-center gap-1.5 py-2 px-3 rounded-lg bg-[#28292c] hover:bg-[#34363b] text-[#ede8df] text-xs font-semibold border border-[#3f4247] transition-colors"
              >
                <Printer size={14} />
                <span>Imprimir Cartas</span>
              </button>

              <button
                onClick={handleExportJSON}
                title="Descargar archivo JSON"
                className="flex items-center gap-1.5 py-2 px-3 rounded-lg bg-[#28292c] hover:bg-[#34363b] text-[#ede8df] text-xs font-semibold border border-[#3f4247] transition-colors"
              >
                <Download size={14} />
                <span>Exportar JSON</span>
              </button>
            </>
          )}

          <label className="flex items-center gap-1.5 py-2 px-3 rounded-lg bg-[#28292c] hover:bg-[#34363b] text-[#ede8df] text-xs font-semibold border border-[#3f4247] cursor-pointer transition-colors">
            <Upload size={14} />
            <span>Importar</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Search Bar */}
      {items.length > 0 && (
        <div className="no-print relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#808388]" size={16} />
          <input
            type="text"
            placeholder="Buscar consumibles guardados por nombre o efecto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1c1d1f] border border-[#3f4247] rounded-lg pl-10 pr-10 py-2.5 text-xs text-[#ede8df] placeholder-[#808388] focus:border-[#c47474] outline-none"
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
      )}

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="text-center py-16 px-4 bg-[#212225] border border-dashed border-[#3a3c42] rounded-2xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#2d1e22] text-[#c47474] flex items-center justify-center mx-auto border border-[#c47474]/40">
            <Package size={30} />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#ede8df]">
              Tu inventario está vacío
            </h3>
            <p className="text-xs text-[#a4a7ac] max-w-md mx-auto mt-1 leading-relaxed">
              Aún no has creado ni guardado ningún consumible personalizado. Podés diseñar pociones, aceites, bombas y sellos desde el Creador o cargar plantillas oficiales.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onCreateNew}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c47474] hover:bg-[#d68585] text-white text-xs font-bold font-serif shadow-md transition-all"
            >
              <Plus size={16} />
              <span>Diseñar mi Primer Consumible</span>
            </button>
          </div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 px-4 bg-[#212225] border border-[#3a3c42] rounded-2xl">
          <p className="text-sm text-[#a4a7ac]">
            No se encontraron consumibles con el término "{searchTerm}".
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-2 text-xs text-[#e5cf87] hover:underline font-semibold"
          >
            Limpiar búsqueda
          </button>
        </div>
      ) : (
        /* Grid of Saved Items */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredItems.map(item => (
            <ConsumableCard
              key={item.id}
              item={item}
              onEdit={onEditItem}
              onDelete={onDeleteItem}
              onDuplicate={onDuplicateItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};
