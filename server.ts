import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY environment variable is not configured correctly.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Endpoint for generating retention-focused video scripts
app.post("/api/generate-script", async (req, res) => {
  try {
    const { theme } = req.body;
    if (!theme || typeof theme !== "string" || theme.trim().length === 0) {
      return res.status(400).json({ error: "O tema do vídeo é obrigatório." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "Serviço temporariamente indisponível. Por favor, verifique se a chave GEMINI_API_KEY está configurada no painel de Secrets.",
      });
    }

    const promptSystem = `Você é o motor de inteligência artificial de um software de automação de vídeos curtos (Shorts, Reels, TikTok) focado em alta retenção. Sua função é receber um tema ou nicho e gerar um roteiro perfeitamente estruturado, pronto para ser processado por um motor de renderização de vídeo.

Regras de Conteúdo:
- O Gancho (Hook): Os primeiros 3 segundos precisam ser extremamente impactantes, gerando curiosidade ou quebrando uma expectativa importante relacionada ao tema.
- O Desenvolvimento: O conteúdo deve ser dinâmico, direto ao ponto, sem enrolação ou palavras redundantes e difíceis. Explique fatos chamativos rapidamente.
- O Desfecho (CTA): Termine com uma pergunta que induza o público a comentar de forma inflamada ou curiosa, ou crie um final que gere um loop de repetição perfeito (em que a última palavra do roteiro se conecte de volta com o gancho inicial do vídeo).

Regras de Formatação: Retorne EXCLUSIVAMENTE o conteúdo em formato JSON estruturado seguindo o esquema estipulado. Evite explicações adicionais pré- ou pós-conteúdo.`;

    const userPrompt = `Gere um roteiro com alta retenção para o nicho/tema de vídeo: "${theme.trim()}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: promptSystem,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["meta_dados", "roteiro_audio", "cenas_edicao"],
          properties: {
            meta_dados: {
              type: Type.OBJECT,
              required: ["titulo_sugerido", "tags", "descricao"],
              properties: {
                titulo_sugerido: {
                  type: Type.STRING,
                  description: "Um título curto e muito chamativo para a plataforma (ex: Shorts, TikTok, Reels)",
                },
                tags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Array de tags em formato minúsculo e focado no algoritmo",
                },
                descricao: {
                  type: Type.STRING,
                  description: "Descrição otimizada com hashtags altamente engajadoras",
                },
              },
            },
            roteiro_audio: {
              type: Type.STRING,
              description: "Texto corrido completo e detalhado para ser enviado diretamente ao software de narração TTS sem códigos ou parênteses.",
            },
            cenas_edicao: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["tempo_estimado", "texto_legenda", "estilo_visual"],
                properties: {
                  tempo_estimado: {
                    type: Type.STRING,
                    description: "Intervalo estimado da cena, ex: '0-3s', '3-6s', '6-10s'",
                  },
                  texto_legenda: {
                    type: Type.STRING,
                    description: "Texto curto, direto e de altíssimo impacto para ser exibido no centro da tela para retenção da legenda",
                  },
                  estilo_visual: {
                    type: Type.STRING,
                    description: "Sugestão de estilo visual ou palavra-chave exata para o fundo cinematográfico, mistério, suspense, roblox, espaço, etc.",
                  },
                },
              },
            },
          },
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Resposta vazia recebida da API Gemini.");
    }

    // Try to parse to validate it is legal JSON
    const parsedData = JSON.parse(jsonText);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Erro na rota de geração:", error);
    res.status(500).json({
      error: "Ocorreu um erro ao processar o roteiro com inteligência artificial.",
      detalhes: error instanceof Error ? error.message : String(error),
    });
  }
});

// Serve health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Setup Vite Dev server / static build pipeline
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Dev: Vite Middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Prod: Serving built files from dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
