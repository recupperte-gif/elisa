import React, { useState } from 'react';
import {
  Flame,
  Clock,
  Sparkles,
  Volume2,
  CheckCircle2,
  Play,
  RotateCcw,
  Target,
  Award,
} from 'lucide-react';

interface InterviewPracticeProps {
  onStartScenario: (prompt: string) => void;
  currentLanguage: 'fr' | 'en' | 'sq';
}

export const InterviewPractice: React.FC<InterviewPracticeProps> = ({
  onStartScenario,
  currentLanguage,
}) => {
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  // Timer logic for 30s elevator pitch
  React.useEffect(() => {
    let interval: any = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  const startPitchTimer = (duration = 30) => {
    setTimerSeconds(duration);
    setTimeLeft(duration);
    setTimerRunning(true);
  };

  const resetPitchTimer = () => {
    setTimerRunning(false);
    setTimeLeft(timerSeconds);
  };

  const scenarios = [
    {
      id: 'luxury-sales',
      title: 'Simulation Entretien Vente & Marketing Luxe (APM Monaco)',
      icon: '💎',
      badge: 'Luxury Focus',
      description:
        'Prépare les questions des recruteurs de maisons de luxe sur la fidélisation, le cérémonial en 11 étapes et la clientèle internationale.',
      prompt:
        'Jouons une simulation d\'entretien pour un poste d\'alternante en marketing et vente dans une maison de luxe. Pose-moi une première question ciblée sur mon expérience chez APM Monaco et mes compétences relationnelles.',
      questions: [
        'Comment avez-vous appliqué les 11 étapes de vente chez APM Monaco ?',
        'Comment traitez-vous un client indécis ou exigeant ?',
        'Pourquoi le marketing du luxe correspond-il à votre parcours ?',
      ],
    },
    {
      id: 'international-profile',
      title: 'Valorisation du Profil International (Baruch NYC, Séoul, Chypre)',
      icon: '🗽',
      badge: 'Global Mindset',
      description:
        'Apprends à structurer tes semestres d\'échange à New York (Baruch College), Séoul et Chypre comme un atout concurrentiel majeur.',
      prompt:
        'Aide-moi à valoriser mes échanges universitaires à New York (Baruch College) et en Asie (Chung-Ang Seoul) pour convaincre un recruteur de mon adaptabilité internationale.',
      questions: [
        'Que retenez-vous de votre semestre à Baruch College à New York ?',
        'Comment cette immersion multiculturelle façonne-t-elle votre méthode de travail ?',
      ],
    },
    {
      id: 'adidas-marketing',
      title: 'Stage Marketing & Digital (Adidas / Dardania Sport Kosovo)',
      icon: '👟',
      badge: 'Operational Marketing',
      description:
        'Mets en lumière ton autonomie sur les réseaux sociaux, le shooting photo studio, le design graphique et le SEO.',
      prompt:
        'Comment structurer ma réponse quand un recruteur me demande quels résultats concrets j\'ai obtenus lors de mon stage marketing chez Adidas au Kosovo ? Pose-moi la question comme si tu étais la directrice des ressources humaines.',
      questions: [
        'Quels KPIs avez-vous suivis pour vos campagnes sur les réseaux sociaux ?',
        'Comment avez-vous coordonné le design graphique et le SEO ?',
      ],
    },
    {
      id: 'shqip-interview',
      title: 'Intervistë Profesionale në Gjuhën Shqipe',
      icon: '🇦🇱',
      badge: 'Trilingual Mastery',
      description:
        'Stërvitu për intervista me kompani ndërkombëtare ose në rajonin e Ballkanit në gjuhën shqipe.',
      prompt:
        'Përshëndetje! Dua të bëjmë një simulim interviste në gjuhën shqipe për pozicionin tim në marketing ndërkombëtar. Më bëj një pyetje profesionale.',
      questions: [
        'Na trego për përvojën tënde te Adidas në Prizren.',
        'Pse zgjodhe tregtinë ndërkombëtare dhe marketingun e luksit ?',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-orange-500/15 via-pink-500/15 to-yellow-500/15 border border-orange-500/30 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold mb-2">
              <Flame className="w-3.5 h-3.5" /> High-Impact Training Room
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white font-['Outfit']">
              Interview Simulator & 30-Second Pitch Lab
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Practice answering challenging recruiter questions out loud. Albanian queen listens,
              critiques your delivery, and sharpens your confidence!
            </p>
          </div>

          {/* Quick Pitch Practice Stopwatch */}
          <div className="flex items-center gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-700/80 shadow-xl">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Pitch Stopwatch
              </span>
              <span
                className={`text-2xl font-mono font-extrabold ${
                  timeLeft <= 5 && timerRunning ? 'text-rose-400 animate-pulse' : 'text-yellow-400'
                }`}
              >
                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              {!timerRunning ? (
                <button
                  onClick={() => startPitchTimer(30)}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-yellow-500 hover:bg-yellow-400 text-slate-950 flex items-center gap-1 transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" /> 30s Pitch
                </button>
              ) : (
                <button
                  onClick={resetPitchTimer}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
              <button
                onClick={() => startPitchTimer(60)}
                className="px-3 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                60s Deep Pitch
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {scenarios.map((sc) => (
          <div
            key={sc.id}
            className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-orange-500/40 transition-all flex flex-col justify-between shadow-lg group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl p-2 rounded-2xl bg-slate-800/80 border border-slate-700">
                  {sc.icon}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/30">
                  {sc.badge}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-orange-300 transition-colors mb-2">
                {sc.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {sc.description}
              </p>

              {/* Sample recruiter questions */}
              <div className="space-y-1.5 mb-5 bg-slate-950/50 p-3 rounded-2xl border border-slate-800/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Questions types :
                </span>
                {sc.questions.map((q, idx) => (
                  <p key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                    <span className="text-orange-400 font-bold">&bull;</span> {q}
                  </p>
                ))}
              </div>
            </div>

            <button
              onClick={() => onStartScenario(sc.prompt)}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-95 text-white flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all"
            >
              <Volume2 className="w-4 h-4" /> Start Live Voice Simulation
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
