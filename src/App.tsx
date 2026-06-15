import React, { useState } from "react";
import { 
  Flame, 
  Sparkles, 
  Cpu, 
  Layers, 
  Play, 
  Check, 
  HelpCircle, 
  Info,
  Layers3,
  Video,
  MonitorPlay,
  RotateCcw,
  Sparkle,
  Laptop,
  ExternalLink,
  Terminal,
  Copy
} from "lucide-react";
import { EditorConfig, VideoTemplate, ScriptApiResponse, CenaEdicao, AudioTrack, RenderedOutput } from "./types";
import SidebarActions from "./components/SidebarActions";
import VideoGrid from "./components/VideoGrid";
import RightPreview from "./components/RightPreview";
import VirtualExplorer from "./components/VirtualExplorer";

const DEFAULT_CONFIG: EditorConfig = {
  pixelsDescer: 60,
  corBorda: "#6366f1",
  qualidade: "1080p",
  semBordas: false,
  molduraPersonalizada: true,
  melhorarAudio: true,
  antiDuplicidade: true,
  textoNoVideo: true,
  musicaEmMassa: false,
  espelharVideo: false,
  cortarInicioFim: true,
  ajusteAutomatico: true,
  velocidadeMultiplier: 1.05,
  ativarVelocidadePersonalizada: true,
  textoMarcaAgua: "@automa_dark",
  corMarca: "white",
  fonteMarca: "Space Grotesk",
  ativarFundoMarca: true,
  corFundoMarca: "black",
  tamanhoMarca: 18,
  posHorizMarca: 50,
  posVertMarca: 15,
  opacidadeMarca: 85,
  videoPosX: 0,
  videoPosY: 0,
  videoScale: 1.0,
  inverterIndividual: false,
  individualTextColor: "#6366f1",
  individualTextFont: "Space Grotesk",
  individualTextSize: 28,
  postHabilitado: true,
  postNomeUsuario: "Football Central",
  postIdentificador: "@yourfootballcentra",
  postTexto: "Puskas 2026 for Arda Güler",
  postAvatarUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=60",
  postTema: "Claro",
  postCheckVerificado: true,
  postLayoutType: "tweet",
  
  // Custom user requested features
  postExibirLegendas: true,
  postExibirMarca: true,
  fonteCustomizadaPC: "",
  fonteCustomizadaPCAgua: "",
  postVideoWidth: 100,
  postVideoHeight: 185,
  postVideoRadius: 16,
  postVideoMarginTop: 12,
  postVideoPosX: 0,
  postVideoPosY: 0,
  postAvatarSize: 40,
  postPerfilSize: 12,
  postHeadlineSize: 12,
  postHeadlineMarginTop: 8,
  postHeadlineAlign: "Left",
};

const INITIAL_TEMPLATES: VideoTemplate[] = [
  { id: "1", nome: "LuxuryCarSunset.mp4", duracao: "15s", categoria: "Luxury", thumbnailColor: "from-amber-800 to-rose-950", selected: true },
  { id: "2", nome: "GTA5_StuntJump.mp4", duracao: "15s", categoria: "Gaming", thumbnailColor: "from-pink-900 to-indigo-950", selected: false },
  { id: "3", nome: "RobloxObbyRun2.mp4", duracao: "15s", categoria: "Gaming", thumbnailColor: "from-violet-950 to-pink-950", selected: false },
  { id: "4", nome: "SoapSlicingASMR.mp4", duracao: "15s", categoria: "Satisfying", thumbnailColor: "from-cyan-900 to-emerald-950", selected: false },
  { id: "5", nome: "CosmicHyperspace.mp4", duracao: "15s", categoria: "Science", thumbnailColor: "from-purple-950 to-neutral-950", selected: false },
  { id: "6", nome: "MinecraftSpeedrun.mp4", duracao: "15s", categoria: "Gaming", thumbnailColor: "from-emerald-950 to-zinc-950", selected: false },
  { id: "7", nome: "HydraulicPressMetal.mp4", duracao: "15s", categoria: "ASMR", thumbnailColor: "from-neutral-900 to-slate-950", selected: false },
  { id: "8", nome: "RainyWindowAutumn.mp4", duracao: "15s", categoria: "Nature", thumbnailColor: "from-amber-950 to-stone-900", selected: false },
  { id: "9", nome: "SynthwavePurpleRoad.mp4", duracao: "15s", categoria: "Retro", thumbnailColor: "from-pink-950 to-violet-950", selected: false },
  { id: "10", nome: "MonacoGPFormulaCar.mp4", duracao: "15s", categoria: "Speed", thumbnailColor: "from-rose-950 to-black", selected: false },
];

export default function App() {
  const [config, setConfig] = useState<EditorConfig>(DEFAULT_CONFIG);
  const [templates, setTemplates] = useState<VideoTemplate[]>(INITIAL_TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>("1");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeScene, setActiveScene] = useState<CenaEdicao | null>(null);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number | null>(0);
  const [renderStatusModal, setRenderStatusModal] = useState<string | null>(null);
  
  // Real file uploading and database simulation state
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([
    { id: "1", nome: "Lofi Beats Chill.mp3", duracao: "2m 15s", selected: false },
    { id: "2", nome: "Cinematic Dark Ambient.mp3", duracao: "3m 48s", selected: false },
    { id: "3", nome: "Phonk Hyper Viral.mp3", duracao: "1m 58s", selected: true },
    { id: "4", nome: "Inspiring Positive Upbeat.mp3", duracao: "2m 30s", selected: false },
  ]);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [explorerTab, setExplorerTab] = useState<"entrada" | "saida">("entrada");

  const [renderedOutputs, setRenderedOutputs] = useState<RenderedOutput[]>([
    { id: "out-1", nome: "Short_Matchday_Crucial_ArdaGuler.mp4", tamanho: "18.4 MB", duracao: "15s", data: "Hoje", status: "Pronto" },
    { id: "out-2", nome: "Short_GTA5_Speedrun_Matrix.mp4", tamanho: "14.2 MB", duracao: "15s", data: "Hoje", status: "Pronto" },
    { id: "out-3", nome: "Short_Satisfying_Soap_Slice_Pro.mp4", tamanho: "16.1 MB", duracao: "15s", data: "Ontem", status: "Pronto" },
    { id: "out-4", nome: "Short_MonacoGP_Rhythm_Drift.mp4", tamanho: "Ontem", duracao: "15s", data: "Ontem", status: "Pronto" },
  ]);
  const [newlyRenderedFiles, setNewlyRenderedFiles] = useState<RenderedOutput[] | null>(null);
  const [isDesktopModalOpen, setIsDesktopModalOpen] = useState(false);

  const handleDeleteRender = (id: string) => {
    setRenderedOutputs((prev) => prev.filter((o) => o.id !== id));
  };

  const videoInputRef = React.useRef<HTMLInputElement>(null);
  const audioInputRef = React.useRef<HTMLInputElement>(null);

  const handleSelectTrack = (id: string) => {
    setAudioTracks((prev) =>
      prev.map((t) => ({ ...t, selected: t.id === id }))
    );
  };

  const handleDeleteTrack = (id: string) => {
    setAudioTracks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTrack = (fileOrFiles: File | File[] | FileList) => {
    const files = (fileOrFiles instanceof FileList || Array.isArray(fileOrFiles)) 
      ? Array.from(fileOrFiles) 
      : [fileOrFiles];
    
    if (files.length === 0) return;

    setAudioTracks((prev) => {
      const cleanedPrev = prev.map(t => ({ ...t, selected: false }));
      const newTracks = files.map((file, idx) => {
        const newId = String(Date.now() + idx);
        return {
          id: newId,
          nome: file.name,
          duracao: `2m 45s`,
          selected: idx === files.length - 1, // select final one
          audioUrl: URL.createObjectURL(file)
        };
      });
      return cleanedPrev.concat(newTracks);
    });

    setConfig(prev => ({ ...prev, musicaEmMassa: true }));

    if (files.length === 1) {
      alert(`Áudio "${files[0].name}" importado com sucesso! Trilha sonora ativada.`);
    } else {
      alert(`${files.length} áudios importados com sucesso! Última trilha sonora ativada.`);
    }
  };

  const handleUploadVideo = (fileOrFiles: File | File[] | FileList) => {
    const files = (fileOrFiles instanceof FileList || Array.isArray(fileOrFiles)) 
      ? Array.from(fileOrFiles) 
      : [fileOrFiles];

    if (files.length === 0) return;

    const randomizedColors = [
      "from-rose-950 to-pink-900",
      "from-purple-950 to-violet-900",
      "from-teal-950 to-cyan-900",
      "from-amber-950 to-yellow-900",
    ];

    const newTemplatesList: VideoTemplate[] = files.map((file, idx) => {
      const newId = String(Date.now() + idx);
      const chosenColor = randomizedColors[Math.floor(Math.random() * randomizedColors.length)];
      return {
        id: newId,
        nome: file.name,
        duracao: "15s",
        categoria: "Meus Vídeos",
        thumbnailColor: chosenColor,
        mockVideoUrl: URL.createObjectURL(file), // Real video URL
        selected: true,
      };
    });

    setTemplates((prev) => [...newTemplatesList, ...prev]);
    setSelectedTemplateId(newTemplatesList[0].id);

    if (files.length === 1) {
      alert(`Vídeo "${files[0].name}" importado com sucesso e marcado como ativo!`);
    } else {
      alert(`${files.length} vídeos importados com sucesso! O primeiro foi marcado como ativo.`);
    }
  };

  const handleDeleteTemplateDirectly = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    if (selectedTemplateId === id) {
      setSelectedTemplateId(null);
    }
  };
  
  // Grid visual configurations
  const [gridCols, setGridCols] = useState(4);
  const [thumbSize, setThumbSize] = useState<"Pequeno" | "Médio" | "Grande">("Médio");
  const [loadCount, setLoadCount] = useState(30);

  // Auto-sync subtitle when selected template changes
  React.useEffect(() => {
    const template = templates.find((t) => t.id === selectedTemplateId);
    if (template) {
      setActiveScene({
        tempo_estimado: "0-15s",
        texto_legenda: `DIGITE SUA LEGENDA AQUI`,
        estilo_visual: "PADRÃO"
      });
      setActiveSceneIndex(0);
    } else {
      setActiveScene(null);
      setActiveSceneIndex(null);
    }
  }, [selectedTemplateId, templates]);

  const handleUpdateSubtitle = (text: string) => {
    setActiveScene((prev) => {
      if (!prev) return { tempo_estimado: "0-15s", texto_legenda: text, estilo_visual: "PADRÃO" };
      return { ...prev, texto_legenda: text };
    });
  };

  // Active scene calculation helper
  const getActiveScene = (): CenaEdicao | null => {
    return activeScene;
  };

  const getScenesCount = (): number => {
    return activeScene ? 4 : 0; // standard scenes count or active scene items
  };

  // Triggering actions from side panel
  const handleActionTrigger = (actionType: string) => {
    switch (actionType) {
      case "upload_video":
        videoInputRef.current?.click();
        break;
      case "import_music":
        audioInputRef.current?.click();
        break;
      case "select_template":
        alert("Navegando pela biblioteca de fundos. Selecione qualquer item na grade central para customizar as marcações estéticas.");
        break;
      case "configure_api":
        alert("O software está utilizando o Gemini-3.5-Flash para gerar roteiros de altíssima conversão em português de forma nativa.");
        break;
      case "open_output":
        setExplorerTab("saida");
        setIsExplorerOpen(true);
        break;
      case "open_input":
        setExplorerTab("entrada");
        setIsExplorerOpen(true);
        break;
      default:
        break;
    }
  };

  // Grid list actions
  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
  };

  const handleToggleSound = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, selected: !t.selected } : t))
    );
  };

  const handleDeleteTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm("Excluir este vídeo de fundo da fila do lote?");
    if (confirmed) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      if (selectedTemplateId === id) {
        setSelectedTemplateId(null);
      }
    }
  };

  const handleMoveUp = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const idx = templates.findIndex((t) => t.id === id);
    if (idx > 0) {
      const copy = [...templates];
      const temp = copy[idx];
      copy[idx] = copy[idx - 1];
      copy[idx - 1] = temp;
      setTemplates(copy);
    }
  };

  const handleMoveDown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const idx = templates.findIndex((t) => t.id === id);
    if (idx < templates.length - 1) {
      const copy = [...templates];
      const temp = copy[idx];
      copy[idx] = copy[idx + 1];
      copy[idx + 1] = temp;
      setTemplates(copy);
    }
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case "load_previews":
        alert("Pre-renderizando 30 mini-fluxos compatíveis com a pasta temporária.");
        break;
      case "pause_all":
        alert("Fila de renderização remota pausada.");
        break;
      case "select_all":
        setTemplates((prev) => prev.map((t) => ({ ...t, selected: true })));
        break;
      case "clear_selection":
        setTemplates((prev) => prev.map((t) => ({ ...t, selected: false })));
        break;
      default:
        break;
    }
  };

  // Action to preview custom scene (if needed, simplified)
  const handlePreviewScene = (scene: CenaEdicao, index: number) => {
    setActiveScene(scene);
    setActiveSceneIndex(index);
  };

  // Process selected videos with high retention simulation
  const handleProcessVideos = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setRenderStatusModal("Preparando trilhas de vídeo para processamento em lote...");

    const steps = [
      "Iniciando decodificação do container de mídia...",
      "Processando filtros analíticos de anti-duplicidade (prevenção de Shadow Ban)...",
      "Sobrepondo marcas d'água estéticas e legendas no centro vertical do timeline...",
      "Incrementando ganho dinâmico e compressor no áudio de narração...",
      "Finalizando codificação x264 de 1080p HD no backend...",
      "Sucesso! Vídeos prontos para postagem direta no TikTok, Instagram e Shorts."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 600));
      setRenderStatusModal(steps[i]);
    }

    setTimeout(() => {
      setRenderStatusModal(null);
      setIsProcessing(false);

      // Determine which background videos are part of the active processing set
      const selectedVideos = templates.filter(t => t.selected);
      const targetVideos = selectedVideos.length > 0 ? selectedVideos : [templates.find(t => t.id === selectedTemplateId) || templates[0]].filter(Boolean);

      const generated: RenderedOutput[] = targetVideos.map((t, idx) => {
        const cleanName = t.nome.replace(/\.[^/.]+$/, "");
        const qualityStr = config.qualidade || "1080p";
        const filterSfx = config.antiDuplicidade ? "_AntiShadowBan" : "";
        const speedSfx = config.ativarVelocidadePersonalizada ? `_${config.velocidadeMultiplier}x` : "";
        const finalFileName = `Short_${cleanName}_${idx + 1}${filterSfx}${speedSfx}_${qualityStr}.mp4`;
        
        return {
          id: `render-${Date.now()}-${idx}`,
          nome: finalFileName,
          tamanho: `${(12 + Math.random() * 8).toFixed(1)} MB`,
          duracao: t.duracao || "15s",
          data: "Agora mesmo",
          status: "Pronto"
        };
      });

      setRenderedOutputs(prev => [...generated, ...prev]);
      setNewlyRenderedFiles(generated);
    }, 500);
  };

  const activeTemplate = templates.find((t) => t.id === selectedTemplateId) || null;

  return (
    <div className="h-screen w-screen bg-[#0A0A0B] text-slate-300 flex flex-col overflow-hidden font-sans select-none">
      
      {/* Upper Status Line Platform Branding and limits */}
      <header className="h-[52px] bg-[#111114] border-b border-white/5 flex items-center justify-between px-4 sticky top-0 z-40 select-none">
        
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 p-1 px-2.5 rounded-lg">
            <Flame className="w-4 h-4 text-indigo-400 fill-indigo-400/50 animate-pulse" />
            <span className="text-[10px] uppercase font-black text-indigo-400 tracking-wider">LOTE PRO v2.4</span>
          </div>
          <h1 className="text-sm font-bold text-white tracking-tight uppercase flex items-center gap-1.5 font-sans">
            ClipLote Studio <span className="text-indigo-400 font-mono text-xs normal-case font-bold">PRO</span>
          </h1>
        </div>

        {/* Core application status or branding */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider bg-white/5 px-3 py-1 rounded-full border border-white/5">
            PAINEL DE EDIÇÃO EM LOTE COMPLETO
          </span>
        </div>

        {/* Right Side: Simple status feedback */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDesktopModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 px-3 py-1.5 rounded-full text-xs font-bold text-indigo-400 cursor-pointer transition active:scale-95 text-shadow"
            title="Instalação do Aplicativo de Desktop"
          >
            <Laptop className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Instalar Desktop (Electron)</span>
          </button>
          
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Sistema Pronto
          </div>
        </div>
      </header>

      {/* Main Working Panel Wrapper */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Leftmost Sidebar Actions and Config tabs */}
        <div className="w-[280px] xl:w-[310px] flex-shrink-0 h-full border-r border-white/5">
          <SidebarActions
            config={config}
            onChange={setConfig}
            onProcess={handleProcessVideos}
            isProcessing={isProcessing}
            onActionTrigger={handleActionTrigger}
            audioTracks={audioTracks}
            onSelectTrack={handleSelectTrack}
            onDeleteTrack={handleDeleteTrack}
            onAddTrack={handleAddTrack}
          />
        </div>

        {/* Central interactive body segment */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="flex-1 flex overflow-hidden bg-[#08080A]">
            <VideoGrid
              templates={templates}
              selectedId={selectedTemplateId}
              onSelect={handleSelectTemplate}
              onToggleSound={handleToggleSound}
              onDelete={handleDeleteTemplate}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onBulkAction={handleBulkAction}
              gridCols={gridCols}
              setGridCols={setGridCols}
              thumbSize={thumbSize}
              setThumbSize={setThumbSize}
              loadCount={loadCount}
              setLoadCount={setLoadCount}
            />
          </div>
        </div>

        {/* Right side live rendering telephone view */}
        <RightPreview
          config={config}
          onChange={setConfig}
          activeTemplate={activeTemplate}
          activeScene={getActiveScene()}
          scenesCount={getScenesCount()}
          activeSceneIndex={activeSceneIndex}
          onSelectSceneIndex={(idx) => {
            if (activeScene && activeSceneIndex !== null) {
              setActiveSceneIndex(idx);
            }
          }}
          onChangeSubtitle={handleUpdateSubtitle}
          onApplyPreset={() => {
            alert("Preset estético aplicado à visualização final do lote.");
          }}
        />
      </div>

      {/* Render status modal popup */}
      {renderStatusModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111114] border border-white/10 rounded-xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h3 className="text-white font-black text-sm tracking-tight uppercase font-sans">
              Renderizando Lote de Vídeos em Massa
            </h3>
            <p className="text-slate-400 text-xs font-mono bg-black/30 p-3 rounded-lg border border-white/5">
              {renderStatusModal}
            </p>
            <div className="w-full bg-[#1A1A1E] rounded h-1.5 overflow-hidden border border-white/5">
              <div className="bg-indigo-500 h-full animate-pulse" style={{ width: "75%" }}></div>
            </div>
            <span className="text-[10px] text-slate-500 font-medium block">
              Por favor, não feche o navegador enquanto a codificação x264 processa o canal.
            </span>
          </div>
        </div>
      )}

      {/* Hidden file input elements for real native upload triggers */}
      <input 
        type="file" 
        ref={videoInputRef} 
        accept="video/*" 
        multiple
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) handleUploadVideo(files);
        }} 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={audioInputRef} 
        accept="audio/*" 
        multiple
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) handleAddTrack(files);
        }} 
        className="hidden" 
      />

      {/* Virtual Workspace Explorer Dialog */}
      <VirtualExplorer
        isOpen={isExplorerOpen}
        onClose={() => setIsExplorerOpen(false)}
        initialTab={explorerTab}
        templates={templates}
        audioTracks={audioTracks}
        renderedOutputs={renderedOutputs}
        onDeleteTemplate={handleDeleteTemplateDirectly}
        onDeleteAudio={handleDeleteTrack}
        onDeleteRender={handleDeleteRender}
        onUploadVideo={handleUploadVideo}
        onUploadAudio={handleAddTrack}
      />

      {/* Newly Rendered Batch Confirmation Modal */}
      {newlyRenderedFiles && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-[#111116] border border-emerald-500/30 rounded-2xl p-6 max-w-lg w-full text-center space-y-5 shadow-2xl animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold animate-bounce-slow">
              ✓
            </div>
            <div>
              <h3 className="text-white font-black text-base tracking-tight uppercase font-sans">
                Lote Renderizado com Sucesso! 💻⚡
              </h3>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                O pipeline do ClipLote Studio PRO concluiu e compactou a compilação de <span className="text-emerald-400 font-bold">{newlyRenderedFiles.length} shorts de alta conversão</span> na sandbox local.
              </p>
            </div>

            {/* List of successfully compiled files */}
            <div className="bg-black/30 p-3 rounded-lg border border-white/5 max-h-48 overflow-y-auto space-y-2 text-left font-mono text-[10px]">
              {newlyRenderedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between py-1 border-b border-white/5 last:border-none">
                  <span className="text-slate-350 truncate mr-3 flex-1 font-semibold">🎬 {file.nome}</span>
                  <span className="text-indigo-400 font-bold shrink-0">{file.tamanho} • {file.duracao}</span>
                </div>
              ))}
            </div>

            {/* Dynamic details about applied configs */}
            <div className="grid grid-cols-2 gap-2 text-left text-[9px] font-mono text-slate-400 bg-white/5 p-3 rounded-lg border border-white/5">
              <div>• Resolução: <span className="text-white font-bold">{config.qualidade}</span></div>
              <div>• Anti-Shadow Ban: <span className="text-white font-bold">{config.antiDuplicidade ? "ATIVADO" : "DESATIVADO"}</span></div>
              <div>• Marca d'Água: <span className="text-white font-bold">{config.postExibirMarca ? "INTEGRADA" : "NÃO"}</span></div>
              <div>• Legenda por IA: <span className="text-white font-bold">{config.postExibirLegendas ? "RENDERIZADA" : "OCULTA"}</span></div>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  setNewlyRenderedFiles(null);
                  setExplorerTab("saida");
                  setIsExplorerOpen(true);
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition shadow-lg shadow-indigo-500/25 cursor-pointer"
              >
                Abrir Pasta de Saída (Renders)
              </button>
              <button
                onClick={() => setNewlyRenderedFiles(null)}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-slate-350 hover:text-white font-semibold text-xs rounded-xl transition cursor-pointer border border-white/5"
              >
                Fechar Relatório
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Desktop Builder & Electron Guide Modal */}
      {isDesktopModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D0D11] border border-indigo-500/30 rounded-2xl p-6 max-w-2xl w-full space-y-6 shadow-2xl animate-fade-in my-8">
            
            {/* Header branding */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center text-lg font-bold">
                  💻
                </div>
                <div>
                  <h3 className="text-white font-black text-sm tracking-tight uppercase font-sans">
                    Transformar em Aplicativo Desktop Instalável
                  </h3>
                  <p className="text-slate-400 text-[10px] tracking-wide font-medium font-sans uppercase">
                    Scaffolding de Electron & Electron-Builder Ativado
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDesktopModalOpen(false)}
                className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            {/* Answer statement */}
            <div className="space-y-2.5">
              <h4 className="text-slate-100 font-bold text-xs">
                Sim, é 100% possível! O ClipLote Studio está pronto para rodar como App Desktop Nativo.
              </h4>
              <p className="text-slate-350 text-xs leading-relaxed">
                Nós configuramos todo o sistema para você! Os arquivos principais (<span className="text-indigo-400 font-mono text-[11px] font-semibold">electron/main.cjs</span> e configurações avançadas no <span className="text-indigo-400 font-mono text-[11px] font-semibold">package.json</span>) já foram injetados no workspace atual. Quando você baixar o projeto, terá um app para PC pronto para compilar.
              </p>
            </div>

            {/* Installation Tutorial Accordion / Cards */}
            <div className="space-y-4">
              <span className="text-[10px] text-indigo-400 font-black tracking-wider uppercase flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> Passo a Passo de Instalação e Compilação
              </span>

              {/* Step 1 */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-200">1. Exportar Código-Fonte</span>
                  <span className="text-[9px] font-bold text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 rounded">Passo 1</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Clique nas <span className="text-white font-bold">Configurações (ícone de engrenagem no painel do AI Studio)</span> e selecione <span className="text-white font-bold">"Exportar como ZIP"</span> ou envie diretamente para o seu GitHub pessoal.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-200">2. Instalar Dependências no seu Computador</span>
                  <span className="text-[9px] font-bold text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 rounded">Passo 2</span>
                </div>
                <p className="text-slate-400 text-[11px] pb-1">
                  Abra a pasta do projeto no seu Terminal de Comandos preferido (como VS Code, PowerShell ou Bash) e execute:
                </p>
                <div className="relative flex items-center bg-zinc-950/90 border border-white/5 px-3 py-2 rounded-lg font-mono text-xs text-indigo-300">
                  <span>npm install</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("npm install");
                      alert("Comando 'npm install' copiado para a área de transferência!");
                    }}
                    className="absolute right-2 px-2 py-1 text-[9px] font-bold bg-white/5 hover:bg-white/10 rounded border border-white/5 text-slate-350 cursor-pointer transition select-none hover:text-white"
                  >
                    Copiar
                  </button>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-200">3. Testar o Aplicativo de Desktop</span>
                  <span className="text-[9px] font-bold text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 rounded">Passo 3</span>
                </div>
                <p className="text-slate-400 text-[11px] pb-1">
                  Rode o comando abaixo para compilar os assets na sua máquina e abrir o ClipLote em uma bela janela nativa:
                </p>
                <div className="relative flex items-center bg-zinc-950/90 border border-white/5 px-3 py-2 rounded-lg font-mono text-xs text-indigo-300">
                  <span>npm run desktop:run</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("npm run desktop:run");
                      alert("Comando 'npm run desktop:run' copiado para a área de transferência!");
                    }}
                    className="absolute right-2 px-2 py-1 text-[9px] font-bold bg-white/5 hover:bg-white/10 rounded border border-white/5 text-slate-350 cursor-pointer transition select-none hover:text-white"
                  >
                    Copiar
                  </button>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-200">4. Gerar o Instalador Nativo (.EXE ou .DMG)</span>
                  <span className="text-[9px] font-bold text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 rounded">Passo 4</span>
                </div>
                <p className="text-slate-400 text-[11px] pb-1">
                  Gere o arquivo instalador executável final com um único comando. O Electron-Builder empacotará tudo em <span className="text-emerald-400 font-bold">dist-desktop/</span>:
                </p>
                <div className="relative flex items-center bg-zinc-950/90 border border-white/5 px-3 py-2 rounded-lg font-mono text-xs text-indigo-300">
                  <span>npm run desktop:build</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("npm run desktop:build");
                      alert("Comando 'npm run desktop:build' copiado!");
                    }}
                    className="absolute right-2 px-2 py-1 text-[9px] font-bold bg-white/5 hover:bg-white/10 rounded border border-white/5 text-slate-350 cursor-pointer transition select-none hover:text-white"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>

            {/* Why desktop edition is awesome details */}
            <div className="p-3 bg-indigo-950/10 border border-indigo-500/20 rounded-xl space-y-1">
              <h5 className="text-[11px] font-bold text-indigo-400 uppercase tracking-wide flex items-center gap-1.5">
                ⚡ Vantagens da Versão Desktop Instalável:
              </h5>
              <div className="grid grid-cols-2 gap-4 text-[10px] text-slate-350 pt-1">
                <div>• <span className="font-bold text-white">Renderização Ilimitada</span>: Sem bloqueios de browser.</div>
                <div>• <span className="font-bold text-white">Suporte a Teclado</span>: Atalhos nativos de sistema de edição.</div>
                <div>• <span className="font-bold text-white">Sem Internet</span>: Funciona 100% offline localmente.</div>
                <div>• <span className="font-bold text-white">Instalador Simples</span>: Duplo clique para instalar no Windows ou Mac.</div>
              </div>
            </div>

            {/* Actions footer */}
            <div className="flex gap-2.5">
              <button
                onClick={() => setIsDesktopModalOpen(false)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition shadow-lg shadow-indigo-500/25 cursor-pointer text-center"
              >
                Entendi, Tudo Pronto para Exportar! 🚀
              </button>
              <button
                onClick={() => {
                  setIsDesktopModalOpen(false);
                  setExplorerTab("entrada");
                  setIsExplorerOpen(true);
                }}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-slate-350 hover:text-white font-semibold text-xs rounded-xl transition cursor-pointer border border-white/5"
              >
                Ver Arquivos Locais
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
