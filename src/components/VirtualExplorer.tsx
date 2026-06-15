import React, { useState } from "react";
import { 
  Folder, 
  FileVideo, 
  FileAudio, 
  Download, 
  Trash2, 
  X, 
  HardDrive, 
  ChevronRight, 
  Eye, 
  Search,
  ExternalLink,
  CheckCircle,
  HelpCircle,
  Clock
} from "lucide-react";
import { VideoTemplate, AudioTrack, RenderedOutput } from "../types";

interface VirtualExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab: "entrada" | "saida";
  templates: VideoTemplate[];
  audioTracks: AudioTrack[];
  renderedOutputs: RenderedOutput[];
  onDeleteTemplate: (id: string) => void;
  onDeleteAudio: (id: string) => void;
  onDeleteRender?: (id: string) => void;
  onUploadVideo: (fileOrFiles: File | File[] | FileList) => void;
  onUploadAudio: (fileOrFiles: File | File[] | FileList) => void;
}

export default function VirtualExplorer({
  isOpen,
  onClose,
  initialTab,
  templates,
  audioTracks,
  renderedOutputs,
  onDeleteTemplate,
  onDeleteAudio,
  onDeleteRender,
  onUploadVideo,
  onUploadAudio
}: VirtualExplorerProps) {
  const [activeFolder, setActiveFolder] = useState<"entrada" | "saida">(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadMock = (fileName: string, id: string) => {
    // Generate a simple text file representing the metadata/config of the short
    const mockContent = `ClipLote Studio PRO - Render File\nArquivo: ${fileName}\nData: ${new Date().toLocaleDateString()}\nStatus: COMPILADO COM SUCESSO 1080p HD x264\n\nEste é um arquivo compilado simulado de alta taxa de compressão e retenção. Obrigado por usar o ClipLote Studio!`;
    const blob = new Blob([mockContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName.replace(".mp4", "_PROCESSADO.txt");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessId(id);
    setTimeout(() => {
      setDownloadSuccessId(null);
    }, 2000);
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUploadVideo(files);
    }
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUploadAudio(files);
    }
  };

  const filteredTemplates = templates.filter(t => 
    t.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAudios = audioTracks.filter(a => 
    a.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOutputs = renderedOutputs.filter(o => 
    o.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 select-none font-sans">
      <div className="bg-[#111116] border border-white/10 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-fade-in">
        
        {/* Header line */}
        <div className="p-4 bg-[#14141c] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <HardDrive className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-white text-sm font-black uppercase tracking-wide flex items-center gap-1.5">
                Gerenciador Virtual de Pastas (Explorador Lote)
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">
                Disco Virtual Seguro • Sandbox Temporária do Navegador
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1 px-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Tool-bar */}
        <div className="p-3 bg-[#0d0d12] border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input 
              type="text"
              placeholder="Pesquisar arquivos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#16161c] border border-white/5 text-xs text-slate-200 pl-8 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500/30 w-56 font-mono"
            />
          </div>

          <div className="flex gap-2">
            {activeFolder === "entrada" && (
              <div className="flex gap-1.5">
                <label className="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg cursor-pointer flex items-center gap-1 transition shadow-md shadow-indigo-600/10">
                  <FileVideo className="w-3.5 h-3.5" />
                  + Upload Vídeo (PC)
                  <input 
                    type="file" 
                    accept="video/*" 
                    multiple
                    onChange={handleVideoFileChange} 
                    className="hidden" 
                  />
                </label>
                <label className="bg-zinc-800 hover:bg-zinc-700 text-slate-200 text-[11px] font-semibold py-1.5 px-3 rounded-lg cursor-pointer flex items-center gap-1 transition border border-white/5">
                  <FileAudio className="w-3.5 h-3.5" />
                  + Upload Áudio (MP3)
                  <input 
                    type="file" 
                    accept="audio/*" 
                    multiple
                    onChange={handleAudioFileChange} 
                    className="hidden" 
                  />
                </label>
              </div>
            )}
            <span className="text-[10px] bg-white/5 text-slate-400 border border-white/5 px-2.5 py-1.5 rounded-lg font-mono">
              Espaço Virtual Utilizado: {((templates.length * 15.2) + (audioTracks.length * 3.4)).toFixed(1)} MB / 2 GB
            </span>
          </div>
        </div>

        {/* Working Workspace Columns */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Quick sidebar location shortcuts */}
          <div className="w-[200px] bg-[#0d0d12] border-r border-[#1a1a24] p-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold text-slate-500 uppercase block px-2 tracking-widest">Atalhos de Sistema</span>
              
              <button
                onClick={() => setActiveFolder("entrada")}
                className={`w-full flex items-center justify-between text-left px-2.5 py-2 rounded-lg text-xs font-bold transition ${
                  activeFolder === "entrada" 
                    ? "bg-[#181a24] text-indigo-400 border border-indigo-550/15" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Folder className={`w-4 h-4 ${activeFolder === "entrada" ? "text-indigo-400" : "text-slate-500"}`} />
                  📥 Entrada (clips)
                </span>
                <span className="text-[9px] font-mono opacity-60">({templates.length + audioTracks.length})</span>
              </button>

              <button
                onClick={() => setActiveFolder("saida")}
                className={`w-full flex items-center justify-between text-left px-2.5 py-2 rounded-lg text-xs font-bold transition ${
                  activeFolder === "saida" 
                    ? "bg-[#181a24] text-indigo-400 border border-indigo-550/15" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Folder className={`w-4 h-4 ${activeFolder === "saida" ? "text-indigo-400" : "text-slate-500"}`} />
                  📤 Saída (renders)
                </span>
                <span className="text-[9px] font-mono opacity-60">({renderedOutputs.length})</span>
              </button>
            </div>

            {/* Local disk details */}
            <div className="bg-[#14141a] p-2.5 rounded-lg border border-white/5 text-[9.5px]">
              <span className="text-slate-500 block">Diretório Simulado:</span>
              <span className="text-slate-350 block truncate font-mono select-all font-bold mt-1">
                {activeFolder === "entrada" 
                  ? ".\\input_raw_media\\clips\\" 
                  : ".\\output_render\\shorts_gerados\\"
                }
              </span>
              <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="bg-indigo-550 h-full w-[2.4%]" />
              </div>
            </div>
          </div>

          {/* Main workspace explorer list */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#0d0d12]">
            {activeFolder === "entrada" ? (
              // ENTRADA FILES (Uploaded Videos & Audio Clips)
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2.5">
                    Vídeos Importados na Entrada (fundo dos shorts)
                  </h4>
                  {filteredTemplates.length === 0 ? (
                    <p className="text-[11px] text-zinc-500 italic bg-white/5 p-3 rounded-lg border border-white/5">Nenhum vídeo encontrado nesta pasta.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {filteredTemplates.map(item => (
                        <div key={item.id} className="flex items-center justify-between bg-zinc-950 p-2.5 rounded-lg border border-white/5 hover:border-indigo-500/20 transition-all font-mono text-[10px]">
                          <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
                            <FileVideo className="w-5 h-5 text-indigo-400 shrink-0" />
                            <div className="truncate">
                              <span className="text-slate-200 block truncate font-semibold">{item.nome}</span>
                              <span className="text-[8px] text-zinc-500">Formato: MP4 • Categoria: {item.categoria}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => onDeleteTemplate(item.id)}
                            className="p-1.5 hover:bg-red-950/20 text-slate-500 hover:text-red-400 rounded shrink-0 transition"
                            title="Deletar arquivo físico"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2.5">
                    Músicas & Trilhas Sonoras Carregadas
                  </h4>
                  {filteredAudios.length === 0 ? (
                    <p className="text-[11px] text-zinc-500 italic bg-white/5 p-3 rounded-lg border border-white/5">Nenhuma trilha sonora carregada ainda.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {filteredAudios.map(audio => (
                        <div key={audio.id} className="flex items-center justify-between bg-zinc-950 p-2.5 rounded-lg border border-white/5 hover:border-indigo-500/20 transition-all font-mono text-[10px]">
                          <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
                            <FileAudio className="w-5 h-5 text-emerald-400 shrink-0" />
                            <div className="truncate">
                              <span className="text-slate-200 block truncate font-semibold">{audio.nome}</span>
                              <span className="text-[8px] text-zinc-500">Tamanho: ~3.4MB • Trilha de Copyright Livre</span>
                            </div>
                          </div>
                          <button
                            onClick={() => onDeleteAudio(audio.id)}
                            className="p-1.5 hover:bg-red-950/20 text-slate-500 hover:text-red-400 rounded shrink-0 transition"
                            title="Deletar trilha"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // SAIDA FILES (Rendered output shorts)
              <div className="space-y-3 font-mono text-[11px]">
                <div className="p-3 bg-indigo-550/10 rounded-lg border border-indigo-500/20 mb-4 flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div className="text-[10px] text-slate-300 leading-relaxed font-sans">
                    <strong>Pasta de Renderização Ativa:</strong> Estes são seus vídeos finais montados em lote com os profiles sociais Twitter/X, marca d'água integrada e legendas geradas por IA. Clique em <strong>Baixar</strong> para salvar cada arquivo diretamente em seu Computador!
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {filteredOutputs.map(output => (
                    <div 
                      key={output.id} 
                      className="flex items-center justify-between bg-[#13131a] p-3 rounded-xl border border-white/5 hover:border-indigo-500/20 transition duration-150"
                    >
                      <div className="flex items-center gap-3 overflow-hidden flex-1 mr-4">
                        <div className="relative shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
                          <FileVideo className="w-5 h-5" />
                          <span className="absolute bottom-1 right-1 text-[7px] font-bold font-sans bg-emerald-500 text-white leading-none rounded-full px-1">HD</span>
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-slate-200 block truncate font-bold font-mono text-xs">{output.nome}</span>
                          <div className="flex items-center gap-2 mt-0.5 text-[9px] text-slate-500 font-sans font-medium">
                            <span>Tamanho: {output.tamanho}</span>
                            <span>•</span>
                            <span>Duração: {output.duracao}</span>
                            <span>•</span>
                            <span>Renderizado: {output.data}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleDownloadMock(output.nome, output.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold font-sans transition-all cursor-pointer ${
                            downloadSuccessId === output.id
                              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/10"
                          }`}
                        >
                          {downloadSuccessId === output.id ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              Concluído!
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5 animate-bounce-slow" />
                              Baixar Vídeo (MP4)
                            </>
                          )}
                        </button>
                        {onDeleteRender && (
                          <button
                            onClick={() => onDeleteRender(output.id)}
                            className="p-1.5 hover:bg-red-950/20 text-slate-500 hover:text-red-400 rounded shrink-0 transition"
                            title="Excluir arquivo compilado"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer instructions */}
        <div className="p-3 bg-[#0d0d12] border-t border-white/5 flex justify-between items-center text-[10px] font-medium text-slate-500">
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
            Clique duas vezes no arquivo em Entrada para ativá-lo como o template ativo na preview.
          </span>
          <span className="font-mono text-[9px]">ClipLote v2.4 SSD Driver</span>
        </div>

      </div>
    </div>
  );
}
