import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { defaultCVProfile } from './src/data/cvData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

const app = express();
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/live' });

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

function buildSystemInstruction(cv = defaultCVProfile): string {
  return `Role & Persona:
You are a friendly, professional AI voice assistant named "Albanian queen".
Your voice is female, warm, dynamic, and encouraging.
Your primary goal is to help users present, explore, and discuss their professional background, experience, skills, and resume/CV.

Language Capabilities:
- You are completely fluent in English, French, and Albanian (Shqip).
- Detect the user's language automatically or switch immediately when requested (e.g. if spoken to in Albanian, answer in Albanian; if French, answer in French; if English, answer in English).
- Maintain the same warm, uplifting, and professional tone in all three languages.

Visual & Vibe Inspiration:
Your personality reflects a bright, high-energy, beach-tropical vibe (vibrant pinks, warm sunset oranges, sunny yellow, and sparkling ocean blue). Stay energetic, clear, positive, and deeply helpful.

Core Tasks:
1. Ask concise, engaging questions about the user's work history, skills, education, and career goals.
2. Summarize key parts of their CV clearly upon request.
3. Provide constructive feedback or suggestions to highlight their strengths.
4. Keep your spoken responses short, structured, and easy to follow out loud (aim for 2-4 sentences max per spoken response unless specifically asked for a full list).

Candidate Profile Context (Elisa-Dalis Skenderi):
- Full Name: ${cv.name}
- Headline: ${cv.headline}
- Goal: Seeking an ${cv.targetRole} (${cv.availability})
- Contact: ${cv.location}, ${cv.email}, ${cv.phone}, ${cv.license}
- Key Experiences:
${cv.experiences.map((e) => `  * ${e.role} at ${e.company} (${e.location}, ${e.period}) - ${e.highlights.join('; ')}`).join('\n')}
- International Education:
${cv.education.map((ed) => `  * ${ed.degree} - ${ed.institution} (${ed.location}, ${ed.period}) ${ed.specialty ? `[${ed.specialty}]` : ''}`).join('\n')}
- Hard Skills: ${cv.hardSkills.join(', ')}
- Soft Skills: ${cv.softSkills.join(', ')}
- Languages: ${cv.languages.map((l) => `${l.language} (${l.level} - ${l.note})`).join(', ')}
- Interests & Association: ${cv.interests.join(', ')}. Association: ${cv.associations.join(', ')}

Special Guidance for Spoken Voice Conversations:
- Use natural spoken pacing, warm enthusiasm, and friendly encouragement.
- Never read raw bullet characters or robotic markdown lists aloud; weave them naturally into smooth speech.
- When conducting mock interviews, ask ONE clear question at a time so the candidate can answer naturally.
- In Albanian, greet warmly with natural expressions like: "Mirëdita! Jam Albanian queen, gati të të ndihmoj me CV-në dhe karrierën tënde!"
- In French: "Bonjour ! Je suis Albanian queen, ravie de t'accompagner pour booster ta candidature et préparer tes entretiens !"
- In English: "Hello! I am Albanian queen, your personal voice coach ready to help you shine in your career!"`;
}

// WebSocket live voice bridge
wss.on('connection', async (clientWs: WebSocket) => {
  let session: any = null;
  let isSessionReady = false;
  const pendingAudioQueue: string[] = [];

  const sendClient = (payload: any) => {
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify(payload));
    }
  };

  try {
    const defaultVoice = 'Aoede'; // Female, warm, energetic
    const systemPrompt = buildSystemInstruction();

    session = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: defaultVoice },
          },
        },
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        outputAudioTranscription: {},
        inputAudioTranscription: {},
      },
      callbacks: {
        onopen: () => {
          isSessionReady = true;
          sendClient({ type: 'status', status: 'connected', voice: defaultVoice });

          // Flush any buffered audio
          while (pendingAudioQueue.length > 0) {
            const chunk = pendingAudioQueue.shift();
            if (chunk) {
              session.sendRealtimeInput({
                audio: { data: chunk, mimeType: 'audio/pcm;rate=16000' },
              });
            }
          }
        },
        onmessage: (message: LiveServerMessage) => {
          // Model audio chunk
          const parts = message.serverContent?.modelTurn?.parts;
          if (parts) {
            for (const part of parts) {
              if (part.inlineData?.data) {
                sendClient({
                  type: 'audio',
                  audio: part.inlineData.data,
                });
              }
              if (part.text) {
                sendClient({
                  type: 'transcription',
                  text: part.text,
                  sender: 'assistant',
                });
              }
            }
          }

          // Output transcription from speech
          if (message.serverContent?.outputTranscription?.text) {
            sendClient({
              type: 'transcription',
              text: message.serverContent.outputTranscription.text,
              sender: 'assistant',
            });
          }

          // Input transcription from user speech
          if (message.serverContent?.inputTranscription?.text) {
            sendClient({
              type: 'transcription',
              text: message.serverContent.inputTranscription.text,
              sender: 'user',
            });
          }

          // Interrupted by user speaking
          if (message.serverContent?.interrupted) {
            sendClient({ type: 'interrupted' });
          }

          // Turn complete
          if (message.serverContent?.turnComplete) {
            sendClient({ type: 'turnComplete' });
          }
        },
        onerror: (err: any) => {
          console.error('[Live API Error]', err);
          sendClient({
            type: 'error',
            message: err?.message || 'Error occurred during Live API session.',
          });
        },
        onclose: () => {
          sendClient({ type: 'status', status: 'disconnected' });
        },
      },
    });

    isSessionReady = true;
  } catch (err: any) {
    console.error('[Live Connect Exception]', err);
    sendClient({
      type: 'error',
      message:
        err?.message ||
        'Unable to initialize Gemini Live API. Please ensure GEMINI_API_KEY is configured in Secrets.',
    });
  }

  clientWs.on('message', async (raw) => {
    try {
      const data = JSON.parse(raw.toString());

      if (data.type === 'audio' && data.audio) {
        if (session && isSessionReady) {
          session.sendRealtimeInput({
            audio: { data: data.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        } else {
          pendingAudioQueue.push(data.audio);
        }
      } else if (data.type === 'text' && data.text) {
        if (session && isSessionReady) {
          session.sendClientContent({
            turns: [
              {
                role: 'user',
                parts: [{ text: data.text }],
              },
            ],
            turnComplete: true,
          });
          // Echo user text transcription back
          sendClient({
            type: 'transcription',
            text: data.text,
            sender: 'user',
          });
        }
      } else if (data.type === 'endAudio') {
        if (session && isSessionReady) {
          session.sendRealtimeInput({ audioStreamEnd: true });
        }
      } else if (data.type === 'switchVoice' && data.voice) {
        // Reconnect session with new voice if requested
        try {
          if (session) {
            session.close();
          }
          isSessionReady = false;
          session = await ai.live.connect({
            model: 'gemini-3.8-live',
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: data.voice },
                },
              },
              systemInstruction: {
                parts: [{ text: buildSystemInstruction(data.cvProfile || defaultCVProfile) }],
              },
              outputAudioTranscription: {},
              inputAudioTranscription: {},
            },
            callbacks: {
              onopen: () => {
                isSessionReady = true;
                sendClient({ type: 'status', status: 'connected', voice: data.voice });
              },
              onmessage: (msg: LiveServerMessage) => {
                const parts = msg.serverContent?.modelTurn?.parts;
                if (parts) {
                  for (const part of parts) {
                    if (part.inlineData?.data) {
                      sendClient({ type: 'audio', audio: part.inlineData.data });
                    }
                    if (part.text) {
                      sendClient({
                        type: 'transcription',
                        text: part.text,
                        sender: 'assistant',
                      });
                    }
                  }
                }
                if (msg.serverContent?.outputTranscription?.text) {
                  sendClient({
                    type: 'transcription',
                    text: msg.serverContent.outputTranscription.text,
                    sender: 'assistant',
                  });
                }
                if (msg.serverContent?.inputTranscription?.text) {
                  sendClient({
                    type: 'transcription',
                    text: msg.serverContent.inputTranscription.text,
                    sender: 'user',
                  });
                }
                if (msg.serverContent?.interrupted) sendClient({ type: 'interrupted' });
                if (msg.serverContent?.turnComplete) sendClient({ type: 'turnComplete' });
              },
              onerror: (e: any) => {
                sendClient({ type: 'error', message: e?.message || 'Voice switch error' });
              },
              onclose: () => sendClient({ type: 'status', status: 'disconnected' }),
            },
          });
          isSessionReady = true;
        } catch (e: any) {
          sendClient({ type: 'error', message: e?.message || 'Failed to switch voice' });
        }
      }
    } catch (parseErr) {
      console.error('[Client Message Parse Error]', parseErr);
    }
  });

  clientWs.on('close', () => {
    try {
      if (session) {
        session.close();
      }
    } catch (e) {
      // ignore
    }
  });
});

// REST Endpoint: Check API status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    liveModel: 'gemini-3.8-live',
    textModel: 'gemini-3.8-flash',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// REST Endpoint: Text chat fallback / query
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, language = 'en' } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemPrompt = `${buildSystemInstruction()}\n\nNote: This is a written interaction. Keep the answer structured, encouraging, high-energy beach-tropical vibe, in the user's language (${language}).`;

    const contents = [];
    if (Array.isArray(history)) {
      for (const h of history) {
        contents.push({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.text }],
        });
      }
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents as any,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate response' });
  }
});

// REST Endpoint: Deep CV Analysis & Recommendations
app.post('/api/cv/analyze', async (req, res) => {
  try {
    const { cvProfile = defaultCVProfile, language = 'fr' } = req.body;

    const prompt = `As "Albanian queen", a warm, high-energy, beach-tropical vibe career coach, review this CV for Elisa-Dalis Skenderi:
Headline: ${cvProfile.headline}
Target: ${cvProfile.targetRole} (${cvProfile.availability})
Education: ${cvProfile.education.map((e: any) => `${e.degree} at ${e.institution}`).join(', ')}
Experience: ${cvProfile.experiences.map((e: any) => `${e.role} at ${e.company}`).join(', ')}
Skills: ${cvProfile.hardSkills.join(', ')} / Soft: ${cvProfile.softSkills.join(', ')}
Languages: ${cvProfile.languages.map((l: any) => `${l.language} (${l.level})`).join(', ')}

Provide an energetic, professional analysis in the selected language (${language}):
1. Top 3 Standout Strengths (Why luxury brands or international firms would love her)
2. 3 Actionable Suggestions to enhance her CV and interview readiness
3. A ready-to-use 30-Second Elevator Pitch
4. 3 Great interview questions a luxury brand recruiter might ask her.

Format your response cleanly with clear headings and energetic encouragement!`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are Albanian queen: friendly, professional, warm, female persona with a beach-tropical high-energy vibe.',
        temperature: 0.7,
      },
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error('CV analysis error:', error);
    res.status(500).json({ error: error?.message || 'Failed to analyze CV' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Albanian Queen Voice Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
