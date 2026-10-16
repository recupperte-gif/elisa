import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Lightbulb, MessageSquare, Download, RefreshCw, Copy, Check } from 'lucide-react';
import { defaultCVProfile } from '../data/cvData';

interface ResumeAuditViewProps {
  currentLanguage: 'fr' | 'en' | 'sq';
  onAskInVoice: (prompt: string) => void;
}

export const ResumeAuditView: React.FC<ResumeAuditViewProps> = ({
  currentLanguage,
  onAskInVoice,
}) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const runAudit = async (lang = currentLanguage) => {
    setLoading(true);
    try {
      const res = await fetch('/api/cv/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvProfile: defaultCVProfile, language: lang }),
      });
      const data = await res.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
      } else {
        setAnalysis('Unable to load AI analysis. Please verify server connection.');
      }
    } catch (e: any) {
      setAnalysis('Audit error: ' + (e?.message || 'Network error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAudit(currentLanguage);
  }, [currentLanguage]);

  const copyReport = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-cyan-500/15 via-blue-500/15 to-pink-500/15 border border-cyan-500/30 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Strategic Career Coaching
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-['Outfit']">
            Albanian Queen AI Resume & Strengths Audit
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            In-depth evaluation of Elisa-Dalis Skenderi's profile for luxury marketing & international
            business recruiters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => runAudit(currentLanguage)}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Analyzing...' : 'Refresh Audit'}
          </button>

          {analysis && (
            <button
              onClick={copyReport}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-2 transition-colors shadow-md shadow-cyan-600/20"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Report'}
            </button>
          )}
        </div>
      </div>

      {/* Main Analysis Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-200">
              Albanian queen is reviewing Elisa-Dalis's CV...
            </p>
            <p className="text-xs text-slate-400">
              Examining APM Monaco sales, Adidas Kosovo marketing, NYC & Seoul exchanges
            </p>
          </div>
        ) : analysis ? (
          <div className="space-y-6">
            <div className="prose prose-invert max-w-none text-slate-200 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-sans">
              {analysis}
            </div>

            <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Want to discuss these findings out loud with Albanian queen?
              </span>
              <button
                onClick={() =>
                  onAskInVoice(
                    `Résume-moi à voix haute tes recommandations sur mon CV et donne-moi ton conseil numéro un pour mon alternance en Janvier 2027.`
                  )
                }
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-500 to-orange-500 hover:opacity-95 text-white flex items-center gap-2 shadow-md shadow-pink-500/20 transition-all"
              >
                <MessageSquare className="w-4 h-4" /> Discuss on Live Voice Studio
              </button>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 text-sm">
            Click 'Refresh Audit' to generate a full report.
          </div>
        )}
      </div>
    </div>
  );
};
