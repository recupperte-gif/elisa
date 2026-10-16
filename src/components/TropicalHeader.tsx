import React from 'react';
import { Crown, Sparkles, Volume2, Globe, Flame, Sliders } from 'lucide-react';

interface TropicalHeaderProps {
  currentLanguage: 'fr' | 'en' | 'sq';
  onSelectLanguage: (lang: 'fr' | 'en' | 'sq') => void;
  currentVoice: string;
  onSelectVoice: (voice: string) => void;
  status: 'idle' | 'connecting' | 'connected' | 'error' | 'disconnected';
  activeTab: 'studio' | 'cv' | 'interview' | 'audit';
  onSelectTab: (tab: 'studio' | 'cv' | 'interview' | 'audit') => void;
}

export const TropicalHeader: React.FC<TropicalHeaderProps> = ({
  currentLanguage,
  onSelectLanguage,
  currentVoice,
  onSelectVoice,
  status,
  activeTab,
  onSelectTab,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-40">
      {/* Top Tropical Gradient Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-cyan-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Persona Info */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-orange-500 to-yellow-400 p-0.5 shadow-lg shadow-pink-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Crown className="w-6 h-6 text-yellow-400 drop-shadow-sm" />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-pink-500 border-2 border-slate-950"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-pink-400 via-orange-300 to-yellow-200 bg-clip-text text-transparent font-['Outfit']">
                Albanian queen
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30">
                <Sparkles className="w-2.5 h-2.5" /> Gemini 3.8 Live
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Warm, female AI voice assistant & career coach &bull; Beach-tropical vibe
            </p>
          </div>
        </div>

        {/* Language switchers & Voice persona selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Language Selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner">
            <button
              onClick={() => onSelectLanguage('en')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentLanguage === 'en'
                  ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🇬🇧</span> English
            </button>
            <button
              onClick={() => onSelectLanguage('fr')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentLanguage === 'fr'
                  ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🇫🇷</span> Français
            </button>
            <button
              onClick={() => onSelectLanguage('sq')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentLanguage === 'sq'
                  ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🇦🇱</span> Shqip
            </button>
          </div>

          {/* Voice Character Selector */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <Sliders className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-slate-400">Voice:</span>
            <select
              value={currentVoice}
              onChange={(e) => onSelectVoice(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="Aoede" className="bg-slate-900 text-slate-200">
                Aoede (Vibrant & Warm)
              </option>
              <option value="Kore" className="bg-slate-900 text-slate-200">
                Kore (Soothing & Gentle)
              </option>
              <option value="Zephyr" className="bg-slate-900 text-slate-200">
                Zephyr (Crisp & Upbeat)
              </option>
            </select>
          </div>

          {/* Live Engine Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                status === 'connected'
                  ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                  : status === 'connecting'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-rose-500'
              }`}
            />
            <span className="text-slate-300 font-mono text-[11px]">
              {status === 'connected' ? 'Live 24kHz' : status}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-2 py-1 scrollbar-none">
        <button
          onClick={() => onSelectTab('studio')}
          className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'studio'
              ? 'border-pink-500 text-pink-300 bg-pink-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Volume2 className="w-4 h-4 text-pink-400" /> Voice Studio (Live)
        </button>

        <button
          onClick={() => onSelectTab('cv')}
          className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'cv'
              ? 'border-orange-500 text-orange-300 bg-orange-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Crown className="w-4 h-4 text-orange-400" /> Elisa-Dalis CV Profile
        </button>

        <button
          onClick={() => onSelectTab('interview')}
          className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'interview'
              ? 'border-yellow-500 text-yellow-300 bg-yellow-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Flame className="w-4 h-4 text-yellow-400" /> Interview & Pitch Prep
        </button>

        <button
          onClick={() => onSelectTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'audit'
              ? 'border-cyan-500 text-cyan-300 bg-cyan-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Sparkles className="w-4 h-4 text-cyan-400" /> AI Resume Audit
        </button>
      </div>
    </header>
  );
};
