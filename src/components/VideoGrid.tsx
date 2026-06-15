import React from "react";
import { 
  Play, 
  Pause, 
  Trash2, 
  Volume2, 
  VolumeX, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Search, 
  Grid,
  CheckSquare,
  XCircle,
  RefreshCw,
  Smartphone
} from "lucide-react";
import { VideoTemplate } from "../types";

interface VideoGridProps {
  templates: VideoTemplate[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleSound: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onMoveUp: (id: string, e: React.MouseEvent) => void;
  onMoveDown: (id: string, e: React.MouseEvent) => void;
  onBulkAction: (action: string) => void;
  gridCols: number;
  setGridCols: (cols: number) => void;
  thumbSize: "Pequeno" | "Médio" | "Grande";
  setThumbSize: (size: "Pequeno" | "Médio" | "Grande") => void;
  loadCount: number;
  setLoadCount: (count: number) => void;
}

export default function VideoGrid({
  templates,
  selectedId,
  onSelect,
  onToggleSound,
  onDelete,
  onMoveUp,
  onMoveDown,
  onBulkAction,
  gridCols,
  setGridCols,
  thumbSize,
  setThumbSize,
  loadCount,
  setLoadCount,
}: VideoGridProps) {
  // Map gridCols value to tailwind class
  const getColClass = () => {
    switch (gridCols) {
      case 2: return "grid-cols-2";
      case 3: return "grid-cols-3";
      case 4: return "grid-cols-4";
      case 5: return "grid-cols-5";
      case 6: return "grid-cols-6";
      default: return "grid-cols-4";
    }
  };

  // Map thumbnail size to heights
  const getCardHeight = () => {
    switch (thumbSize) {
      case "Pequeno": return "h-36";
      case "Médio": return "h-52";
      case "Grande": return "h-72";
      default: return "h-52";
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0d0e12] h-full text-zinc-300 overflow-hidden select-none">
      {/* Top Controller Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#111219] border-b border-[#1f2130] text-xs">
        {/* Left indicators */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#181a26] border border-[#272a3d] font-bold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Aba 1
          </span>
          <button 
            id="plus_tab"
            onClick={() => alert("Função para criar novas abas de processamento em lote.")}
            className="p-1 px-2 rounded-md bg-zinc-800/40 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all font-bold cursor-pointer"
          >
            + Add
          </button>
        </div>

        {/* Filters and sliders */}
        <div className="flex flex-wrap items-center gap-3.5">
          {/* Volume load count */}
          <div className="flex items-center gap-1.5 font-sans">
            <span className="text-zinc-400">Carregar:</span>
            <input
              type="number"
              value={loadCount}
              onChange={(e) => setLoadCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-14 bg-[#171821] border border-[#272a3d] text-zinc-200 text-center font-semibold rounded py-1 focus:ring-1 focus:ring-emerald-500 font-mono"
            />
          </div>

          {/* Size state */}
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400">Tamanho:</span>
            <select
              value={thumbSize}
              onChange={(e) => setThumbSize(e.target.value as any)}
              className="bg-[#171821] border border-[#272a3d] text-zinc-200 rounded py-1 px-2 focus:ring-1 focus:ring-emerald-500 cursor-pointer font-medium"
            >
              <option value="Pequeno">Pequeno</option>
              <option value="Médio">Médio</option>
              <option value="Grande">Grande</option>
            </select>
          </div>

          {/* Columns count */}
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400">Colunas:</span>
            <select
              value={gridCols}
              onChange={(e) => setGridCols(parseInt(e.target.value))}
              className="bg-[#171821] border border-[#272a3d] text-zinc-200 rounded py-1 px-2 focus:ring-1 focus:ring-emerald-500 cursor-pointer font-mono font-bold"
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4 (Padrão)</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
            </select>
          </div>

          {/* Direct Action Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onBulkAction("load_previews")}
              className="flex items-center gap-1 bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white px-2.5 py-1.5 rounded font-bold transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Carregar Previews
            </button>
            <button
              onClick={() => onBulkAction("pause_all")}
              className="flex items-center gap-1 bg-[#d97706]/10 border border-[#d97706]/30 text-amber-500 hover:bg-amber-600 hover:text-white px-2.5 py-1.5 rounded font-bold transition-all cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5" />
              Pausar
            </button>
            <button
              onClick={() => onBulkAction("select_all")}
              className="flex items-center gap-1 bg-[#1e293b]/50 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-2.5 py-1.5 rounded font-bold transition-all cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              Todos
            </button>
            <button
              onClick={() => onBulkAction("clear_selection")}
              className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 px-2.5 py-1.5 rounded font-medium transition-all cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              Limpar
            </button>
          </div>
        </div>

        {/* Badge metrics counters */}
        <span className="text-[11px] font-mono font-semibold bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-1 rounded">
          {templates.length} video(s)
        </span>
      </div>

      {/* Main Grid View */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl bg-[#111219]/40 border border-dashed border-[#1f2130] my-8">
            <Grid className="w-10 h-10 text-zinc-600 mb-2.5" />
            <h3 className="text-zinc-400 font-bold">Nenhum clipe de fundo carregado</h3>
            <p className="text-zinc-500 text-xs mt-1 max-w-sm">
              Use as opções de importação na barra lateral ou gere um roteiro com IA para preencher o cronograma do lote.
            </p>
          </div>
        ) : (
          <div className={`grid ${getColClass()} gap-4`}>
            {templates.slice(0, loadCount).map((item) => {
              const isSelected = selectedId === item.id;
              
              return (
                <div
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  className={`flex flex-col rounded-xl overflow-hidden transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "ring-2 ring-emerald-500 border-transparent shadow-lg shadow-emerald-950/40 transform scale-[1.01]"
                      : "border border-[#202232] bg-[#141520] hover:border-[#30334d]"
                  }`}
                >
                  {/* Portrait aspect preview container (9:16 fallback) */}
                  <div className={`relative ${getCardHeight()} w-full overflow-hidden flex items-center justify-center bg-gradient-to-b ${item.thumbnailColor} shadow-inner`}>
                    {item.mockVideoUrl ? (
                      <video
                        src={item.mockVideoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover z-0"
                      />
                    ) : (
                      /* Atmospheric background shapes / dynamic patterns */
                      <div className="absolute inset-0 opacity-15 overflow-hidden">
                        <div className="absolute w-28 h-28 rounded-full bg-white/20 filter blur-xl animate-pulse -top-4 -left-4"></div>
                        <div className="absolute w-36 h-36 rounded-full bg-black/40 filter blur-xl -bottom-8 -right-8"></div>
                      </div>
                    )}
                    
                    {/* Visual indicators overlay */}
                    <span className="absolute top-2 left-2 text-[9px] font-bold font-mono tracking-wider bg-black/75 text-zinc-300 px-1.5 py-0.5 rounded">
                      {item.duracao}
                    </span>

                    {isSelected && (
                      <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center border-2 border-emerald-500 animate-pulse-slow">
                        <span className="bg-emerald-500 text-white rounded-full p-1 text-[10px] font-black tracking-widest px-2.5 shadow-sm shadow-emerald-950/55">
                          ATIVO
                        </span>
                      </div>
                    )}

                    {/* Clip Category Tag */}
                    <span className="absolute bottom-2 left-2 text-[9px] font-semibold text-white bg-zinc-900/90 border border-zinc-800/80 px-1.5 py-0.5 rounded shadow">
                      {item.categoria}
                    </span>

                    {/* Simulation frame representation */}
                    <div className="flex flex-col items-center gap-1">
                      <Smartphone className="w-8 h-8 text-white/50" />
                      <span className="text-[10px] text-white/80 font-bold px-2 py-0.5 rounded bg-black/40 text-center uppercase tracking-wide">
                        {item.nome.split(".")[0]}
                      </span>
                    </div>
                  </div>

                  {/* Title Label info */}
                  <div className="px-2 py-1.5 bg-[#0e0f16] border-b border-[#202232]">
                    <span className="text-[10px] text-zinc-400 font-bold block truncate text-center">
                      {item.nome}
                    </span>
                  </div>

                  {/* Control pad directly underneath */}
                  <div className="grid grid-cols-4 bg-[#141622] text-[#059669] border-[#202232] text-xs font-semibold select-none divide-x divide-zinc-800/60">
                    <button
                      onClick={(e) => onMoveUp(item.id, e)}
                      title="Mover para cima"
                      className="py-2.5 flex items-center justify-center hover:bg-zinc-800/40 text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => onMoveDown(item.id, e)}
                      title="Mover para baixo"
                      className="py-2.5 flex items-center justify-center hover:bg-zinc-800/40 text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => onToggleSound(item.id, e)}
                      title="Alternar Áudio"
                      className="py-2.5 flex items-center justify-center hover:bg-zinc-800/40 text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      {item.selected ? (
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                      )}
                    </button>
                    <button
                      onClick={(e) => onDelete(item.id, e)}
                      title="Excluir item"
                      className="py-2.5 flex items-center justify-center hover:bg-red-950/20 text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
