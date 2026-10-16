export interface CVExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  highlights: string[];
  category: 'luxury' | 'retail' | 'marketing' | 'service';
}

export interface CVEducation {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  specialty?: string;
  isInternational?: boolean;
}

export interface CVProfile {
  name: string;
  headline: string;
  targetRole: string;
  availability: string;
  location: string;
  phone: string;
  email: string;
  license: string;
  experiences: CVExperience[];
  education: CVEducation[];
  hardSkills: string[];
  softSkills: string[];
  languages: { language: string; level: string; note: string; flag: string }[];
  interests: string[];
  associations: string[];
}

export const defaultCVProfile: CVProfile = {
  name: "Elisa-Dalis Skenderi",
  headline: "Étudiante en Commerce International — Spécialité Marketing & Communication du Luxe",
  targetRole: "Alternance en Marketing Luxe / Commerce International",
  availability: "Dès Janvier 2027",
  location: "Paris, France",
  phone: "+33 6 49 37 13 20",
  email: "elisadalisskenderi@gmail.com",
  license: "Permis B (Permifiée)",
  experiences: [
    {
      id: "apm-monaco",
      role: "Vendeuse en Joaillerie de Luxe",
      company: "APM MONACO",
      location: "Annecy, France",
      period: "Été 2026",
      category: "luxury",
      highlights: [
        "Maîtrise des 11 étapes de vente du cérémonial luxe APM Monaco",
        "Conseil client personnalisé et fidélisation d'une clientèle internationale",
        "Ventes additionnelles et complémentaires (cross-selling & upselling)"
      ]
    },
    {
      id: "courir",
      role: "Vendeuse Conseil Sneaker & Retail",
      company: "Courir",
      location: "Annecy, France",
      period: "Janvier 2026",
      category: "retail",
      highlights: [
        "Conseil client actif, accueil et orientation sur les tendances streetwear",
        "Gestion des ouvertures et fermetures de boutique en autonomie",
        "Organisation des stocks et merchandising visuel"
      ]
    },
    {
      id: "glacier-alpes",
      role: "Serveuse & Accueil Clientèle",
      company: "Glacier Des Alpes",
      location: "Annecy, France",
      period: "Juin – Août 2025",
      category: "service",
      highlights: [
        "Gestion des flux intenses en haute saison touristique",
        "Accueil chaleureux, service rapide et encaissement",
        "Organisation d'équipe, ouverture et clôture de caisse"
      ]
    },
    {
      id: "adidas-dardania",
      role: "Stage Assistante Marketing & Communication",
      company: "Adidas, Dardania Sport",
      location: "Prizren, Kosovo",
      period: "Juillet – Décembre 2024",
      category: "marketing",
      highlights: [
        "Conception de visuels publicitaires et création graphique pour les réseaux sociaux",
        "Photographie de produits et retouche studio pour le catalogue e-commerce",
        "Optimisation SEO du site web et suivi du service après-vente client",
        "Travail en environnement trilingue (albanais, anglais, français)"
      ]
    },
    {
      id: "rose-des-neiges",
      role: "Serveuse & Marketing Digital",
      company: "Rose des Neiges de Philippe Rigollot (MOF Pâtissier)",
      location: "Annecy, France",
      period: "Vacances 2021 – 2023",
      category: "service",
      highlights: [
        "Service en salon de thé gastronomique haut de gamme",
        "Participation à l'animation des réseaux sociaux et communication digitale",
        "Accueil bilingue de la clientèle française et internationale"
      ]
    }
  ],
  education: [
    {
      id: "esce",
      degree: "Programme Grande École de Commerce Extérieur (ESCE)",
      institution: "ESCE International Business School",
      location: "Lyon, France",
      period: "2022 – en cours",
      specialty: "Communication et Marketing Luxe"
    },
    {
      id: "baruch",
      degree: "Semestre d'échange universitaire international",
      institution: "CUNY, Baruch College",
      location: "New York City, USA",
      period: "Fév – Mai 2026",
      specialty: "International Business, Finance & Management",
      isInternational: true
    },
    {
      id: "cyprus",
      degree: "Semestre d'échange européen",
      institution: "University of Cyprus",
      location: "Nicosie, Chypre",
      period: "Jan – Juin 2024",
      specialty: "Commerce International & Relations Économiques",
      isInternational: true
    },
    {
      id: "chung-ang",
      degree: "Summer School Internationale",
      institution: "Chung-Ang University",
      location: "Séoul, Corée du Sud",
      period: "Summer 2023",
      specialty: "Asian Business Dynamics & Cultural Marketing",
      isInternational: true
    },
    {
      id: "lycee-faure",
      degree: "Baccalauréat Général avec Mention",
      institution: "Lycée Gabriel Fauré",
      location: "Annecy, France",
      period: "2019 – 2022",
      specialty: "Sciences Économiques et Sociales, Anglais Contemporain, Histoire-Géopolitique"
    }
  ],
  hardSkills: [
    "Analyse de données commerciales & KPIs",
    "Publicité sur les Réseaux Sociaux (Meta Ads, TikTok, Instagram)",
    "Suite Adobe Creative (Photoshop, Illustrator, InDesign, Premiere)",
    "Édition et montage vidéo (Shorts, Reels, TikTok)",
    "SEO & Référencement naturel",
    "Techniques de vente luxe (11 étapes)"
  ],
  softSkills: [
    "Créativité & Sens esthétique",
    "Esprit collaboratif & Travail d'équipe",
    "Forte capacité d'adaptation internationale",
    "Curiosité intellectuelle & Dynamisme",
    "Excellente aisance relationnelle client"
  ],
  languages: [
    { language: "Français", level: "C2", note: "Bilingue / Langue maternelle", flag: "🇫🇷" },
    { language: "Albanais (Shqip)", level: "C1", note: "Courant / Langue d'origine", flag: "🇦🇱" },
    { language: "Anglais", level: "C1", note: "Courant / Séjours à New York & Chypre", flag: "🇬🇧" },
    { language: "Espagnol", level: "A2", note: "Notions scolaires", flag: "🇪🇸" },
    { language: "Japonais", level: "A1", note: "Initiation", flag: "🇯🇵" }
  ],
  interests: [
    "Piano & Pratique musicale",
    "Lecture & Littérature",
    "Graphic Design & Direction Artistique",
    "Voyages internationaux (USA, Corée du Sud, Chypre, Balkans)"
  ],
  associations: [
    "Un Moment de Détente (Engagement associatif et organisationnel)"
  ]
};

export const samplePrompts = {
  fr: [
    {
      title: "Simulation Entretien Alternance",
      prompt: "Faisons une simulation d'entretien d'embauche pour mon alternance en marketing du luxe dès janvier 2027. Pose-moi une première question percutante !"
    },
    {
      title: "Pitch 30 secondes",
      prompt: "Aide-moi à peaufiner mon elevator pitch de 30 secondes pour me présenter aux recruteurs du secteur luxe à Paris."
    },
    {
      title: "Valoriser mon stage Adidas",
      prompt: "Comment puis-je mettre en avant mon stage marketing chez Adidas / Dardania Sport au Kosovo pour un poste dans la mode internationale ?"
    },
    {
      title: "Mon profil trilingue",
      prompt: "Résume les 3 plus grands atouts de mon profil trilingue français-albanais-anglais avec mes échanges à New York et Séoul."
    }
  ],
  en: [
    {
      title: "Mock Interview (Luxury)",
      prompt: "Let's do a mock job interview for my work-study role in Luxury Marketing starting January 2027. Ask me your first challenging question!"
    },
    {
      title: "30-Second Elevator Pitch",
      prompt: "Help me craft an energetic 30-second elevator pitch highlighting my international exchanges in NYC and Seoul."
    },
    {
      title: "APM Monaco Sales Experience",
      prompt: "How can I best articulate the 11-step sales protocol I practiced at APM Monaco to impress luxury hiring managers?"
    },
    {
      title: "Top 3 Strengths Review",
      prompt: "Based on my CV, what are my top 3 strengths and what 2 quick improvements do you suggest to make my resume stand out?"
    }
  ],
  sq: [
    {
      title: "Simulim Interviste në Shqip",
      prompt: "Përshëndetje! Më bëj një simulim interviste profesionale në gjuhën shqipe për karrierën time në marketing ndërkombëtar."
    },
    {
      title: "Prezantimi i Përvojës Adidas",
      prompt: "Si mund ta shpjegoj më së miri përvojën time të praktikës te Adidas në Prizren për kompani ndërkombëtare?"
    },
    {
      title: "Këshilla për CV-në",
      prompt: "Më jep këshillat më të mira për të nxjerrë në pah përvojën time në Nju Jork, Seul dhe Annecy në CV."
    },
    {
      title: "Përmbledhje e Shpejtë",
      prompt: "Bëj një përmbledhje të shkurtër dhe energjike të profilit tim profesional në gjuhën shqipe."
    }
  ]
};
