import React from 'react';
import { Mic, MicOff, Volume2, Sparkles, Radio } from 'lucide-react';

interface LiveVoiceOrbProps {
  isMicActive: boolean;
  assistantSpeaking: boolean;
  userSpeaking: boolean;
  audioLevel: number;
  onToggleMic: () => void;
  status: 'idle' | 'connecting' | 'connected' | 'error' | 'disconnected';
  onReconnect?: () => void;
}

export const LiveVoiceOrb: React.FC<LiveVoiceOrbProps> = ({
  isMicActive,
  assistantSpeaking,
  userSpeaking,
  audioLevel,
  onToggleMic,
  status,
  onReconnect,
}) => {
  // Clamp level for visual scaling
  const scale = 1 + Math.min(0.45, audioLevel * 0.7);
  const glowOpacity = Math.min(1, 0.4 + audioLevel * 1.2);

  return (
    <div className="relative flex flex-col items-center justify-center p-6 md:p-8 select-none">
      {/* Background radial tropical ambiance */}
      <div className="absolute inset-0 bg-radial from-pink-500/10 via-orange-500/5 to-transparent pointer-events-none rounded-3xl" />

      {/* Voice Status Pill */}
      <div className="mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-pink-500/30 backdrop-blur-md shadow-lg shadow-pink-500/10 text-xs font-medium">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            status === 'connected'
              ? assistantSpeaking
                ? 'bg-gradient-to-r from-pink-500 to-yellow-400 animate-ping'
                : userSpeaking
                ? 'bg-cyan-400 animate-pulse'
                : 'bg-emerald-400'
              : status === 'connecting'
              ? 'bg-amber-400 animate-pulse'
              : 'bg-rose-500'
          }`}
        />
        <span className="text-slate-200">
          {status === 'connected' ? (
            assistantSpeaking ? (
              <span className="text-pink-300 font-semibold flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 animate-bounce" /> Albanian queen is speaking...
              </span>
            ) : userSpeaking ? (
              <span className="text-cyan-300 font-semibold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> Listening to you...
              </span>
            ) : isMicActive ? (
              <span className="text-emerald-300">Microphone Ready &bull; Speak anytime</span>
            ) : (
              <span className="text-slate-400">Microphone Muted &bull; Tap mic to talk</span>
            )
          ) : status === 'connecting' ? (
            'Connecting to Gemini 3.8 Live...'
          ) : (
            'Disconnected'
          )}
        </span>
      </div>

      {/* Multi-layered Pulsing Beach-Tropical Orb */}
      <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center my-2">
        {/* Outer glowing ripple ring */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-300 pointer-events-none"
          style={{
            transform: `scale(${scale * 1.25})`,
            background:
              assistantSpeaking
                ? 'radial-gradient(circle, rgba(244,63,94,0.4) 0%, rgba(249,115,22,0.2) 50%, transparent 75%)'
                : userSpeaking
                ? 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, rgba(14,165,233,0.2) 50%, transparent 75%)'
                : 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(245,158,11,0.08) 50%, transparent 70%)',
            opacity: glowOpacity,
          }}
        />

        {/* Secondary warm sunset ring */}
        <div
          className="absolute inset-3 rounded-full transition-all duration-200 pointer-events-none blur-md"
          style={{
            transform: `scale(${scale * 1.12})`,
            background:
              assistantSpeaking
                ? 'conic-gradient(from 180deg at 50% 50%, #f43f5e 0deg, #f97316 90deg, #facc15 180deg, #06b6d4 270deg, #f43f5e 360deg)'
                : userSpeaking
                ? 'conic-gradient(from 0deg at 50% 50%, #06b6d4 0deg, #38bdf8 120deg, #facc15 240deg, #06b6d4 360deg)'
                : 'conic-gradient(from 45deg at 50% 50%, #db2777 0deg, #ea580c 120deg, #eab308 240deg, #db2777 360deg)',
            opacity: 0.75,
          }}
        />

        {/* Core sphere with high-energy tropical sheen */}
        <div
          className="relative w-36 h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-150 cursor-pointer overflow-hidden border-2 border-white/20"
          style={{
            transform: `scale(${scale})`,
            background:
              'radial-gradient(circle at 35% 30%, #fef08a 0%, #fb923c 28%, #ec4899 65%, #0284c7 100%)',
            boxShadow:
              assistantSpeaking
                ? '0 0 50px rgba(244,63,94,0.8), 0 0 100px rgba(251,146,60,0.5), inset 0 0 25px rgba(255,255,255,0.6)'
                : userSpeaking
                ? '0 0 50px rgba(6,182,212,0.8), 0 0 90px rgba(250,204,21,0.5), inset 0 0 25px rgba(255,255,255,0.6)'
                : '0 0 35px rgba(236,72,153,0.4), inset 0 0 20px rgba(255,255,255,0.4)',
          }}
          onClick={onToggleMic}
          title={isMicActive ? 'Click to mute' : 'Click to speak'}
        >
          {/* Internal tropical wave reflections */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent rotate-45 pointer-events-none" />

          {/* Centered Voice Icon / Sparkles */}
          <div className="relative z-10 flex flex-col items-center justify-center text-white drop-shadow-md">
            {isMicActive ? (
              <Mic className="w-10 h-10 md:w-12 md:h-12 animate-pulse text-white" />
            ) : (
              <MicOff className="w-10 h-10 md:w-12 md:h-12 text-white/80" />
            )}
            <span className="text-[10px] md:text-xs font-bold tracking-wider uppercase mt-1 text-white/95">
              {isMicActive ? 'Live' : 'Muted'}
            </span>
          </div>
        </div>
      </div>

      {/* Real-time sound frequency bars */}
      <div className="flex items-center gap-1.5 h-6 mt-4">
        {[0.3, 0.6, 0.9, 0.4, 0.8, 1, 0.7, 0.5, 0.85, 0.45, 0.95, 0.4].map(
          (weight, idx) => {
            const barHeight = Math.max(
              4,
              (assistantSpeaking || userSpeaking
                ? Math.sin(Date.now() / 200 + idx) * 0.5 + 0.5
                : 0.1) *
                22 *
                weight *
                (1 + audioLevel * 1.5)
            );
            return (
              <div
                key={idx}
                className="w-1 md:w-1.5 rounded-full transition-all duration-75"
                style={{
                  height: `${barHeight}px`,
                  background: assistantSpeaking
                    ? 'linear-gradient(to top, #ec4899, #f97316)'
                    : userSpeaking
                    ? 'linear-gradient(to top, #06b6d4, #facc15)'
                    : '#475569',
                }}
              />
            );
          }
        )}
      </div>

      {/* Main Microphone Button & Controls */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onToggleMic}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-200 shadow-lg ${
            isMicActive
              ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 hover:opacity-95 text-white ring-2 ring-pink-400/50 shadow-pink-500/25'
              : 'bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:opacity-95 text-white shadow-cyan-600/25'
          }`}
        >
          {isMicActive ? (
            <>
              <MicOff className="w-4 h-4" /> Mute Microphone
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" /> Start Speaking (Mic On)
            </>
          )}
        </button>

        {status !== 'connected' && onReconnect && (
          <button
            onClick={onReconnect}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            Reconnect Live API
          </button>
        )}
      </div>

      <p className="mt-3 text-center text-xs text-slate-400 max-w-sm">
        Fluent in <strong className="text-pink-300">English</strong>,{' '}
        <strong className="text-orange-300">Français</strong>, and{' '}
        <strong className="text-yellow-300">Shqip</strong>. Speak freely or select
        a prompt below.
      </p>
    </div>
  );
};
