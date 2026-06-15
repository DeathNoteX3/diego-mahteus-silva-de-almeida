export interface MetaDados {
  titulo_sugerido: string;
  tags: string[];
  descricao: string;
}

export interface CenaEdicao {
  tempo_estimado: string;
  texto_legenda: string;
  estilo_visual: string;
}

export interface ScriptApiResponse {
  meta_dados: MetaDados;
  roteiro_audio: string;
  cenas_edicao: CenaEdicao[];
}

export interface VideoTemplate {
  id: string;
  nome: string;
  duracao: string;
  categoria: string;
  thumbnailColor: string; // fallback color for preview
  mockVideoUrl?: string;
  thumbnailUrl?: string;
  selected: boolean;
}

export interface AudioTrack {
  id: string;
  nome: string;
  duracao: string;
  selected: boolean;
  audioUrl?: string;
}

export interface EditorConfig {
  pixelsDescer: number;
  corBorda: string;
  qualidade: "480p" | "720p" | "1080p";
  semBordas: boolean;
  molduraPersonalizada: boolean;
  melhorarAudio: boolean;
  antiDuplicidade: boolean;
  textoNoVideo: boolean;
  musicaEmMassa: boolean;
  
  // Efeitos tab
  espelharVideo: boolean;
  cortarInicioFim: boolean;
  ajusteAutomatico: boolean;
  velocidadeMultiplier: number;
  ativarVelocidadePersonalizada: boolean;

  // Marca d'água tab
  textoMarcaAgua: string;
  corMarca: string;
  fonteMarca: string;
  ativarFundoMarca: boolean;
  corFundoMarca: string;
  tamanhoMarca: number;
  posHorizMarca: number;
  posVertMarca: number;
  opacidadeMarca: number;

  // Editor individual
  videoPosX: number;
  videoPosY: number;
  videoScale: number;
  inverterIndividual: boolean;
  individualTextColor: string;
  individualTextFont: string;
  individualTextSize: number;

  // Layout de Post Social (X/Insta Overlay)
  postHabilitado: boolean;
  postNomeUsuario: string;
  postIdentificador: string;
  postTexto: string;
  postAvatarUrl: string;
  postTema: "Claro" | "Escuro" | "Transparente";
  postCheckVerificado: boolean;
  postLayoutType: "tweet" | "torn_neon" | "centered_card";

  // New customizable properties requested by user
  postExibirLegendas: boolean;
  postExibirMarca: boolean;
  fonteCustomizadaPC: string; // User's custom typed PC font name (e.g. Arial, Impact, Comic Sans MS)
  fonteCustomizadaPCAgua: string; // For watermark
  
  // Custom video container box adjustments (width, height, rounding, vertical offsets)
  postVideoWidth: number; // percentage width: 30% to 300%
  postVideoHeight: number; // custom height in pixels (100 to 400)
  postVideoRadius: number; // rounding of video container (0px to 32px)
  postVideoMarginTop: number; // spacing above video (0px to 40px)
  postVideoPosX?: number; // X offset of video rectangle (pixels)
  postVideoPosY?: number; // Y offset of video rectangle (pixels)
  
  // Alignment & offset parameters for parts of the card
  postAvatarSize: number; // 24px - 72px
  postPerfilSize: number; // size of name/username text
  postHeadlineSize: number; // size of the tweet text (8px - 24px)
  postHeadlineMarginTop: number; // space separating text & header (2px - 24px)
  postHeadlineAlign: "Left" | "Center" | "Right";
}

export interface RenderedOutput {
  id: string;
  nome: string;
  tamanho: string;
  duracao: string;
  data: string;
  status: string;
}

