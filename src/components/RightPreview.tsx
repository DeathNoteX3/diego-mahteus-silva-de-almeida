import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  Trash2, 
  Maximize2,
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Sliders, 
  Smartphone,
  Scissors,
  Share2,
  HelpCircle,
  Clock
} from "lucide-react";
import { EditorConfig, CenaEdicao, VideoTemplate } from "../types";

interface RightPreviewProps {
  config: EditorConfig;
  onChange: (updater: (prev: EditorConfig) => EditorConfig) => void;
  activeTemplate: VideoTemplate | null;
  activeScene: CenaEdicao | null;
  scenesCount: number;
  activeSceneIndex: number | null;
  onSelectSceneIndex: (index: number) => void;
  onChangeSubtitle: (text: string) => void;
  onApplyPreset: () => void;
}

export default function RightPreview({
  config,
  onChange,
  activeTemplate,
  activeScene,
  scenesCount,
  activeSceneIndex,
  onSelectSceneIndex,
  onChangeSubtitle,
  onApplyPreset,
}: RightPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [trimStart, setTrimStart] = useState(15); // percentage
  const [trimEnd, setTrimEnd] = useState(85); // percentage
  const [showTrimSuccess, setShowTrimSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Simulated playback timer for rendering overlays nicely
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.1;
          if (next > 15) {
            return 0; // loop at 15s max short video length
          }
          return next;
        });
      }, 100);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Sync active scene index proportionally to current simulated time if playing
  useEffect(() => {
    if (isPlaying && scenesCount > 0) {
      // 15 seconds split by scenes count
      const durationPerScene = 15 / scenesCount;
      const computedIndex = Math.min(Math.floor(currentTime / durationPerScene), scenesCount - 1);
      if (computedIndex !== activeSceneIndex) {
        onSelectSceneIndex(computedIndex);
      }
    }
  }, [currentTime, isPlaying, scenesCount, activeSceneIndex]);

  // Determine what background visualization pattern to offer based on active style
  const getSimulatedBackgroundStyle = (): React.CSSProperties => {
    if (!activeTemplate) {
      return { background: "linear-gradient(135deg, #111115, #1d1d2b)" };
    }
    
    // Choose gradient based on template fallback colors
    const col = activeTemplate.thumbnailColor;
    if (col.includes("from-pink-900")) {
      return { background: "linear-gradient(135deg, #3d0312, #5c0e25, #9d174d)" };
    }
    if (col.includes("from-amber-800")) {
      return { background: "linear-gradient(135deg, #351401, #5f2408, #b45309)" };
    }
    if (col.includes("from-cyan-900")) {
      return { background: "linear-gradient(135deg, #022019, #044e39, #0d7470)" };
    }
    if (col.includes("from-violet-950")) {
      return { background: "linear-gradient(135deg, #1e0a3d, #3b0764, #6366f1)" };
    }
    if (col.includes("from-emerald-950")) {
      return { background: "linear-gradient(135deg, #022019, #065f46, #10b981)" };
    }
    if (col.includes("from-neutral-900")) {
      return { background: "linear-gradient(135deg, #12100e, #292524, #0c0a09)" };
    }
    if (col.includes("from-yellow-950")) {
      return { background: "linear-gradient(135deg, #201401, #453202, #db2777)" };
    }
    
    return { background: "linear-gradient(135deg, #08080a, #13131a)" };
  };

  const nextScene = () => {
    if (scenesCount === 0) return;
    const current = activeSceneIndex ?? 0;
    const nextIdx = (current + 1) % scenesCount;
    onSelectSceneIndex(nextIdx);
    setCurrentTime(nextIdx * (15 / scenesCount));
  };

  const prevScene = () => {
    if (scenesCount === 0) return;
    const current = activeSceneIndex ?? 0;
    const nextIdx = (current - 1 + scenesCount) % scenesCount;
    onSelectSceneIndex(nextIdx);
    setCurrentTime(nextIdx * (15 / scenesCount));
  };

  const handleApplyTrim = () => {
    setShowTrimSuccess(true);
    setTimeout(() => {
      setShowTrimSuccess(false);
    }, 2550);
  };

  return (
    <div className="w-[340px] xl:w-[380px] bg-[#0C0C0F] border-l border-white/5 h-full flex flex-col select-none font-sans scrollbar-thin">
      {/* Header Info */}
      <div className="p-3 bg-[#111114] border-b border-white/5 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase font-sans">
          <Smartphone className="w-4 h-4 text-indigo-400" />
          <span>👁 Preview - Em tempo real</span>
        </div>

        {/* Action controls row */}
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <button
            onClick={onApplyPreset}
            className="bg-indigo-600 hover:bg-indigo-500 font-extrabold text-[10px] text-white px-2.5 py-1 rounded transition-colors uppercase cursor-pointer block border border-indigo-500/20"
          >
            Aplicar
          </button>

          {/* Scene selector info arrow keys */}
          <div className="ml-auto flex items-center bg-[#16161A] px-2 py-0.5 rounded border border-white/5 text-[10px]">
            <button 
              disabled={scenesCount === 0}
              onClick={prevScene} 
              className="p-1 hover:text-white disabled:pointer-events-none disabled:text-zinc-700 cursor-pointer text-slate-400"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-semibold px-1 text-slate-300 select-all font-mono">
              Legenda {(activeSceneIndex ?? 0) + 1}/{Math.max(1, scenesCount)}
            </span>
            <button 
              disabled={scenesCount === 0} 
              onClick={nextScene} 
              className="p-1 hover:text-white disabled:pointer-events-none disabled:text-zinc-700 cursor-pointer text-slate-400"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => onSelectSceneIndex(0)}
            className="p-1 bg-[#16161A] border border-white/5 rounded hover:text-rose-400 text-slate-500 transition cursor-pointer"
            title="Remover Legenda"
          >
            <Trash2 className="w-3 h-3" />
          </button>

          {/* Resizing subtitles slider */}
          <div className="flex items-center gap-1 bg-[#16161A] px-1.5 py-1 rounded border border-white/5 text-[9.5px]">
            <span className="text-slate-400 font-bold">Tam:</span>
            <input
              type="number"
              value={config.individualTextSize}
              onChange={(e) => onChange(prev => ({ ...prev, individualTextSize: Math.max(10, parseInt(e.target.value) || 24) }))}
              className="w-7 bg-transparent border-none p-0 text-center text-indigo-400 font-bold font-mono focus:ring-0 text-[10px]"
            />
          </div>
        </div>
      </div>

      {/* Main View Area of active smartphone */}
      <div className="flex-1 flex items-center justify-center p-3 overflow-y-auto scrollbar-none bg-[#08080a]">
        
        {/* Render a highly styled simulated iphone portrait screen wrap wrapper (9:16) */}
        <div 
          ref={containerRef}
          className="relative w-[210px] sm:w-[240px] xl:w-[260px] h-[375px] sm:h-[425px] xl:h-[460px] bg-black rounded-[36px] p-2 index shadow-[0_0_40px_rgba(0,0,0,0.9)] border-[5px] border-[#16161A] flex flex-col overflow-hidden"
        >
          {/* Dynamic Speaker cutout */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-black rounded-full z-30 flex items-center justify-center p-0.5">
            <div className="w-2 h-2 rounded-full bg-zinc-850/80 mr-1.5"></div>
            <div className="w-8 h-1 bg-zinc-900 rounded-full"></div>
          </div>

          {/* Active Canvas / Simulated video loop content */}
          <div 
            style={
              !config.postHabilitado 
                ? getSimulatedBackgroundStyle() 
                : config.postLayoutType === "torn_neon"
                ? { 
                    backgroundColor: "#0d0d11", 
                    backgroundImage: "radial-gradient(#1c1c24 1.5px, transparent 1.5px)", 
                    backgroundSize: "14px 14px"
                  }
                : config.postLayoutType === "centered_card"
                ? { backgroundColor: "#08080a" }
                : { background: config.postTema === "Escuro" ? "#0F1419" : "#ffffff" }
            }
            className="relative flex-1 rounded-[28px] overflow-hidden flex flex-col justify-between p-4 flex-nowrap select-none transition-all duration-300"
          >
            {config.postHabilitado ? (
              // MULTI-LAYOUT COMPOSITION DECK
              config.postLayoutType === "torn_neon" ? (
                // LAYOUT B: TORN PAPER NEON (Image 2)
                <div className="absolute inset-0 z-20 flex flex-col select-none p-3 justify-between items-center h-full w-full">
                  {/* Floating Circular avatar overlaps standard torn paper sheet */}
                  <div className="z-30 -mb-5 relative shrink-0">
                    <div className="w-14 h-14 rounded-full border-2 border-white shadow-md bg-gradient-to-tr from-sky-300 to-emerald-305 overflow-hidden flex items-center justify-center p-0.5">
                      <img 
                        src={config.postAvatarUrl || "https://images.unsplash.com/photo-1543351611-58f621151404?w=150&auto=format&fit=crop&q=60"} 
                        alt="Avatar"
                        referrerPolicy="no-referrer"
                        className="rounded-full object-cover w-full h-full"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.src = "https://images.unsplash.com/photo-1543351611-58f621151404?w=150&auto=format&fit=crop&q=60";
                        }}
                      />
                    </div>
                  </div>

                  {/* Torn Card Body block */}
                  <div className="relative flex-1 w-[92%] bg-gradient-to-b from-[#e8eff6] to-[#f4f7fa] border border-[#d1dae3] shadow-[0_4px_16px_rgba(0,0,0,0.15)] rounded-t-3xl rounded-b-[40px] overflow-hidden flex flex-col justify-between pt-7 pb-3 px-3 z-25">
                    {/* Visual ripped-zigzag paper notches */}
                    <div className="absolute top-0 left-0 right-0 h-1 flex justify-between overflow-hidden opacity-30 select-none pointer-events-none">
                      {Array.from({ length: 40 }).map((_, idx) => (
                        <div key={idx} className="w-1.5 h-1.5 bg-neutral-800 rotate-45 transform -translate-y-1"></div>
                      ))}
                    </div>

                    {/* Headline overlay within the torn body */}
                    <div className="text-center px-1 mb-2">
                      <h4 className="text-[9px] font-black uppercase text-slate-500 tracking-wider">
                        {config.postNomeUsuario || "Momento de Glória"}
                      </h4>
                      <h3 className="text-slate-800 font-extrabold text-[12px] leading-tight select-text tracking-tight mt-0.5 whitespace-pre-wrap">
                        {config.postTexto || "Sua headline motivacional ou tema do lote em massa"}
                      </h3>
                    </div>

                    {/* Nested Media container representing the landscape template view */}
                    <div className="flex-1 relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-black flex flex-col justify-end">
                      <div 
                        style={{
                          transform: `scale(${config.videoScale}) translate(${config.videoPosX}px, ${config.videoPosY}px) ${config.inverterIndividual ? "scaleX(-1)" : ""}`,
                        }}
                        className="absolute inset-0 z-0 flex items-center justify-center"
                      >
                        {activeTemplate?.mockVideoUrl ? (
                          <video
                            src={activeTemplate.mockVideoUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 animate-pulse" style={getSimulatedBackgroundStyle()} />
                        )}
                        <div className="absolute top-2 left-2 bg-white/20 backdrop-blur-md rounded-full px-2 py-0.5 text-[8px] font-bold text-white flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-sky-200"></span>
                          Visual
                        </div>
                        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                      </div>

                      {/* Floating Cloud element on lower area */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                        <svg className="w-10 h-10 text-white fill-current" viewBox="0 0 24 24">
                          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
                        </svg>
                      </div>

                      {/* Floating watermark inside Layout B media */}
                      {config.postExibirMarca && config.textoMarcaAgua && (
                        <div 
                          style={{
                            left: `${config.posHorizMarca}%`,
                            bottom: `${config.posVertMarca}%`,
                            opacity: config.opacidadeMarca / 100,
                            fontSize: `${config.tamanhoMarca / 2.5}px`,
                            fontFamily: config.fonteCustomizadaPCAgua ? config.fonteCustomizadaPCAgua : (config.fonteMarca === "Space Grotesk" ? "sans-serif" : config.fonteMarca === "JetBrains Mono" ? "monospace" : config.fonteMarca),
                            color: config.corMarca,
                            backgroundColor: config.ativarFundoMarca 
                              ? (config.corFundoMarca === "red" ? "rgba(239, 68, 68, 0.75)" : config.corFundoMarca === "blue" ? "rgba(30, 41, 59, 0.75)" : "rgba(0, 0, 0, 0.65)")
                              : "transparent",
                          }}
                          className="absolute z-20 -translate-x-1/2 px-1.5 py-0.5 rounded shadow text-shadow font-black tracking-widest whitespace-nowrap"
                        >
                          {config.textoMarcaAgua}
                        </div>
                      )}

                      {/* Visual Progress tracking inside torn media card */}
                      <div className="relative z-10 h-0.5 bg-indigo-500" style={{ width: `${(currentTime / 15) * 100}%` }}></div>
                    </div>

                    {/* Stylized Bubble neon-pink heading at the bottom of the card like Image 2 */}
                    {config.postExibirLegendas ? (
                      <div className="mt-2 text-center relative z-10 rotate-[-1deg] select-text w-full">
                        <textarea
                          style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            textShadow: "0 0 4px #ff59b3, 0 0 8px #ff007f, 0 1px 3px rgba(0,0,0,0.5)",
                            color: "#fff",
                            fontSize: `${Math.max(10, config.individualTextSize / 1.8)}px`,
                          }}
                          value={activeScene ? activeScene.texto_legenda : "MOMENTOS DE GLÓRIA 💖"}
                          onChange={(e) => onChangeSubtitle(e.target.value)}
                          placeholder="MOMENTOS DE GLÓRIA 💖"
                          rows={2}
                          className="w-full bg-transparent border-none text-center font-extrabold focus:outline-none focus:ring-0 outline-none leading-tight uppercase select-text px-1 max-h-12 overflow-hidden break-words resize-none cursor-text animate-pulse-slow font-sans"
                        />
                      </div>
                    ) : (
                      <div className="mt-2 mb-1 text-center text-slate-400 font-semibold select-none text-[8.5px] uppercase tracking-wider">
                        [Legenda Oculta]
                      </div>
                    )}
                  </div>

                  <div className="text-[7px] font-mono text-slate-500 tracking-widest pt-1 uppercase">
                    ⚡ Torn-Paper Neon VLOT v2
                  </div>
                </div>
              ) : config.postLayoutType === "centered_card" ? (
                // LAYOUT C: CENTERED SUBTITLE CARD OVER FULL MEDIASKIN (Image 3)
                <div className="absolute inset-0 z-20 flex flex-col justify-center items-center p-3 select-none h-full w-full">
                  <div 
                    style={{
                      transform: `scale(${config.videoScale}) translate(${config.videoPosX}px, ${config.videoPosY}px) ${config.inverterIndividual ? "scaleX(-1)" : ""}`,
                    }}
                    className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
                  >
                    {activeTemplate?.mockVideoUrl ? (
                      <video
                        src={activeTemplate.mockVideoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 animate-pulse-slow" style={getSimulatedBackgroundStyle()} />
                    )}
                    <div className="absolute inset-0 bg-black/40" />
                  </div>

                  {/* Perfectly centered high-contrast floating card overlay like Image 3 */}
                  {config.postExibirLegendas ? (
                    <div 
                      className="relative z-10 w-[88%] bg-white rounded-xl py-5 px-4 text-center shadow-[0_12px_45px_rgba(0,0,0,0.45)] border border-slate-100 flex flex-col justify-center gap-1 cursor-text transition-all duration-150"
                    >
                      {/* Small visual card anchor notch */}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-indigo-500 rounded-full opacity-60"></div>

                      {/* Quote text display area in center */}
                      <textarea
                        style={{
                          fontFamily: config.fonteCustomizadaPC ? config.fonteCustomizadaPC : "sans-serif",
                          fontSize: `${Math.max(12, config.individualTextSize / 1.5)}px`,
                          color: "#0f172a",
                        }}
                        value={activeScene ? activeScene.texto_legenda : "Pediu ajuda para a pessoa errada! 😂 🩹"}
                        onChange={(e) => onChangeSubtitle(e.target.value)}
                        placeholder="Digite o texto do card motivacional aqui..."
                        rows={3}
                        className="w-full bg-transparent border-none text-center font-extrabold focus:outline-none focus:ring-0 outline-none leading-snug tracking-tight text-slate-855 select-text font-sans resize-none placeholder:text-slate-350 cursor-text scrollbar-none"
                      />

                      {/* Small watermark link at footer of cards */}
                      {config.postExibirMarca && config.textoMarcaAgua && (
                        <span className="text-[8px] font-semibold text-slate-400 tracking-wider uppercase mt-1">
                          🎬 {config.textoMarcaAgua}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="relative z-10 bg-black/75 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl text-[9px] text-white/50 font-bold uppercase tracking-wider select-none text-center">
                      🎬 Legendas Desativadas
                    </div>
                  )}

                  {/* Floating Watermark for Layout C when legendas are disabled or as an absolute overlay */}
                  {config.postExibirMarca && config.textoMarcaAgua && !config.postExibirLegendas && (
                    <div 
                      style={{
                        left: `${config.posHorizMarca}%`,
                        bottom: `${config.posVertMarca}%`,
                        opacity: config.opacidadeMarca / 100,
                        fontSize: `${config.tamanhoMarca / 2.5}px`,
                        fontFamily: config.fonteCustomizadaPCAgua ? config.fonteCustomizadaPCAgua : (config.fonteMarca === "Space Grotesk" ? "sans-serif" : config.fonteMarca === "JetBrains Mono" ? "monospace" : config.fonteMarca),
                        color: config.corMarca,
                        backgroundColor: config.ativarFundoMarca 
                          ? (config.corFundoMarca === "red" ? "rgba(239, 68, 68, 0.75)" : config.corFundoMarca === "blue" ? "rgba(30, 41, 59, 0.75)" : "rgba(0, 0, 0, 0.65)")
                          : "transparent",
                      }}
                      className="absolute z-20 -translate-x-1/2 px-1.5 py-0.5 rounded shadow text-shadow font-black tracking-widest whitespace-nowrap"
                    >
                      {config.textoMarcaAgua}
                    </div>
                  )}

                  {/* Small absolute progress bar */}
                  <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between text-[7px] font-mono text-white/60 bg-black/50 backdrop-blur-md py-1 px-2.5 rounded-full border border-white/5">
                    <span>{currentTime.toFixed(1)}s</span>
                    <div className="flex-1 mx-2 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div style={{ width: `${(currentTime / 15) * 100}%` }} className="h-full bg-indigo-500" />
                    </div>
                    <span>15s</span>
                  </div>
                </div>
              ) : (
                // LAYOUT A: STANDARD SOCIAL TWEET POST WITH UNDERLAY VIDEO (Image 1)
                <div className="absolute inset-0 z-20 flex flex-col p-4 select-none font-sans justify-start gap-y-2.5 overflow-hidden h-full w-full">
                  {/* 1. Header Profile block */}
                  <div 
                    style={{
                      transform: `translateY(${Math.min(0, config.postVideoPosY || 0)}px)`,
                    }}
                    className="space-y-3 pt-2 transition-transform duration-150"
                  >
                    <div className="flex items-center gap-2">
                      {/* Round Avatar and its container */}
                      <div key={config.postAvatarUrl || "default"} className="relative shrink-0 select-none">
                        <img 
                          src={config.postAvatarUrl || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=60"} 
                          alt="Avatar" 
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.style.display = 'none';
                            const sibling = img.nextElementSibling;
                            if (sibling) {
                              sibling.classList.remove('hidden');
                            }
                          }}
                          className="rounded-full object-cover border border-black/10 shrink-0" 
                          style={{ 
                            width: `${config.postAvatarSize}px`, 
                            height: `${config.postAvatarSize}px` 
                          }}
                        />
                        <div 
                          className="avatar-fallback hidden rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center font-bold text-xs text-white shrink-0 uppercase select-none border border-black/10"
                          style={{ 
                            width: `${config.postAvatarSize}px`, 
                            height: `${config.postAvatarSize}px` 
                          }}
                        >
                          {config.postNomeUsuario ? config.postNomeUsuario.substring(0, 2) : "FC"}
                        </div>
                      </div>

                      {/* Name and Handle tag */}
                      <div className="flex-1 min-w-0 leading-tight">
                        <div className="flex items-center gap-1">
                          <span 
                            style={{ 
                              fontSize: `${config.postPerfilSize}px`,
                              fontFamily: config.fonteCustomizadaPC || "inherit"
                            }}
                            className={`font-black tracking-tight truncate ${config.postTema === "Escuro" ? "text-white" : "text-[#0F1419]"}`}
                          >
                            {config.postNomeUsuario || "Football Central"}
                          </span>
                          {config.postCheckVerificado && (
                            <svg viewBox="0 0 24 24" aria-label="Conta verificada" className="w-3.5 h-3.5 text-sky-500 fill-current shrink-0 select-none inline">
                              <g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.99-3.818-3.99-.48 0-.94.1-1.348.27C14.825 2.515 13.512 1.5 12 1.5s-2.825 1.015-3.422 2.28c-.407-.17-.867-.27-1.348-.27-2.108 0-3.818 1.78-3.818 3.99 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.71 3.99 3.818 3.99.48 0 .94-.1 1.348-.27.597 1.265 1.91 2.28 3.422 2.28s2.825-1.515 3.422-2.28c.407.17.867.27 1.348.27 2.108 0 3.818-1.78 3.818-3.99 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.5 4.5l-4-4 1.414-1.414L10 14.172l6.586-6.586L18 9l-8 8z"></path></g>
                            </svg>
                          )}
                        </div>
                        <span 
                          style={{ 
                            fontSize: `${Math.max(8, config.postPerfilSize - 2)}px`,
                            fontFamily: config.fonteCustomizadaPC || "inherit"
                          }}
                          className={`block font-normal truncate select-text ${config.postTema === "Escuro" ? "text-slate-400" : "text-slate-500"}`}
                        >
                          {config.postIdentificador || "@yourfootballcentra"}
                        </span>
                      </div>
                    </div>

                    {/* 2. Headline Title text */}
                    <h3 
                      style={{ 
                        fontSize: `${config.postHeadlineSize}px`,
                        marginTop: `${config.postHeadlineMarginTop}px`,
                        textAlign: config.postHeadlineAlign === "Center" ? "center" : config.postHeadlineAlign === "Right" ? "right" : "left",
                        fontFamily: config.fonteCustomizadaPC || "inherit"
                      }}
                      className={`leading-snug font-bold break-words ${config.postTema === "Escuro" ? "text-white" : "text-[#0F1419]"}`}
                    >
                      {config.postTexto || "Roteiro/Tema em massa gerado..."}
                    </h3>
                  </div>

                  {/* 3. Media block */}
                  <div 
                    style={{
                      width: `${config.postVideoWidth}%`,
                      height: `${config.postVideoHeight}px`,
                      borderRadius: `${config.postVideoRadius}px`,
                      marginTop: `${config.postVideoMarginTop}px`,
                      transform: `translate(${config.postVideoPosX || 0}px, ${config.postVideoPosY || 0}px)`,
                    }}
                    className="relative self-center overflow-hidden border border-slate-100/10 shadow-lg flex flex-col justify-end bg-black shrink-0 transition-all duration-150"
                  >
                    
                    {/* Underlay video simulator container */}
                    <div 
                      style={{
                        transform: `scale(${config.videoScale}) translate(${config.videoPosX}px, ${config.videoPosY}px) ${config.inverterIndividual ? "scaleX(-1)" : ""}`,
                      }}
                      className="absolute inset-0 z-0 flex items-center justify-center transition-transform duration-300"
                    >
                      {activeTemplate?.mockVideoUrl ? (
                        <video
                          src={activeTemplate.mockVideoUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div 
                          className="absolute inset-0 animate-pulse-slow" 
                          style={{
                            ...getSimulatedBackgroundStyle(),
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                      )}
                      <div className="absolute inset-0 bg-black/25 pointer-events-none" />
                    </div>

                    {/* Legenda (overlay) inside the rounded media clip block */}
                    {config.postExibirLegendas && (
                      <div className="relative z-10 p-2 text-center w-full min-h-[46px] flex items-center justify-center">
                        <textarea
                          style={{
                            fontFamily: config.fonteCustomizadaPC ? config.fonteCustomizadaPC : (config.individualTextFont === "Space Grotesk" ? "sans-serif" : config.individualTextFont === "JetBrains Mono" ? "monospace" : config.individualTextFont),
                            color: config.individualTextColor,
                            fontSize: `${Math.max(10, config.individualTextSize / 2)}px`,
                          }}
                          value={activeScene ? activeScene.texto_legenda : ""}
                          onChange={(e) => onChangeSubtitle(e.target.value)}
                          placeholder="CLIQUE PARA EDITAR A LEGENDA DO SHORTS"
                          rows={2}
                          className="w-full bg-transparent border-none focus:outline-none focus:ring-0 outline-none text-center font-black leading-tight tracking-tight uppercase select-text px-1 text-shadow-md drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] max-h-16 overflow-hidden break-words placeholder:text-slate-400 whitespace-pre-wrap shrink-0 cursor-text animate-pulse-slow"
                        />
                      </div>
                    )}

                    {/* Watermark positioner */}
                    {config.postExibirMarca && config.textoMarcaAgua && (
                      <div 
                        style={{
                          left: `${config.posHorizMarca}%`,
                          bottom: `${config.posVertMarca + 15}%`,
                          opacity: config.opacidadeMarca / 100,
                          fontSize: `${config.tamanhoMarca / 2.5}px`,
                          fontFamily: config.fonteCustomizadaPCAgua ? config.fonteCustomizadaPCAgua : (config.fonteMarca === "Space Grotesk" ? "sans-serif" : config.fonteMarca === "JetBrains Mono" ? "monospace" : config.fonteMarca),
                          color: config.corMarca,
                          backgroundColor: config.ativarFundoMarca ? "rgba(0, 0, 0, 0.65)" : "transparent",
                        }}
                        className="absolute z-10 -translate-x-1/2 px-1.5 py-0.5 rounded shadow text-shadow font-black tracking-widest whitespace-nowrap"
                      >
                        {config.textoMarcaAgua}
                      </div>
                    )}

                    {/* Video duration progress segment track */}
                    <div className="relative z-20 p-2 bg-black/85 backdrop-blur-sm self-stretch flex items-center justify-between text-[7px] font-mono text-white border-t border-white/5">
                      <span>{currentTime.toFixed(1)}s</span>
                      <div className="flex-1 mx-2 h-1 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${(currentTime / 15) * 100}%` }}
                          className="h-full bg-indigo-500"
                        />
                      </div>
                      <span>15.0s</span>
                    </div>
                  </div>
                </div>
              )
            ) : (
              // DEFAULT VERTICAL FULLSCREEN MEDIA MODE
              <>
                {activeTemplate?.mockVideoUrl && (
                  <video
                    src={activeTemplate.mockVideoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    style={{
                      transform: `scale(${config.videoScale}) translate(${config.videoPosX}px, ${config.videoPosY}px) ${config.inverterIndividual ? "scaleX(-1)" : ""}`,
                    }}
                  />
                )}
                {/* Ambient overlay shadows for luxury cinematic look */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 pointer-events-none z-10"></div>
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/30 pointer-events-none z-10"></div>

                {/* Video scaling/cropping translation simulation */}
                <div 
                  style={{
                    transform: `scale(${config.videoScale}) translate(${config.videoPosX}px, ${config.videoPosY}px) ${config.inverterIndividual ? "scaleX(-1)" : ""}`,
                  }}
                  className="absolute inset-0 z-0 flex items-center justify-center transition-transform duration-300"
                >
                  {/* Custom floating grid representation for composition layouts */}
                  {!activeTemplate?.mockVideoUrl && (
                    <>
                      <div className="absolute inset-0 opacity-15">
                        <div className="w-full h-full border border-white/5 grid grid-cols-3 grid-rows-3">
                          {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="border border-white/5"></div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Dynamic theme style graphic indicators */}
                      <div className="relative text-center select-none text-white/5 text-[9px] font-mono select-none uppercase tracking-widest font-sans">
                        <span className="block text-xl mb-1 animate-spin-slow">✦</span>
                        <span>Enquadramento Ativo</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Sub-Timeline Progress header display inside screen */}
                <div className="relative z-20 flex justify-between items-center text-[8px] font-mono tracking-tight text-slate-300 font-bold bg-[#111114]/90 px-2 py-1 rounded border border-white/5 self-start">
                  <span>ESTILO: {activeScene?.estilo_visual ? activeScene.estilo_visual.split(",")[0].toUpperCase() : "PADRÃO"}</span>
                </div>

                {/* Subtitles Overlay Panel inside center of video */}
                <div className="relative z-20 flex-1 flex flex-col items-center justify-center p-2">
                  {config.postExibirLegendas ? (
                    <textarea
                      style={{
                        fontFamily: config.fonteCustomizadaPC ? config.fonteCustomizadaPC : (config.individualTextFont === "Space Grotesk" ? "sans-serif" : config.individualTextFont === "JetBrains Mono" ? "monospace" : config.individualTextFont),
                        color: config.individualTextColor,
                        fontSize: `${Math.max(12, config.individualTextSize / 1.6)}px`,
                        transform: `translateY(${config.pixelsDescer / 2}px)`,
                      }}
                      value={activeScene ? activeScene.texto_legenda : ""}
                      onChange={(e) => onChangeSubtitle(e.target.value)}
                      placeholder="CLIQUE PARA EDITAR A LEGENDA DO SHORTS"
                      rows={3}
                      className="w-full bg-transparent border-none focus:outline-none focus:ring-0 outline-none text-center font-black leading-tight tracking-tight uppercase select-text px-2 py-1 text-shadow-md drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] max-w-full h-24 overflow-hidden break-words placeholder:text-slate-500 whitespace-pre-wrap select-all cursor-text focus:border-none"
                    />
                  ) : (
                    <span className="text-[10px] text-white/20 uppercase font-mono tracking-widest border border-white/5 bg-black/40 px-2 py-1 rounded">
                      Legendas Ocultas
                    </span>
                  )}
                </div>

                {/* Watermark brand watermark indicator display */}
                {config.postExibirMarca && config.textoMarcaAgua && (
                  <div 
                    style={{
                      left: `${config.posHorizMarca}%`,
                      bottom: `${config.posVertMarca}%`,
                      opacity: config.opacidadeMarca / 100,
                      fontSize: `${config.tamanhoMarca / 2}px`,
                      fontFamily: config.fonteCustomizadaPCAgua ? config.fonteCustomizadaPCAgua : (config.fonteMarca === "Space Grotesk" ? "sans-serif" : config.fonteMarca === "JetBrains Mono" ? "monospace" : config.fonteMarca),
                      color: config.corMarca,
                      backgroundColor: config.ativarFundoMarca 
                        ? (config.corFundoMarca === "red" ? "rgba(239, 68, 68, 0.75)" : config.corFundoMarca === "blue" ? "rgba(30, 41, 59, 0.75)" : "rgba(0, 0, 0, 0.65)")
                        : "transparent",
                    }}
                    className="absolute z-20 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded shadow text-shadow font-black tracking-widest whitespace-nowrap"
                  >
                    {config.textoMarcaAgua}
                  </div>
                )}

                {/* Video mini progress bar at bottom of mock device */}
                <div className="relative z-20 space-y-1.5 self-stretch">
                  <div className="flex justify-between items-center text-[8px] font-mono font-bold text-slate-350">
                    <span>{currentTime.toFixed(1)}s</span>
                    <span>/ 15.0s</span>
                  </div>
                  <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${(currentTime / 15) * 100}%` }}
                      className="h-full bg-indigo-500 transition-all duration-100"
                    ></div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Quick playback actions under screen */}
          <div className="h-10 py-1 px-4 flex items-center justify-between text-slate-500 text-xs">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 hover:text-white bg-[#111114] border border-white/5 rounded-full text-zinc-300 shadow cursor-pointer transition flex items-center justify-center w-6 h-6"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current text-indigo-400" /> : <Play className="w-3.5 h-3.5 fill-current text-white" />}
            </button>
            <div className="text-[9px] font-mono text-slate-500 font-bold tracking-tight">
              RENDER LOOP ACTIVE
            </div>
            <button className="p-1 hover:text-white text-slate-500 cursor-pointer">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Timeline trimmer section */}
      <div className="p-3 bg-[#111114] border-t border-white/5 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold text-slate-200">
            <Scissors className="w-4 h-4 text-indigo-400" />
            Recortar Trilha de Vídeo
          </span>
          <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/10">
            Corte Smart
          </span>
        </div>

        {/* Visual simulated film strip bar with ranges */}
        <div className="relative h-12 bg-black rounded-lg overflow-hidden border border-white/5">
          {/* Simulated mini thumbs of video clip */}
          <div className="absolute inset-0 flex select-none divide-x divide-white/5 opacity-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-indigo-500/20 to-indigo-500/5"></div>
            ))}
          </div>

          {/* Trim selector frame overlays */}
          <div 
            style={{
              left: `${trimStart}%`,
              width: `${trimEnd - trimStart}%`,
            }}
            className="absolute top-0 bottom-0 border-2 border-indigo-500 bg-indigo-500/15 z-10 rounded-sm"
          >
            {/* Grab handles */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-[7px] h-6 bg-indigo-500 cursor-ew-resize rounded-sm"></div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-[7px] h-6 bg-indigo-500 cursor-ew-resize rounded-sm"></div>
          </div>
        </div>

        <div className="flex gap-2 text-[10.5px]">
          <input
            type="range"
            min="0"
            max="100"
            value={trimStart}
            onChange={(e) => setTrimStart(Math.min(parseInt(e.target.value), trimEnd - 10))}
            className="flex-1 accent-indigo-500 h-1 bg-zinc-850 rounded cursor-pointer"
          />
          <input
            type="range"
            min="0"
            max="100"
            value={trimEnd}
            onChange={(e) => setTrimEnd(Math.max(parseInt(e.target.value), trimStart + 10))}
            className="flex-1 accent-indigo-500 h-1 bg-zinc-850 rounded cursor-pointer"
          />
        </div>

        {showTrimSuccess ? (
          <div className="w-full py-2 bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 uppercase animate-fade-in">
            <Check className="w-3.5 h-3.5 text-indigo-400" />
            Corte Aplicado ({((trimEnd - trimStart) * 0.15).toFixed(1)}s)
          </div>
        ) : (
          <button
            onClick={handleApplyTrim}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 shadow border border-indigo-500/10 cursor-pointer uppercase"
          >
            <Check className="w-3.5 h-3.5" />
            Aplicar Corte Inteligente
          </button>
        )}
      </div>
    </div>
  );
}
