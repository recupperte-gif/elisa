import React, { useState } from 'react';
import { useLiveVoice } from './hooks/useLiveVoice';
import { TropicalHeader } from './components/TropicalHeader';
import { LiveVoiceOrb } from './components/LiveVoiceOrb';
import { TranscriptFeed } from './components/TranscriptFeed';
import { InteractiveCVViewer } from './components/InteractiveCVViewer';
import { InterviewPractice } from './components/InterviewPractice';
import { ResumeAuditView } from './components/ResumeAuditView';
import {
  Mic,
  MicOff,
  Volume2,
  AlertCircle,
  Sparkles,
  Crown,
  Heart,
  ChevronRight,
} from 'lucide-react';

export default function App() {
  const {
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
    sendTextMessage,
    switchVoice,
    setErrorMessage,
  } = useLiveVoice();

  const [currentLanguage, setCurrentLanguage] = useState<'fr' | 'en' | 'sq'>('fr');
  const [activeTab, setActiveTab] = useState<'studio' | 'cv' | 'interview' | 'audit'>('studio');

  const handleLanguageChange = (lang: 'fr' | 'en' | 'sq') => {
    setCurrentLanguage(lang);
    // Send a polite greeting prompt in the new language to trigger immediate voice response
    const greetingMap = {
      fr: "Bonjour Albanian queen ! Parlons en français de mon CV et de mes ambitions professionnelles.",
      en: "Hello Albanian queen! Let's speak in English about my career and resume.",
      sq: "Përshëndetje Albanian queen! Le të flasim në gjuhën shqipe rreth përvojës dhe karrierës time.",
    };
    sendTextMessage(greetingMap[lang]);
  };

  const handleAskAboutCVTopic = (topic: string) => {
    setActiveTab('studio');
    sendTextMessage(topic);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      {/* Header */}
      <TropicalHeader
        currentLanguage={currentLanguage}
        onSelectLanguage={handleLanguageChange}
        currentVoice={currentVoice}
        onSelectVoice={switchVoice}
        status={status}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Error alert toast if mic or connection fails */}
      {errorMessage && (
        <div className="bg-rose-500/20 border-b border-rose-500/40 text-rose-200 px-4 py-2.5 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-300 hover:text-white font-bold ml-4"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {activeTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-stretch">
            {/* Left Column: Live Voice Orb & Status (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                      Live Voice Session
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">
                    Model: gemini-3.8-live
                  </span>
                </div>

                <h2 className="text-2xl font-extrabold text-white tracking-tight font-['Outfit']">
                  Speak with Albanian queen
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Ask questions about Elisa-Dalis Skenderi's resume, practice your interview, or explore career strengths.
                </p>
              </div>

              {/* The Glowing Beach-Tropical Orb */}
              <div className="my-auto py-4">
                <LiveVoiceOrb
                  isMicActive={isMicActive}
                  assistantSpeaking={assistantSpeaking}
                  userSpeaking={userSpeaking}
                  audioLevel={audioLevel}
                  onToggleMic={toggleMic}
                  status={status}
                  onReconnect={connect}
                />
              </div>

              {/* Quick Profile Summary Footer */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="font-medium text-slate-300">
                    Elisa-Dalis Skenderi
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('cv')}
                  className="text-pink-400 hover:text-pink-300 flex items-center gap-1 font-semibold transition-colors"
                >
                  View Full CV <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Right Column: Real-time Transcript Feed (7 cols) */}
            <div className="lg:col-span-7 flex flex-col">
              <TranscriptFeed
                transcripts={transcripts}
                assistantSpeaking={assistantSpeaking}
                onSendMessage={sendTextMessage}
                currentLanguage={currentLanguage}
              />
            </div>
          </div>
        )}

        {activeTab === 'cv' && (
          <InteractiveCVViewer onAskAboutItem={handleAskAboutCVTopic} />
        )}

        {activeTab === 'interview' && (
          <InterviewPractice
            onStartScenario={handleAskAboutCVTopic}
            currentLanguage={currentLanguage}
          />
        )}

        {activeTab === 'audit' && (
          <ResumeAuditView
            currentLanguage={currentLanguage}
            onAskInVoice={handleAskAboutCVTopic}
          />
        )}
      </main>

      {/* Floating Mini Voice Controller (visible on tabs other than 'studio') */}
      {activeTab !== 'studio' && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 p-2.5 rounded-2xl bg-slate-900/90 border border-pink-500/30 backdrop-blur-xl shadow-2xl shadow-pink-500/20">
          <button
            onClick={() => setActiveTab('studio')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Crown className="w-3.5 h-3.5 text-yellow-400" /> Studio
          </button>

          <button
            onClick={toggleMic}
            className={`p-2.5 rounded-xl text-white font-bold transition-all shadow-md ${
              isMicActive
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 shadow-rose-500/30'
                : 'bg-gradient-to-r from-cyan-600 to-teal-600 shadow-cyan-600/30'
            }`}
            title={isMicActive ? 'Mute Mic' : 'Unmute Mic'}
          >
            {isMicActive ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

          {assistantSpeaking && (
            <span className="text-xs text-pink-300 font-semibold flex items-center gap-1 pr-2 animate-pulse">
              <Volume2 className="w-3.5 h-3.5" /> Speaking...
            </span>
          )}
        </div>
      )}

      {/* Tropical Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <p className="flex items-center justify-center gap-1.5">
          <span>Albanian queen</span> &bull; Powered by Gemini 3.8 Live &bull;
          Designed for <span className="text-pink-400 font-medium">Elisa-Dalis Skenderi</span> (Alternance dès Janvier 2027)
        </p>
      </footer>
    </div>
  );
}
