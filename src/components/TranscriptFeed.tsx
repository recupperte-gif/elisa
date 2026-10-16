import React, { useRef, useEffect } from 'react';
import { TranscriptItem } from '../hooks/useLiveVoice';
import { Send, User, Crown, Volume2, Sparkles, Trash2, Copy, Check } from 'lucide-react';
import { samplePrompts } from '../data/cvData';

interface TranscriptFeedProps {
  transcripts: TranscriptItem[];
  assistantSpeaking: boolean;
  onSendMessage: (text: string) => void;
  onClearTranscripts?: () => void;
  currentLanguage: 'fr' | 'en' | 'sq';
}

export const TranscriptFeed: React.FC<TranscriptFeedProps> = ({
  transcripts,
  assistantSpeaking,
  onSendMessage,
  onClearTranscripts,
  currentLanguage,
}) => {
  const [inputText, setInputText] = React.useState('');
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts, assistantSpeaking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activePrompts = samplePrompts[currentLanguage] || samplePrompts.fr;

  return (
    <div className="flex flex-col h-full bg-slate-900/60 rounded-3xl border border-slate-800/80 backdrop-blur-md overflow-hidden shadow-xl">
      {/* Feed Header */}
      <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <h3 className="text-sm font-bold text-slate-200">
            Live Conversation & Transcription
          </h3>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
            {transcripts.length} turns
          </span>
        </div>

        {transcripts.length > 0 && onClearTranscripts && (
          <button
            onClick={onClearTranscripts}
            className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
            title="Clear transcripts"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Suggested Quick Starters */}
      <div className="px-4 py-2.5 bg-slate-900/40 border-b border-slate-800/60 overflow-x-auto scrollbar-none flex items-center gap-2">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0">
          Try asking:
        </span>
        {activePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(p.prompt)}
            className="text-xs px-3 py-1 rounded-full bg-slate-800/80 hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-orange-500/20 hover:border-pink-500/40 border border-slate-700/70 text-slate-300 hover:text-white transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>✨</span> {p.title}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 min-h-[300px]">
        {transcripts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500/20 to-orange-500/20 border border-pink-500/30 flex items-center justify-center mb-3">
              <Crown className="w-7 h-7 text-yellow-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-200 mb-1">
              Welcome! Albanian queen is listening.
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              Tap the microphone to speak, click one of the suggested prompts above,
              or type your question below. She can answer in English, French, or Albanian!
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() =>
                  onSendMessage(
                    currentLanguage === 'fr'
                      ? "Bonjour ! Peux-tu me présenter en 30 secondes ?"
                      : currentLanguage === 'sq'
                      ? "Përshëndetje! Më ndihmo të prezantoj karrierën time."
                      : "Hello! Can you summarize my background in 30 seconds?"
                  )
                }
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500/20 to-orange-500/20 border border-pink-500/40 text-xs font-medium text-pink-200 hover:bg-pink-500/30 transition-colors"
              >
                👋 Quick Introduction
              </button>
            </div>
          </div>
        ) : (
          transcripts.map((item) => (
            <div
              key={item.id}
              className={`flex gap-3 text-sm ${
                item.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {item.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400 flex items-center justify-center shrink-0 shadow-md">
                  <Crown className="w-4 h-4 text-yellow-200" />
                </div>
              )}

              <div
                className={`group relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-md ${
                  item.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-600/90 to-blue-600/90 text-white rounded-tr-none'
                    : 'bg-slate-800/90 border border-pink-500/20 text-slate-100 rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className={`text-[11px] font-bold ${
                      item.sender === 'user' ? 'text-cyan-200' : 'text-pink-300'
                    }`}
                  >
                    {item.sender === 'user' ? 'You' : 'Albanian queen'}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => copyText(item.id, item.text)}
                      className="p-1 rounded text-slate-400 hover:text-white"
                      title="Copy text"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="leading-relaxed whitespace-pre-wrap">{item.text}</p>

                {item.isStreaming && item.sender === 'assistant' && (
                  <span className="inline-block w-1.5 h-3.5 ml-1 bg-pink-400 animate-pulse rounded-sm align-middle" />
                )}
              </div>

              {item.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-cyan-700/80 border border-cyan-400/30 flex items-center justify-center shrink-0 shadow-md">
                  <User className="w-4 h-4 text-cyan-200" />
                </div>
              )}
            </div>
          ))
        )}

        {assistantSpeaking && (
          <div className="flex gap-3 items-center text-xs text-pink-300 font-medium pl-11">
            <Volume2 className="w-3.5 h-3.5 animate-bounce" />
            <span>Albanian queen is talking...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            currentLanguage === 'fr'
              ? "Écrivez un message ou posez une question sur le CV..."
              : currentLanguage === 'sq'
              ? "Shkruaj një mesazh ose bëj pyetje rreth CV-së..."
              : "Type a message or question about the CV..."
          }
          className="flex-1 bg-slate-900 border border-slate-700/70 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-opacity shadow-md shadow-pink-500/20"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
