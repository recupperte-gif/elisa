import React from 'react';
import {
  defaultCVProfile,
  CVProfile,
  CVExperience,
  CVEducation,
} from '../data/cvData';
import {
  Briefcase,
  GraduationCap,
  Languages,
  Wrench,
  Heart,
  Users,
  MapPin,
  Mail,
  Phone,
  Car,
  Calendar,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Award,
} from 'lucide-react';

interface InteractiveCVViewerProps {
  onAskAboutItem: (topic: string) => void;
  cvProfile?: CVProfile;
}

export const InteractiveCVViewer: React.FC<InteractiveCVViewerProps> = ({
  onAskAboutItem,
  cvProfile = defaultCVProfile,
}) => {
  return (
    <div className="space-y-6">
      {/* Candidate Hero Card */}
      <div className="relative rounded-3xl overflow-hidden p-6 md:p-8 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950 border border-pink-500/20 shadow-2xl">
        {/* Tropical background shimmer */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-500/10 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Alternance dès Janvier 2027
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-['Outfit']">
              {cvProfile.name}
            </h2>
            <p className="text-base md:text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-pink-300 to-yellow-200 mt-1 max-w-2xl">
              {cvProfile.headline}
            </p>

            {/* Quick Contact Chips */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <MapPin className="w-3.5 h-3.5 text-pink-400" /> {cvProfile.location}
              </span>
              <a
                href={`mailto:${cvProfile.email}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:text-white hover:border-pink-500 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-orange-400" /> {cvProfile.email}
              </a>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <Phone className="w-3.5 h-3.5 text-yellow-400" /> {cvProfile.phone}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <Car className="w-3.5 h-3.5 text-cyan-400" /> {cvProfile.license}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 w-full md:w-auto">
            <button
              onClick={() =>
                onAskAboutItem(
                  `Fais-moi un pitch rapide et dynamique de la candidature de ${cvProfile.name} pour une alternance luxe.`
                )
              }
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-400 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <MessageSquare className="w-4 h-4" /> Ask Albanian Queen to Pitch CV
            </button>
            <p className="text-[11px] text-slate-400 text-center">
              Targeting: Luxury Marketing & International Commerce
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Experience & International Education */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Experience Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-pink-400" /> Expériences Professionnelles
            </h3>
            <span className="text-xs text-slate-400">5 missions clés</span>
          </div>

          <div className="space-y-4">
            {cvProfile.experiences.map((exp: CVExperience) => (
              <div
                key={exp.id}
                className="group p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-pink-500/40 transition-all shadow-md relative"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-bold text-slate-100 text-base group-hover:text-pink-300 transition-colors">
                      {exp.role}
                    </h4>
                    <p className="text-sm font-semibold text-orange-400">
                      {exp.company}{' '}
                      <span className="text-xs text-slate-400 font-normal">
                        &bull; {exp.location}
                      </span>
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                    {exp.period}
                  </span>
                </div>

                <ul className="space-y-1.5 mt-3 text-xs md:text-sm text-slate-300 list-disc list-inside">
                  {exp.highlights.map((h, i) => (
                    <li key={i} className="leading-relaxed">
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/20">
                    {exp.category}
                  </span>
                  <button
                    onClick={() =>
                      onAskAboutItem(
                        `Dis-moi comment valoriser l'expérience de ${exp.role} chez ${exp.company} (${exp.period}) lors d'un entretien d'embauche.`
                      )
                    }
                    className="text-xs text-pink-400 hover:text-pink-300 font-medium flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3 h-3" /> Coach me on this
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education & International Programs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Education Block */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-orange-400" /> Formation & International
            </h3>

            <div className="space-y-3">
              {cvProfile.education.map((edu: CVEducation) => (
                <div
                  key={edu.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    edu.isInternational
                      ? 'bg-gradient-to-br from-slate-900/90 to-blue-950/30 border-blue-500/30'
                      : 'bg-slate-900/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-slate-200 text-sm">
                      {edu.institution}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">
                      {edu.period}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-pink-300 mt-0.5">
                    {edu.degree}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" /> {edu.location}
                  </p>
                  {edu.specialty && (
                    <p className="text-xs text-slate-300 mt-1.5 italic bg-slate-800/50 p-1.5 rounded-lg border border-slate-700/40">
                      Spécialité: {edu.specialty}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Languages Section */}
          <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Languages className="w-4 h-4 text-yellow-400" /> Langues & Compétences Trilingues
            </h3>

            <div className="space-y-2.5">
              {cvProfile.languages.map((lang, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <span>{lang.flag}</span> {lang.language}
                    </span>
                    <span className="font-bold text-pink-400">{lang.level}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-yellow-400 rounded-full"
                      style={{
                        width:
                          lang.level === 'C2'
                            ? '100%'
                            : lang.level === 'C1'
                            ? '88%'
                            : lang.level === 'A2'
                            ? '35%'
                            : '18%',
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">{lang.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hard & Soft Skills */}
          <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-2 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" /> Hard Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {cvProfile.hardSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-200 font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-2 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5" /> Soft Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {cvProfile.softSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-200 font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Loisirs & Associations
              </h4>
              <p className="text-xs text-slate-300">
                Piano, Musique, Lecture, Graphic Design &bull; Association: Un Moment de Détente
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
