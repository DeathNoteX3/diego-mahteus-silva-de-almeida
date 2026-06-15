import React, { useState } from "react";
import { 
  Upload, 
  Layers, 
  Music, 
  Settings, 
  Folder, 
  Sliders, 
  Sparkles, 
  Play, 
  Check, 
  Smartphone,
  Eye,
  Type as FontIcon
} from "lucide-react";
import { EditorConfig, AudioTrack } from "../types";
import MusicShelf from "./MusicShelf";

interface SidebarActionsProps {
  config: EditorConfig;
  onChange: (updater: (prev: EditorConfig) => EditorConfig) => void;
  onProcess: () => void;
  isProcessing: boolean;
  onActionTrigger: (action: string) => void;
  audioTracks: AudioTrack[];
  onSelectTrack: (id: string) => void;
  onDeleteTrack: (id: string) => void;
  onAddTrack: (file: File) => void;
}

export default function SidebarActions({
  config,
  onChange,
  onProcess,
  isProcessing,
  onActionTrigger,
  audioTracks,
  onSelectTrack,
  onDeleteTrack,
  onAddTrack,
}: SidebarActionsProps) {
  const [activeTab, setActiveTab] = useState<"Básico" | "Efeitos" | "Marca" | "Editor" | "Post">("Básico");

  const updateField = <K extends keyof EditorConfig>(key: K, value: EditorConfig[K]) => {
    onChange((prev) => ({ ...prev, [key]: value }));
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateField("postAvatarUrl", event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full flex flex-col bg-[#0C0C0F] border-r border-[#1a1a1f] h-full text-slate-300 overflow-y-auto select-none font-sans scrollbar-thin">
      {/* Action Buttons Top */}
      <div className="p-4 space-y-2 border-b border-white/5">
        <button
          id="btn_enviar"
          onClick={() => onActionTrigger("upload_video")}
          className="w-full flex items-center justify-between px-3 py-2.5 bg-[#111114] hover:bg-[#16161A] rounded-lg border border-white/5 hover:border-white/10 transition-all text-xs font-semibold text-slate-100 shadow-sm cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-indigo-400" />
            Enviar Vídeos
          </span>
          <span className="text-[10px] bg-white/5 text-slate-400 px-1.5 py-0.5 rounded border border-white/5">PC</span>
        </button>

        <button
          id="btn_template"
          onClick={() => {
            setActiveTab("Post");
            onActionTrigger("select_template");
          }}
          className="w-full flex items-center justify-between px-3 py-2.5 bg-[#111114] hover:bg-[#16161A] rounded-lg border border-white/5 hover:border-white/10 transition-all text-xs font-semibold text-slate-100 shadow-sm cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Selecionar Template
          </span>
          <span className="text-[9px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">GRID</span>
        </button>

        <button
          id="btn_music"
          onClick={() => onActionTrigger("import_music")}
          className="w-full flex items-center justify-between px-3 py-2.5 bg-[#111114] hover:bg-[#16161A] rounded-lg border border-white/5 hover:border-white/10 transition-all text-xs font-semibold text-slate-100 shadow-sm cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Music className="w-4 h-4 text-indigo-400" />
            Importar Músicas
          </span>
          <span className="text-[10px] bg-white/5 text-slate-400 px-1.5 py-0.5 rounded border border-white/5">MP3</span>
        </button>

        <button
          id="btn_api"
          onClick={() => onActionTrigger("configure_api")}
          className="w-full flex items-center justify-between px-3 py-2.5 bg-[#111114] hover:bg-[#16161A] rounded-lg border border-white/5 hover:border-white/10 transition-all text-xs font-semibold text-slate-100 shadow-sm cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-indigo-400" />
            Configurar API
          </span>
          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20">GEMINI</span>
        </button>
      </div>

      {/* Main Process Button */}
      <div className="p-4 border-b border-white/5">
        <button
          id="btn_processar"
          onClick={onProcess}
          disabled={isProcessing}
          className={`w-full py-3 px-4 ${
            isProcessing 
              ? "bg-zinc-800 pointer-events-none text-zinc-500 cursor-not-allowed" 
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/10 hover:shadow-indigo-500/20 shadow-md cursor-pointer animate-pulse-slow"
          } rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all border border-indigo-500/25 tracking-wider`}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              PROCESSANDO VÍDEOS...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current text-white" />
              PROCESSAR VÍDEOS
            </>
          )}
        </button>
      </div>

      {/* Directory Access */}
      <div className="px-4 py-3 border-b border-white/5 grid grid-cols-2 gap-2 text-xs">
        <button
          onClick={() => onActionTrigger("open_output")}
          className="flex items-center justify-center gap-1.5 py-2 px-2 bg-[#111114] hover:bg-[#16161A] hover:text-white border border-white/5 hover:border-white/10 rounded-lg text-slate-400 transition-all font-medium cursor-pointer"
        >
          <Folder className="w-3.5 h-3.5 text-slate-500" />
          Abrir Saída
        </button>
        <button
          onClick={() => onActionTrigger("open_input")}
          className="flex items-center justify-center gap-1.5 py-2 px-2 bg-[#111114] hover:bg-[#16161A] hover:text-white border border-white/5 hover:border-white/10 rounded-lg text-slate-400 transition-all font-medium cursor-pointer"
        >
          <Folder className="w-3.5 h-3.5 text-slate-500" />
          Abrir Entrada
        </button>
      </div>

      {/* Settings Panel Tabs */}
      <div className="flex border-b border-white/5 bg-[#111114] sticky top-0 z-10 text-[10px] items-center justify-between">
        {(["Básico", "Efeitos", "Marca", "Editor", "Post"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-center font-bold tracking-tight border-b-2 transition-all cursor-pointer ${
              activeTab === tab
                ? "border-indigo-500 text-indigo-400 bg-[#0C0C0F]"
                : "border-transparent text-slate-500 hover:text-slate-350 hover:bg-white/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Setting Panel Content */}
      <div className="p-4 flex-1 space-y-5 text-xs">
        {activeTab === "Básico" && (
          <div className="space-y-4 animate-fade-in">
            {/* Pixels descer slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span className="font-semibold text-slate-300">Pixels para descer:</span>
                <span className="font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/15 px-1.5 py-0.5 rounded">
                  {config.pixelsDescer}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                value={config.pixelsDescer}
                onChange={(e) => updateField("pixelsDescer", parseInt(e.target.value))}
                className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Cor da Borda */}
            <div className="space-y-2">
              <span className="font-semibold text-slate-300 block">Cor da borda:</span>
              <div className="flex gap-2">
                <select
                  value={config.corBorda === "#1f1f23" ? "Cinza Escuro" : config.corBorda === "#6366f1" ? "Indigo Moderno" : "Custom"}
                  onChange={(e) => {
                    const mapped: Record<string, string> = {
                      "Cinza Escuro": "#1f1f23",
                      "Indigo Moderno": "#6366f1",
                      "Custom": "#ef4444"
                    };
                    updateField("corBorda", mapped[e.target.value] || "#1f1f23");
                  }}
                  className="bg-[#16161A] border border-white/10 text-slate-200 text-xs rounded-lg block w-full p-2.5 focus:outline-none focus:border-indigo-500/50 focus:ring-0"
                >
                  <option value="Cinza Escuro">Cinza Escuro</option>
                  <option value="Indigo Moderno">Indigo Moderno</option>
                  <option value="Custom">Customizado</option>
                </select>
                <input
                  type="color"
                  value={config.corBorda}
                  onChange={(e) => updateField("corBorda", e.target.value)}
                  className="w-10 h-9 p-1 bg-[#16161A] border border-white/10 rounded cursor-pointer leading-none"
                />
              </div>
            </div>

            {/* Qualidade de Saída */}
            <div className="space-y-2 pt-1">
              <span className="font-semibold text-slate-300 block">Qualidade de Saída:</span>
              <div className="grid grid-cols-3 gap-2 bg-[#111114] p-1 rounded-lg border border-white/5">
                {(["480p", "720p", "1080p"] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => updateField("qualidade", q)}
                    className={`py-1.5 rounded font-bold text-[10px] transition-all cursor-pointer ${
                      config.qualidade === q
                        ? "bg-indigo-600 text-white font-black"
                        : "text-slate-400 hover:text-slate-250 hover:bg-white/5"
                    }`}
                  >
                    {q === "1080p" ? "1080p HD" : q}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2.5 pt-3 border-t border-white/5">
              {[
                { label: "Exibir Legendas no Vídeo", key: "postExibirLegendas" },
                { label: "Exibir Marca d'água no Vídeo", key: "postExibirMarca" },
                { label: "Sem Bordas (preencher área)", key: "semBordas" },
                { label: "Moldura (Frame Personalizado)", key: "molduraPersonalizada" },
                { label: "Melhorar Áudio ElevenLabs", key: "melhorarAudio" },
                { label: "Anti Duplicidade (TikTok/Insta)", key: "antiDuplicidade" },
                { label: "Texto em Massa no Vídeo", key: "textoNoVideo" },
                { label: "Trilha Sonora Automática", key: "musicaEmMassa" },
              ].map(({ label, key }) => (
                <div
                  key={key}
                  onClick={() => updateField(key as keyof EditorConfig, !config[key as keyof EditorConfig])}
                  className="flex items-center justify-between cursor-pointer text-slate-400 hover:text-slate-200 select-none py-1 border-b border-white/5 last:border-0"
                >
                  <span className="font-medium">{label}</span>
                  <div className="relative pointer-events-none">
                    <div className={`w-8 h-4.5 rounded-full transition-colors ${config[key as keyof EditorConfig] ? "bg-indigo-500" : "bg-zinc-800"}`}></div>
                    <div className={`absolute left-0.5 top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-transform ${config[key as keyof EditorConfig] ? "translate-x-3.5" : ""}`}></div>
                  </div>
                </div>
              ))}
            </div>

            <MusicShelf
              audioTracks={audioTracks}
              onSelectTrack={onSelectTrack}
              onDeleteTrack={onDeleteTrack}
              onAddTrack={onAddTrack}
              onActionTrigger={onActionTrigger}
            />
          </div>
        )}

        {activeTab === "Efeitos" && (
          <div className="space-y-4 animate-fade-in">
            <span className="font-bold text-slate-200 block border-b border-white/5 pb-1.5">Ajustes & Filtros de Edição (2024 Rule):</span>

            {[
              { label: "Espelhar Vídeo Fundos", key: "espelharVideo" },
              { label: "Cortar início/fim (0.5s preventivo)", key: "cortarInicioFim" },
              { label: "Ajuste automático de brilho/luminância", key: "ajusteAutomatico" },
            ].map(({ label, key }) => (
              <label key={key} className="flex items-center gap-2.5 cursor-pointer text-slate-400 hover:text-slate-200 select-none py-1.5">
                <input
                  type="checkbox"
                  checked={!!config[key as keyof EditorConfig]}
                  onChange={(e) => updateField(key as keyof EditorConfig, e.target.checked)}
                  className="w-4 h-4 rounded border-white/10 text-indigo-600 focus:ring-0 focus:outline-none bg-[#16161A] cursor-pointer"
                />
                <span>{label}</span>
              </label>
            ))}

            <div className="pt-3 border-t border-white/5 space-y-3">
              <label className="flex items-center gap-2.5 cursor-pointer text-slate-400 hover:text-slate-200 select-none">
                <input
                  type="checkbox"
                  checked={config.ativarVelocidadePersonalizada}
                  onChange={(e) => updateField("ativarVelocidadePersonalizada", e.target.checked)}
                  className="w-4 h-4 rounded border-white/10 text-indigo-600 focus:ring-0 focus:outline-none bg-[#16161A] cursor-pointer"
                />
                <span className="font-semibold">Ativar velocidade personalizada</span>
              </label>

              {config.ativarVelocidadePersonalizada && (
                <div className="space-y-2 pl-6 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Fator de Velocidade:</span>
                    <span className="font-mono text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                      {config.velocidadeMultiplier}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.05"
                    value={config.velocidadeMultiplier}
                    onChange={(e) => updateField("velocidadeMultiplier", parseFloat(e.target.value))}
                    className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-500 leading-tight">
                    *Velocidades ligeiramente acima de 1.05x evitam assinaturas de redundância em canais automatizados.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "Marca" && (
          <div className="space-y-4 animate-fade-in">
            <span className="font-bold text-slate-200 block border-b border-white/5 pb-1.5 font-sans">Opções da Marca d'Água:</span>

            {/* Toggle Habilitar/Desabilitar Marca */}
            <div 
              onClick={() => updateField("postExibirMarca", !config.postExibirMarca)}
              className="flex items-center justify-between cursor-pointer text-slate-400 hover:text-slate-200 py-2.5 border-b border-white/5 select-none"
            >
              <span className="font-semibold text-slate-200">Exibir Marca d'água no Vídeo?</span>
              <div className="relative pointer-events-none">
                <div className={`w-8 h-4.5 rounded-full transition-colors ${config.postExibirMarca ? "bg-indigo-500" : "bg-zinc-800"}`}></div>
                <div className={`absolute left-0.5 top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-transform ${config.postExibirMarca ? "translate-x-3.5" : ""}`}></div>
              </div>
            </div>

            {/* Custom PC Font Name for Watermark */}
            <div className="space-y-1 bg-indigo-950/20 p-2.5 rounded-lg border border-indigo-500/10">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="font-bold text-indigo-400 text-[10px] uppercase tracking-wider">Fonte do seu Computador (PC)</span>
              </div>
              <input
                type="text"
                placeholder="Ex: Arial Black, Comic Sans MS, Segoe UI, Impact, Montserrat"
                value={config.fonteCustomizadaPCAgua}
                onChange={(e) => updateField("fonteCustomizadaPCAgua", e.target.value)}
                className="w-full bg-[#16161A] border border-white/10 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-indigo-500/50"
              />
              <p className="text-[9.5px] text-slate-500 leading-tight block mt-1 leading-snug">
                *Escreva exatamente o nome de qualquer fonte instalada no seu sistema operacional (PC) para renderizá-la.
              </p>
            </div>

            {/* Texto Marca d'agua */}
            <div className="space-y-2">
              <span className="font-semibold text-slate-400">Texto da marca d'água:</span>
              <input
                type="text"
                placeholder="Ex: @seucanal_shorts"
                value={config.textoMarcaAgua}
                onChange={(e) => updateField("textoMarcaAgua", e.target.value)}
                className="w-full bg-[#16161A] border border-white/10 text-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            {/* Cor and font */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-slate-400 block text-[10px]">Cor:</span>
                <select
                  value={config.corMarca}
                  onChange={(e) => updateField("corMarca", e.target.value)}
                  className="bg-[#16161A] border border-white/10 text-slate-200 text-xs rounded-lg p-2 block w-full focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="white">Branco</option>
                  <option value="cyan">Ciano</option>
                  <option value="yellow">Amarelo</option>
                  <option value="black">Preto</option>
                </select>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block text-[10px]">Fonte:</span>
                <select
                  value={config.fonteMarca}
                  onChange={(e) => updateField("fonteMarca", e.target.value)}
                  className="bg-[#16161A] border border-white/10 text-slate-200 text-xs rounded-lg p-2 block w-full focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="Arial">Arial</option>
                  <option value="Impact">Impact</option>
                  <option value="Space Grotesk">Space Grotesk</option>
                  <option value="JetBrains Mono">JetBrains Mono</option>
                </select>
              </div>
            </div>

            {/* Ativar fundo watermark */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="flex items-center justify-between cursor-pointer text-slate-400 hover:text-slate-200">
                <span>Ativar fundo opaco</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={config.ativarFundoMarca}
                    onChange={(e) => updateField("ativarFundoMarca", e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-8 h-4.5 rounded-full transition-colors ${config.ativarFundoMarca ? "bg-indigo-500" : "bg-zinc-800"}`}></div>
                  <div className={`absolute left-0.5 top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-transform ${config.ativarFundoMarca ? "translate-x-3.5" : ""}`}></div>
                </div>
              </label>

              {config.ativarFundoMarca && (
                <div className="pl-0 mt-2 space-y-1.5 animate-fade-in">
                  <span className="text-slate-500 text-[10px]">Cor do fundo recuado:</span>
                  <select
                    value={config.corFundoMarca}
                    onChange={(e) => updateField("corFundoMarca", e.target.value)}
                    className="bg-[#16161A] border border-white/10 text-slate-250 text-[11px] rounded-lg p-2 block w-full focus:outline-none focus:border-indigo-500/50"
                  >
                    <option value="black">Preto (Translúcido)</option>
                    <option value="red">Vermelho Intenso</option>
                    <option value="blue">Azul Marinho</option>
                  </select>
                </div>
              )}
            </div>

            {/* Margins & Sliders for size/opacity */}
            <div className="space-y-3 pt-3 border-t border-white/5">
              {/* Tamanho */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Tamanho:</span>
                  <span className="font-mono text-zinc-300">{config.tamanhoMarca}px</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="44"
                  value={config.tamanhoMarca}
                  onChange={(e) => updateField("tamanhoMarca", parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Pos Horiz */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Posição Horizontal:</span>
                  <span className="font-mono text-zinc-300">{config.posHorizMarca}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.posHorizMarca}
                  onChange={(e) => updateField("posHorizMarca", parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Pos Vert */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Posição Vertical:</span>
                  <span className="font-mono text-zinc-300">{config.posVertMarca}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.posVertMarca}
                  onChange={(e) => updateField("posVertMarca", parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Opacidade */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Opacidade marca:</span>
                  <span className="font-mono text-zinc-300">{config.opacidadeMarca}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={config.opacidadeMarca}
                  onChange={(e) => updateField("opacidadeMarca", parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "Editor" && (
          <div className="space-y-4 animate-fade-in">
            <span className="font-bold text-slate-200 block border-b border-white/5 pb-1.5 font-sans">Ajustes Finos de Posicionamento:</span>

            {/* Video position values */}
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Crop Horizontal:</span>
                  <span className="font-mono text-zinc-300">{config.videoPosX}px</span>
                </div>
                <input
                  type="range"
                  min="-200"
                  max="200"
                  value={config.videoPosX}
                  onChange={(e) => updateField("videoPosX", parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Crop Vertical:</span>
                  <span className="font-mono text-zinc-300">{config.videoPosY}px</span>
                </div>
                <input
                  type="range"
                  min="-200"
                  max="200"
                  value={config.videoPosY}
                  onChange={(e) => updateField("videoPosY", parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Zoom / Escala Trilha:</span>
                  <span className="font-mono text-zinc-300">{(config.videoScale * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={config.videoScale}
                  onChange={(e) => updateField("videoScale", parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              <label className="flex items-center justify-between cursor-pointer text-slate-400 hover:text-slate-200 pt-1">
                <span>Inverter e Espelhar (Individual)</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={config.inverterIndividual}
                    onChange={(e) => updateField("inverterIndividual", e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-8 h-4.5 rounded-full transition-colors ${config.inverterIndividual ? "bg-indigo-500" : "bg-zinc-800"}`}></div>
                  <div className={`absolute left-0.5 top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-transform ${config.inverterIndividual ? "translate-x-3.5" : ""}`}></div>
                </div>
              </label>
            </div>

            {/* Individual text custom colors/styles */}
            <div className="space-y-3 pt-3 border-t border-white/5">
              <span className="font-bold text-[11px] text-zinc-300 block">Estilo das Legendas (Center Subtitles):</span>

              {/* Toggle Habilitar/Desabilitar Legendas */}
              <div 
                onClick={() => updateField("postExibirLegendas", !config.postExibirLegendas)}
                className="flex items-center justify-between cursor-pointer text-slate-400 hover:text-slate-200 py-2 border-b border-white/5 pb-2 select-none"
              >
                <span className="text-slate-300 font-semibold font-sans">Exibir legendas no vídeo?</span>
                <div className="relative pointer-events-none">
                  <div className={`w-8 h-4.5 rounded-full transition-colors ${config.postExibirLegendas ? "bg-indigo-500" : "bg-zinc-800"}`}></div>
                  <div className={`absolute left-0.5 top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-transform ${config.postExibirLegendas ? "translate-x-3.5" : ""}`}></div>
                </div>
              </div>

              {/* Custom PC Font Name for subtitles */}
              <div className="space-y-1 bg-indigo-950/20 p-2 rounded-lg border border-indigo-500/10">
                <span className="text-slate-400 block text-[10px] font-bold text-indigo-400 uppercase tracking-wide">Fonte do seu Computador (PC)</span>
                <input
                  type="text"
                  placeholder="Ex: Montserrat Black, Century Gothic, Segoe UI, Impact"
                  value={config.fonteCustomizadaPC}
                  onChange={(e) => updateField("fonteCustomizadaPC", e.target.value)}
                  className="w-full bg-[#16161A] border border-white/10 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-indigo-500/50"
                />
                <p className="text-[9.5px] text-slate-500 leading-tight block mt-1 leading-snug">
                  *Digite exatamente o nome de qualquer fonte instalada no seu PC (ex: Arial Black, Tahoma, Trebuchet MS) para aplicá-la.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-slate-400 block text-[10px]">Cor do Texto de Destaque:</span>
                <div className="flex gap-1.5 flex-wrap">
                  {[
                    { name: "Indigo Elegante", hex: "#6366f1" },
                    { name: "Branco Clean", hex: "#ffffff" },
                    { name: "Amarelo Viral", hex: "#eab308" },
                    { name: "Vermelho Impacto", hex: "#ef4444" },
                  ].map((col) => (
                    <button
                      key={col.hex}
                      onClick={() => updateField("individualTextColor", col.hex)}
                      className={`px-2 py-1 rounded text-[9px] font-bold border transition-all cursor-pointer ${
                        config.individualTextColor === col.hex
                          ? "bg-indigo-950 border-indigo-500/40 text-indigo-300"
                          : "bg-black/45 border-white/5 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {col.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Tamanho da Legenda:</span>
                  <span className="font-mono text-zinc-300">{config.individualTextSize}pt</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="60"
                  value={config.individualTextSize}
                  onChange={(e) => updateField("individualTextSize", parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[10px] block">Tipografia Legenda:</span>
                <select
                  value={config.individualTextFont}
                  onChange={(e) => updateField("individualTextFont", e.target.value)}
                  className="bg-[#16161A] border border-white/10 text-slate-250 text-xs rounded-lg p-2.5 block w-full focus:outline-none focus:border-indigo-500/50 cursor-pointer"
                >
                  <option value="Space Grotesk">Space Grotesk (Tech)</option>
                  <option value="Impact">Impact (Shorts Clássico)</option>
                  <option value="Arial">Arial Black (Bold)</option>
                  <option value="JetBrains Mono">JetBrains Mono (Sleek)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Post" && (
          <div className="space-y-4 animate-fade-in text-xs">
            <span className="font-bold text-slate-200 block border-b border-white/5 pb-1.5 font-sans">
              Layout de Post Social (Fundo & Template):
            </span>

            {/* Premium Multi-Layout Selector Bento Grid */}
            <div className="space-y-2.5 bg-black/35 p-3 rounded-xl border border-white/5">
              <span className="font-bold text-slate-400 block uppercase text-[9px] tracking-wider">
                🎨 Selecione o Modelo de Layout do Shorts:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {/* Option 1: Tweet layout */}
                <button
                  type="button"
                  onClick={() => {
                    updateField("postLayoutType", "tweet");
                    updateField("postHabilitado", true);
                  }}
                  className={`flex flex-col items-center justify-between p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    config.postLayoutType === "tweet" || !config.postLayoutType
                      ? "bg-indigo-600/15 border-indigo-500 text-indigo-300 shadow-md scale-[1.02]"
                      : "bg-[#111114] border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-300"
                  }`}
                >
                  <div className="w-full aspect-[4/5] rounded-lg bg-neutral-800/80 mb-1.5 flex flex-col justify-between p-1.5 overflow-hidden relative border border-white/5">
                    {/* Tiny representation of post header */}
                    <div className="flex gap-1 items-center shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
                      <div className="w-6 h-0.5 bg-slate-400 rounded-full"></div>
                    </div>
                    {/* Tiny box for video */}
                    <div className="w-full flex-1 rounded border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center p-0.5 mt-1">
                      <span className="text-[5px] font-black scale-90 select-none text-indigo-400">VID</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-black leading-none uppercase">Tweet</span>
                </button>

                {/* Option 2: Torn Paper Neon layout */}
                <button
                  type="button"
                  onClick={() => {
                    updateField("postLayoutType", "torn_neon");
                    updateField("postHabilitado", true);
                  }}
                  className={`flex flex-col items-center justify-between p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    config.postLayoutType === "torn_neon"
                      ? "bg-indigo-600/15 border-indigo-500 text-indigo-300 shadow-md scale-[1.02]"
                      : "bg-[#111114] border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-300"
                  }`}
                >
                  <div className="w-full aspect-[4/5] rounded-lg bg-neutral-900 mb-1.5 flex flex-col justify-between p-1 overflow-hidden relative border border-white/5">
                    {/* Floating circular avatar */}
                    <div className="w-2.5 h-2.5 rounded-full bg-sky-300 border border-white mx-auto shadow shrink-0 z-10"></div>
                    {/* Card container represent */}
                    <div className="flex-1 w-full bg-[#f0f4f8] rounded p-0.5 flex flex-col justify-between items-center relative gap-0.5 pt-1 border border-slate-300">
                      <div className="w-3 h-0.5 bg-slate-600 rounded"></div>
                      <div className="w-full flex-1 bg-indigo-400/20 rounded flex items-center justify-center">
                        <span className="text-[5px] select-none text-indigo-600 font-bold">GRID</span>
                      </div>
                      <div className="w-full text-center text-pink-500 text-[4px] font-black leading-none uppercase select-none">PINK</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-black leading-none uppercase">Paper Neon</span>
                </button>

                {/* Option 3: Quote card card centered overlay */}
                <button
                  type="button"
                  onClick={() => {
                    updateField("postLayoutType", "centered_card");
                    updateField("postHabilitado", true);
                  }}
                  className={`flex flex-col items-center justify-between p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    config.postLayoutType === "centered_card"
                      ? "bg-indigo-600/15 border-indigo-500 text-indigo-300 shadow-md scale-[1.02]"
                      : "bg-[#111114] border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-300"
                  }`}
                >
                  <div className="w-full aspect-[4/5] rounded-lg bg-neutral-900/60 mb-1.5 flex items-center justify-center p-1 overflow-hidden relative border border-white/5">
                    {/* Centered card overlay representation */}
                    <div className="w-[85%] bg-white border border-slate-100 rounded py-1 px-0.5 flex flex-col items-center gap-0.5 shadow-sm z-10">
                      <div className="w-3.5 h-0.5 bg-indigo-500 rounded-full"></div>
                      <div className="w-full space-y-0.5 text-center">
                        <div className="w-full h-[1px] bg-slate-800 rounded"></div>
                        <div className="w-full h-[1px] bg-slate-800 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] font-black leading-none uppercase">Quote Box</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between cursor-pointer text-slate-350 hover:text-slate-205">
                <span className="font-semibold text-slate-300">Habilitar Layout de Post</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={config.postHabilitado}
                    onChange={(e) => updateField("postHabilitado", e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-8 h-4.5 rounded-full transition-colors ${config.postHabilitado ? "bg-indigo-500" : "bg-zinc-800"}`}></div>
                  <div className={`absolute left-0.5 top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-transform ${config.postHabilitado ? "translate-x-3.5" : ""}`}></div>
                </div>
              </label>
              <p className="text-[10px] text-slate-500 leading-tight select-none">
                Adiciona um card elegante (gerador de postagem) posicionado acima do vídeo do seu lote.
              </p>
            </div>

            {config.postHabilitado && (
              <div className="space-y-3 pt-2.5 border-t border-white/5 animate-fade-in">
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[10px]">Nome do Perfil:</span>
                  <input
                    type="text"
                    placeholder="Ex: Football Central"
                    value={config.postNomeUsuario}
                    onChange={(e) => updateField("postNomeUsuario", e.target.value)}
                    className="w-full bg-[#16161A] border border-white/10 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block text-[10px]">Identificador (arroba):</span>
                  <input
                    type="text"
                    placeholder="Ex: @yourfootballcentra"
                    value={config.postIdentificador}
                    onChange={(e) => updateField("postIdentificador", e.target.value)}
                    className="w-full bg-[#16161A] border border-white/10 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-450 hover:text-slate-200 select-none py-1">
                    <input
                      type="checkbox"
                      checked={config.postCheckVerificado}
                      onChange={(e) => updateField("postCheckVerificado", e.target.checked)}
                      className="w-4 h-4 rounded border-white/10 text-indigo-600 focus:ring-0 focus:outline-none bg-[#16161A] cursor-pointer"
                    />
                    <span>Selo de Verificado (Blue Badge)</span>
                  </label>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block text-[10px]">Texto do Post (Roteiro/Tema):</span>
                  <textarea
                    placeholder="Texto do post motivacional, esportivo ou curiosidades..."
                    value={config.postTexto}
                    onChange={(e) => updateField("postTexto", e.target.value)}
                    rows={3}
                    className="w-full bg-[#16161A] border border-white/10 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-indigo-500/50 resize-none font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block text-[10px]">Estilo Visual do Post:</span>
                  <select
                    value={config.postTema}
                    onChange={(e) => updateField("postTema", e.target.value as "Claro" | "Escuro" | "Transparente")}
                    className="bg-[#16161A] border border-white/10 text-slate-250 text-xs rounded-lg p-2 block w-full focus:outline-none focus:border-indigo-500/50 cursor-pointer"
                  >
                    <option value="Claro">Branco Elegante (Igual ao Print)</option>
                    <option value="Escuro">Preto Moderno (Futurista)</option>
                    <option value="Transparente font-medium">Vidro Translúcido (Glassmorphism)</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <span className="text-slate-400 block text-[10px] font-bold">Foto de Perfil (Avatar):</span>
                  
                  {/* Upload local file area */}
                  <div className="flex gap-2.5">
                    <label className="flex-1 flex flex-col items-center justify-center p-3 border border-dashed border-white/10 hover:border-indigo-500/55 hover:bg-white/5 rounded-lg cursor-pointer transition-all">
                      <Upload className="w-4 h-4 text-slate-400 mb-1" />
                      <span className="text-[10px] text-slate-300 font-medium">Upload do Computador</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileUpload}
                        className="hidden"
                      />
                    </label>
                    
                    {/* Visual preview if avatar exists */}
                    {config.postAvatarUrl && (
                      <div className="w-14 h-14 rounded-full border border-white/10 overflow-hidden shrink-0 self-center flex items-center justify-center bg-zinc-900 shadow-md">
                        <img 
                          src={config.postAvatarUrl} 
                          alt="Avatar" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Link alternative */}
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-500 block">Ou insira a URL da imagem:</span>
                    <input
                      type="text"
                      placeholder="Cole um link de imagem (ex: https://...)"
                      value={config.postAvatarUrl.startsWith("data:") ? "[Arquivo carregado do PC]" : config.postAvatarUrl}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val.startsWith("[Arquivo")) {
                          updateField("postAvatarUrl", val);
                        }
                      }}
                      className="w-full bg-[#16161A] border border-white/10 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-indigo-500/50 font-mono text-[9px]"
                    />
                  </div>

                  {/* Preset library */}
                  <div className="flex gap-2 pt-0.5 font-sans text-[10px] select-none items-center justify-between">
                    <span className="text-slate-500 text-[9px]">Modelos rápidos:</span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateField("postAvatarUrl", "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=60")}
                        className="text-indigo-400 hover:underline cursor-pointer"
                      >
                        [Futebol]
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField("postAvatarUrl", "https://images.unsplash.com/photo-1543351611-58f621151404?w=150&auto=format&fit=crop&q=60")}
                        className="text-indigo-400 hover:underline cursor-pointer"
                      >
                        [Esportes]
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField("postAvatarUrl", "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=150&auto=format&fit=crop&q=60")}
                        className="text-indigo-400 hover:underline cursor-pointer"
                      >
                        [Natureza]
                      </button>
                    </div>
                  </div>
                </div>

                {/* Advanced visual customization of layout elements */}
                <div className="space-y-3.5 pt-3.5 border-t border-white/5 animate-fade-in bg-white/[0.02] p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-1.5 pb-1 border-b border-white/5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-bold text-slate-200 text-[11px] uppercase tracking-wider">Ajustes do Vídeo e do Card</span>
                  </div>

                  {/* 1. Rectangle Video Size Controls */}
                  <div className="space-y-2.5">
                    <span className="text-indigo-300 font-bold block text-[10px] uppercase">Retângulo do Vídeo</span>
                    
                    {/* postVideoWidth */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">Largura do Retângulo (Aumentar lados):</span>
                        <span className="font-mono text-zinc-300">{config.postVideoWidth || 100}%</span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="300"
                        value={config.postVideoWidth || 100}
                        onChange={(e) => updateField("postVideoWidth", parseInt(e.target.value))}
                        className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* postVideoPosX (Move horizontal) */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">Mover Retângulo X (Esquerda/Direita):</span>
                        <span className="font-mono text-zinc-300">{config.postVideoPosX || 0}px</span>
                      </div>
                      <input
                        type="range"
                        min="-200"
                        max="200"
                        value={config.postVideoPosX || 0}
                        onChange={(e) => updateField("postVideoPosX", parseInt(e.target.value))}
                        className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* postVideoPosY (Move vertical) */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">Mover Retângulo Y (Cima/Baixo):</span>
                        <span className="font-mono text-zinc-300">{config.postVideoPosY || 0}px</span>
                      </div>
                      <input
                        type="range"
                        min="-200"
                        max="200"
                        value={config.postVideoPosY || 0}
                        onChange={(e) => updateField("postVideoPosY", parseInt(e.target.value))}
                        className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* postVideoHeight */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">Altura do Retângulo:</span>
                        <span className="font-mono text-zinc-300">{config.postVideoHeight || 240}px</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="400"
                        value={config.postVideoHeight || 240}
                        onChange={(e) => updateField("postVideoHeight", parseInt(e.target.value))}
                        className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* postVideoMarginTop */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">Margem Superior (Abaixo do Texto):</span>
                        <span className="font-mono text-zinc-300">{config.postVideoMarginTop || 12}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="40"
                        value={config.postVideoMarginTop || 12}
                        onChange={(e) => updateField("postVideoMarginTop", parseInt(e.target.value))}
                        className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* postVideoRadius */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400 font-sans">Bordas Arredondadas (Radius):</span>
                        <span className="font-mono text-zinc-300">{config.postVideoRadius || 16}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="32"
                        value={config.postVideoRadius || 16}
                        onChange={(e) => updateField("postVideoRadius", parseInt(e.target.value))}
                        className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* 2. Headline and User Profile elements custom dimensions & offset controls */}
                  <div className="space-y-2.5 pt-2.5 border-t border-white/5">
                    <span className="text-indigo-300 font-bold block text-[10px] uppercase">Alinhamento & Tamanho de Textos</span>

                    {/* postAvatarSize */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">Tamanho da Foto de Perfil:</span>
                        <span className="font-mono text-zinc-300">{config.postAvatarSize || 40}px</span>
                      </div>
                      <input
                        type="range"
                        min="24"
                        max="72"
                        value={config.postAvatarSize || 40}
                        onChange={(e) => updateField("postAvatarSize", parseInt(e.target.value))}
                        className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* postPerfilSize */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">Tamanho do Nome/Arroba:</span>
                        <span className="font-mono text-zinc-300">{config.postPerfilSize || 12}px</span>
                      </div>
                      <input
                        type="range"
                        min="8"
                        max="24"
                        value={config.postPerfilSize || 12}
                        onChange={(e) => updateField("postPerfilSize", parseInt(e.target.value))}
                        className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* postHeadlineSize */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">Tamanho da Headline (Texto do Post):</span>
                        <span className="font-mono text-zinc-300">{config.postHeadlineSize || 12}px</span>
                      </div>
                      <input
                        type="range"
                        min="8"
                        max="24"
                        value={config.postHeadlineSize || 12}
                        onChange={(e) => updateField("postHeadlineSize", parseInt(e.target.value))}
                        className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* postHeadlineMarginTop */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400 font-sans">Mover Headline (Espaço Superior):</span>
                        <span className="font-mono text-zinc-300">{config.postHeadlineMarginTop || 0}px</span>
                      </div>
                      <input
                        type="range"
                        min="-20"
                        max="40"
                        value={config.postHeadlineMarginTop || 0}
                        onChange={(e) => updateField("postHeadlineMarginTop", parseInt(e.target.value))}
                        className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* postHeadlineAlign */}
                    <div className="space-y-1">
                      <span className="text-slate-400 text-[10px] block">Alinhamento do Texto da Headline:</span>
                      <div className="grid grid-cols-3 gap-1 pt-0.5">
                        {(["Left", "Center", "Right"] as const).map((align) => (
                          <button
                            key={align}
                            type="button"
                            onClick={() => updateField("postHeadlineAlign", align)}
                            className={`py-1 rounded text-[9px] font-bold border transition-all cursor-pointer ${
                              config.postHeadlineAlign === align
                                ? "bg-indigo-950 border-indigo-500/40 text-indigo-300"
                                : "bg-black/45 border-white/5 text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            {align === "Left" ? "Esquerda" : align === "Center" ? "Centro" : "Direita"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
