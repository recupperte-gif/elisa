import { useState, useEffect, useRef, useCallback } from 'react';
import {
  floatTo16BitPCM,
  arrayBufferToBase64,
  calculateRMS,
  LiveAudioPlayer,
} from '../utils/audioUtils';

export interface TranscriptItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export type ConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'error'
  | 'disconnected';

export function useLiveVoice() {
  const [status, setStatus] = useState<ConnectionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [assistantSpeaking, setAssistantSpeaking] = useState<boolean>(false);
  const [userSpeaking, setUserSpeaking] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [currentVoice, setCurrentVoice] = useState<string>('Aoede');

  const wsRef = useRef<WebSocket | null>(null);
  const playerRef = useRef<LiveAudioPlayer | null>(null);
  const micAudioCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  // Active assistant turn accumulator for streaming text transcription
  const currentAssistantTurnRef = useRef<string>('');
  const currentUserTurnRef = useRef<string>('');

  // Setup Live Audio Player for 24kHz output
  useEffect(() => {
    playerRef.current = new LiveAudioPlayer((level) => {
      const smoothed = Math.min(1, level * 5.5);
      setAudioLevel((prev) => prev * 0.4 + smoothed * 0.6);
      setAssistantSpeaking(smoothed > 0.04);
    });

    return () => {
      playerRef.current?.close();
    };
  }, []);

  // Connect WebSocket to /live
  const connect = useCallback(() => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    setStatus('connecting');
    setErrorMessage(null);

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/live`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'status' && data.status) {
          if (data.status === 'connected') {
            setStatus('connected');
          } else if (data.status === 'disconnected') {
            setStatus('disconnected');
          }
        } else if (data.type === 'audio' && data.audio) {
          playerRef.current?.playChunk(data.audio);
          setAssistantSpeaking(true);
        } else if (data.type === 'transcription') {
          const { text, sender } = data;
          if (!text) return;

          if (sender === 'assistant') {
            setTranscripts((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.sender === 'assistant' && last.isStreaming) {
                return [
                  ...prev.slice(0, -1),
                  { ...last, text: last.text + text },
                ];
              } else {
                return [
                  ...prev,
                  {
                    id: `trans-${Date.now()}-${Math.random()}`,
                    sender: 'assistant',
                    text: text,
                    timestamp: new Date(),
                    isStreaming: true,
                  },
                ];
              }
            });
          } else if (sender === 'user') {
            setTranscripts((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.sender === 'user' && last.isStreaming) {
                return [
                  ...prev.slice(0, -1),
                  { ...last, text: last.text + ' ' + text },
                ];
              } else {
                return [
                  ...prev,
                  {
                    id: `trans-${Date.now()}-${Math.random()}`,
                    sender: 'user',
                    text: text,
                    timestamp: new Date(),
                    isStreaming: true,
                  },
                ];
              }
            });
          }
        } else if (data.type === 'interrupted') {
          // User spoke while assistant was talking: stop audio playback immediately
          playerRef.current?.stopAll();
          setAssistantSpeaking(false);
          setTranscripts((prev) =>
            prev.map((t) => (t.isStreaming ? { ...t, isStreaming: false } : t))
          );
        } else if (data.type === 'turnComplete') {
          setTranscripts((prev) =>
            prev.map((t) => (t.isStreaming ? { ...t, isStreaming: false } : t))
          );
          setTimeout(() => {
            setAssistantSpeaking(false);
          }, 350);
        } else if (data.type === 'error') {
          console.error('[Live Voice Error]', data.message);
          setErrorMessage(data.message);
        }
      } catch (err) {
        console.error('[WebSocket message parse error]', err);
      }
    };

    ws.onerror = (err) => {
      console.error('[WebSocket error]', err);
      setStatus('error');
      setErrorMessage('Connection failed. Please check your network or server status.');
    };

    ws.onclose = () => {
      setStatus('disconnected');
    };
  }, []);

  // Start microphone recording at 16kHz
  const startMic = useCallback(async () => {
    try {
      if (status !== 'connected') {
        connect();
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      micStreamRef.current = stream;

      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass({ sampleRate: 16000 });
      micAudioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      // Buffer size: 2048 or 4096 gives smooth low-latency streaming
      const processor = audioCtx.createScriptProcessor(2048, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (!isMicActive) return;

        const inputData = e.inputBuffer.getChannelData(0);
        const rms = calculateRMS(inputData);

        if (rms > 0.02) {
          setUserSpeaking(true);
          setAudioLevel((prev) => prev * 0.3 + Math.min(1, rms * 4) * 0.7);
        } else {
          setUserSpeaking(false);
        }

        const pcmBuffer = floatTo16BitPCM(inputData);
        const base64Audio = arrayBufferToBase64(pcmBuffer);

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: 'audio',
              audio: base64Audio,
            })
          );
        }
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);
      setIsMicActive(true);
      setErrorMessage(null);
    } catch (err: any) {
      console.error('Microphone access denied:', err);
      setErrorMessage(
        err?.message?.includes('Permission') || err?.name === 'NotAllowedError'
          ? 'Microphone permission was denied. Please allow microphone access in your browser.'
          : `Failed to start microphone: ${err?.message || 'Unknown error'}`
      );
      setIsMicActive(false);
    }
  }, [status, connect, isMicActive]);

  // Stop microphone
  const stopMic = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (micAudioCtxRef.current) {
      micAudioCtxRef.current.close();
      micAudioCtxRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'endAudio' }));
    }

    setIsMicActive(false);
    setUserSpeaking(false);
  }, []);

  const toggleMic = useCallback(() => {
    if (isMicActive) {
      stopMic();
    } else {
      startMic();
    }
  }, [isMicActive, startMic, stopMic]);

  // Send typed text to Live Assistant
  const sendTextMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;

      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        connect();
      }

      const waitAndSend = () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'text', text }));
          setTranscripts((prev) => [
            ...prev,
            {
              id: `text-${Date.now()}`,
              sender: 'user',
              text,
              timestamp: new Date(),
              isStreaming: false,
            },
          ]);
        } else {
          setTimeout(waitAndSend, 100);
        }
      };

      waitAndSend();
    },
    [connect]
  );

  // Switch voice persona
  const switchVoice = useCallback(
    (voiceName: string) => {
      setCurrentVoice(voiceName);
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'switchVoice',
            voice: voiceName,
          })
        );
      }
    },
    []
  );

  // Auto-connect on mount
  useEffect(() => {
    connect();

    return () => {
      stopMic();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect, stopMic]);

  return {
    status,
    errorMessage,
    isMicActive,
    assistantSpeaking,
    userSpeaking,
    audioLevel,
    transcripts,
    currentVoice,
    connect,
    toggleMic,
    stopMic,
    sendTextMessage,
    switchVoice,
    setErrorMessage,
  };
}
