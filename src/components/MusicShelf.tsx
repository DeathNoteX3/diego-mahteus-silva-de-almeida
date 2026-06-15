import React, { useState, useRef, useEffect } from "react";
import { 
  Music, 
  Play, 
  Pause, 
  Trash2, 
  Upload, 
  Volume2, 
  VolumeX, 
  Check, 
  Sparkles,
  Plus
} from "lucide-react";
import { AudioTrack } from "../types";

interface MusicShelfProps {
  audioTracks: AudioTrack[];
  onSelectTrack: (id: string) => void;
  onDeleteTrack: (id: string) => void;
  onAddTrack: (fileOrFiles: File | File[] | FileList) => void;
  onActionTrigger: (action: string) => void;
}

export default function MusicShelf({
  audioTracks,
  onSelectTrack,
  onDeleteTrack,
  onAddTrack,
  onActionTrigger
}: MusicShelfProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop playing if track list changes unexpectedly or track is deleted
  useEffect(() => {
    if (playingId && !audioTracks.some(t => t.id === playingId)) {
      stopAudio();
    }
  }, [audioTracks, playingId]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayingId(null);
  };

  const handlePlayToggle = (track: AudioTrack, e: React.MouseEvent) => {
    e.stopPropagation();

    // If already playing this track, pause it
    if (playingId === track.id) {
      stopAudio();
      return;
    }

    // Stop current
    stopAudio();

    // Setup source and play
    const sourceUrl = track.audioUrl || getFallbackMockAudio(track.id);
    if (!audioRef.current) {
      audioRef.current = new Audio(sourceUrl);
    } else {
      audioRef.current.src = sourceUrl;
    }

    audioRef.current.loop = true;
    audioRef.current.volume = 0.55;
    
    audioRef.current.play()
      .then(() => {
        setPlayingId(track.id);
      })
      .catch((err) => {
        console.error("Playback failed", err);
        alert(`Não foi possível reproduzir a prévia: ${track.nome}. Verifique o formato do arquivo.`);
      });
  };

  // Safe release of audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.currentSrc = "";
      }
    };
  }, []);

  const getFallbackMockAudio = (id: string) => {
    // Return high quality open source background audio loop examples (using internet archives or royalty-free streams)
    const fallbacks: Record<string, string> = {
      "1": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      "2": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      "3": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
      "4": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    };
    return fallbacks[id] || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onAddTrack(files);
    }
  };

  return (
    <div className="pt-3 border-t border-white/5 space-y-3">
      {/* Hidden audio element helper */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
          <Music className="w-3.5 h-3.5 text-indigo-400" />
          Biblioteca de Áudio Lote
        </span>

        <label className="text-[10px] bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-bold px-2 py-1 rounded-md border border-indigo-500/20 flex items-center gap-1 cursor-pointer transition">
          <Plus className="w-3 h-3" />
          Importar
          <input 
            type="file" 
            accept="audio/*" 
            multiple
            onChange={handleFileUpload} 
            className="hidden" 
          />
        </label>
      </div>

      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
        {audioTracks.length === 0 ? (
          <p className="text-[10px] text-slate-550 italic text-center py-2">
            Nenhuma música importada.
          </p>
        ) : (
          audioTracks.map((track) => {
            const isSelected = track.selected;
            const isPlaying = playingId === track.id;

            return (
              <div 
                key={track.id}
                onClick={() => onSelectTrack(track.id)}
                className={`flex items-center gap-2 p-1.5 rounded-lg border transition-all text-xs cursor-pointer ${
                  isSelected 
                    ? "bg-[#181a26]/90 border-indigo-550/45 text-white" 
                    : "bg-[#111115] border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-300"
                }`}
              >
                {/* Play states */}
                <button
                  type="button"
                  onClick={(e) => handlePlayToggle(track, e)}
                  title={isPlaying ? "Pausar prévia" : "Ouvir trilha"}
                  className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                    isPlaying 
                      ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" 
                      : "bg-[#16161c] hover:bg-[#1f1f26] border border-white/5"
                  }`}
                >
                  {isPlaying ? (
                    <Pause className="w-3 h-3 fill-current text-indigo-400" />
                  ) : (
                    <Play className="w-3 h-3 fill-current text-slate-400 hover:text-slate-200 ml-0.5" />
                  )}
                </button>

                {/* Track text label info */}
                <div className="flex-1 overflow-hidden min-w-0 pr-1 select-none">
                  <span className="block truncate font-semibold font-mono text-[10px] leading-tight">
                    {track.nome}
                  </span>
                  <span className="text-[8px] font-mono text-slate-500 block leading-none mt-0.5">
                    Trilha • Dura: {track.duracao}
                  </span>
                </div>

                {/* Active selection tick representation */}
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center self-center" title="Trilha Ativa de Lote">
                    <Check className="w-2.5 h-2.5 text-white stroke-[3.5]" />
                  </div>
                )}

                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Excluir trilha sonora "${track.nome}"?`)) {
                      onDeleteTrack(track.id);
                    }
                  }}
                  className="p-1 text-slate-600 hover:text-red-400 hover:bg-white/5 rounded transition"
                  title="Deletar trilha"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
