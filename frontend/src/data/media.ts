export const instrumentArt = {
  singing: "/academy/course-posters/singing-ai.svg",
  piano: "/academy/course-posters/piano-ai.svg",
  guitar: "/academy/course-posters/guitar-ai.svg",
  drums: "/academy/course-posters/drums-ai.svg",
  violin: "/academy/course-posters/violin-ai.svg",
  flute: "/academy/course-posters/flute-ai.svg",
  harmonium: "/academy/course-posters/harmonium-ai.svg",
  tabla: "/academy/course-posters/tabla-ai.svg",
  trumpet: "/academy/course-posters/trumpet-ai.svg",
  vocal: "/academy/course-posters/singing-ai.svg",
} as const;

export const classVisuals = {
  liveStage: "/academy/classes/live-stage-class.svg",
  onlineMentor: "/academy/classes/online-mentor-class.svg",
  studioFeedback: "/academy/classes/studio-feedback-class.svg",
  rehearsal: "/academy/classes/rehearsal-module-class.svg",
} as const;

const moduleThemeKeywords = [
  {
    image: "/academy/modules/foundations.svg",
    keywords: [
      "foundation",
      "basics",
      "setup",
      "posture",
      "embouchure",
      "instrument basics",
      "guitar basics",
      "tabla basics",
      "harmonium basics",
    ],
  },
  {
    image: "/academy/modules/technique.svg",
    keywords: [
      "technique",
      "warmup",
      "voice strength",
      "finger position",
      "bow control",
      "articulation",
      "coordination",
    ],
  },
  {
    image: "/academy/modules/scales.svg",
    keywords: [
      "scale",
      "range",
      "sargam",
      "note range",
      "tone development",
      "tone production",
      "swaras",
    ],
  },
  {
    image: "/academy/modules/rhythm.svg",
    keywords: [
      "rhythm",
      "taal",
      "teentaal",
      "keharwa",
      "groove",
      "beats",
      "layakari",
      "metronome",
      "counting",
    ],
  },
  {
    image: "/academy/modules/harmony.svg",
    keywords: [
      "harmony",
      "chord",
      "accompaniment",
      "duet",
      "raag practice",
    ],
  },
  {
    image: "/academy/modules/expression.svg",
    keywords: [
      "expression",
      "emotion",
      "musical expression",
      "bollywood",
      "style playing",
    ],
  },
  {
    image: "/academy/modules/sight-reading.svg",
    keywords: [
      "reading",
      "notation",
      "theory",
      "music theory",
      "fingering",
    ],
  },
  {
    image: "/academy/modules/progressions.svg",
    keywords: [
      "progression",
      "song",
      "song performance",
      "song practice",
      "playback",
      "light classical",
      "composition",
    ],
  },
  {
    image: "/academy/modules/improvisation.svg",
    keywords: [
      "improvisation",
      "alaap",
      "solo",
      "lead guitar",
      "free singing",
    ],
  },
  {
    image: "/academy/modules/performance.svg",
    keywords: [
      "performance",
      "stage",
      "final",
      "mastery",
      "confidence",
      "audience",
      "showcase",
    ],
  },
  {
    image: "/academy/modules/recording.svg",
    keywords: [
      "recording",
      "studio",
      "recording techniques",
      "microphone",
      "feedback",
    ],
  },
];

const classImageByCourse: Record<string, string[]> = {
  singing: [
    classVisuals.liveStage,
    classVisuals.onlineMentor,
    classVisuals.studioFeedback,
  ],
  piano: [
    classVisuals.rehearsal,
    classVisuals.onlineMentor,
    classVisuals.studioFeedback,
  ],
  guitar: [
    classVisuals.liveStage,
    classVisuals.rehearsal,
    classVisuals.studioFeedback,
  ],
  drums: [
    classVisuals.rehearsal,
    classVisuals.liveStage,
    classVisuals.onlineMentor,
  ],
  violin: [
    classVisuals.liveStage,
    classVisuals.onlineMentor,
    classVisuals.rehearsal,
  ],
  flute: [
    classVisuals.onlineMentor,
    classVisuals.rehearsal,
    classVisuals.liveStage,
  ],
  trumpet: [
    classVisuals.liveStage,
    classVisuals.studioFeedback,
    classVisuals.rehearsal,
  ],
  harmonium: [
    classVisuals.rehearsal,
    classVisuals.onlineMentor,
    classVisuals.liveStage,
  ],
  tabla: [
    classVisuals.rehearsal,
    classVisuals.liveStage,
    classVisuals.onlineMentor,
  ],
};

const normalize = (value?: string) => (value ?? "").toLowerCase().trim();
const keyify = (value?: string) =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const catalogCourseArt: Record<string, string> = {
  "hindustani-classical-vocal": "/academy/course-posters/hindustani-classical-vocal-ai.svg",
  "bollywood-singing": "/academy/course-posters/bollywood-singing-ai.svg",
  "light-classical-music": "/academy/course-posters/light-classical-music-ai.svg",
  "playback-singing": "/academy/course-posters/playback-singing-ai.svg",
  "piano-keyboard": "/academy/course-posters/piano-keyboard-ai.svg",
  guitar: "/academy/course-posters/guitar-ai.svg",
  harmonium: "/academy/course-posters/harmonium-ai.svg",
  tabla: "/academy/course-posters/tabla-ai.svg",
  "music-theory": "/academy/course-posters/music-theory-ai.svg",
  "music-composition": "/academy/course-posters/music-composition-ai.svg",
  "stage-performance": "/academy/course-posters/stage-performance-ai.svg",
  "recording-techniques": "/academy/course-posters/recording-techniques-ai.svg",
};

export const getModuleImage = (title: string) => {
  const normalized = normalize(title);
  const matched = moduleThemeKeywords.find((entry) =>
    entry.keywords.some((keyword) => normalized.includes(keyword))
  );

  return matched?.image ?? "/academy/modules/performance.svg";
};

export const getCourseArt = (slug: string, title?: string) => {
  const normalizedSlug = normalize(slug);
  const normalizedTitle = normalize(title);
  const titleKey = keyify(title);

  if (catalogCourseArt[titleKey]) {
    return catalogCourseArt[titleKey];
  }

  if (
    normalizedSlug === "singing" ||
    normalizedTitle.includes("vocal") ||
    normalizedTitle.includes("singing")
  ) {
    return instrumentArt.singing;
  }
  if (normalizedSlug === "piano") return instrumentArt.piano;
  if (normalizedSlug === "guitar") return instrumentArt.guitar;
  if (normalizedSlug === "drums") return instrumentArt.drums;
  if (normalizedSlug === "violin") return instrumentArt.violin;
  if (normalizedSlug === "flute") return instrumentArt.flute;
  if (normalizedSlug === "trumpet") return instrumentArt.trumpet;
  if (normalizedSlug === "harmonium") return instrumentArt.harmonium;
  if (normalizedSlug === "tabla") return instrumentArt.tabla;

  if (normalizedTitle.includes("music theory")) {
    return "/academy/modules/sight-reading.svg";
  }
  if (normalizedTitle.includes("composition")) {
    return "/academy/modules/progressions.svg";
  }
  if (normalizedTitle.includes("recording")) {
    return "/academy/modules/recording.svg";
  }
  if (normalizedTitle.includes("stage performance")) {
    return classVisuals.liveStage;
  }

  return classVisuals.onlineMentor;
};

export const getCatalogCourseImage = (title: string, slug?: string) =>
  catalogCourseArt[keyify(title)] ?? getCourseArt(slug ?? "", title);

export const getClassImagesForCourse = (slug: string) =>
  classImageByCourse[normalize(slug)] ?? [
    classVisuals.liveStage,
    classVisuals.onlineMentor,
    classVisuals.rehearsal,
  ];

export const getBlogArt = (slug: string) =>
  `/academy/blog-posters/${keyify(slug)}.svg`;
