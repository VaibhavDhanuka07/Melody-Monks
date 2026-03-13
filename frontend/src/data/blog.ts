import { longFormSections } from "@/data/blog-longform";
import { getBlogArt } from "@/data/media";

export const blogCategories = [
  "Singing & Vocal Training",
  "Piano & Keyboard",
  "Guitar Learning",
  "Indian Classical Music",
  "Music Career",
] as const;

export type BlogCategory = (typeof blogCategories)[number];

export const blogKeywordClusters: Record<BlogCategory, string[]> = {
  "Singing & Vocal Training": [
    "how to learn singing",
    "singing lessons online",
    "vocal training for beginners",
    "how to improve singing voice",
    "voice training exercises",
    "singing practice routine",
    "how to sing better",
    "breathing exercises for singing",
    "how to sing high notes",
    "singing tips for beginners",
    "how to control voice while singing",
    "daily singing exercises",
    "vocal warmups for singers",
    "improve voice quality for singing",
    "singing techniques for beginners",
    "singing lessons near me",
    "online singing classes",
    "professional singing training",
    "how to become a singer",
    "voice culture training",
    "singing training course",
    "learn singing at home",
    "singing training exercises",
    "best singing exercises",
    "voice improvement exercises",
    "singing practice techniques",
    "beginner singing course",
    "learn singing step by step",
    "singing lessons for adults",
    "singing lessons for kids",
    "singing course online",
    "how to develop singing voice",
    "classical singing lessons",
    "indian vocal training",
    "bollywood singing lessons",
    "singing training for beginners",
    "online vocal coach",
    "professional vocal training",
    "music voice training",
    "best singing teacher online",
  ],
  "Piano & Keyboard": [
    "piano lessons for beginners",
    "learn piano online",
    "piano course online",
    "piano practice exercises",
    "how to play piano",
    "easy piano lessons",
    "beginner piano tutorial",
    "piano learning course",
    "piano practice routine",
    "piano chords guide",
    "piano scales for beginners",
    "piano exercises for beginners",
    "piano lesson videos",
    "online piano classes",
    "piano lessons near me",
    "keyboard classes online",
    "learn keyboard online",
    "keyboard course for beginners",
    "keyboard lessons online",
    "piano music theory",
    "piano fingering exercises",
    "piano chord progressions",
    "learn piano step by step",
    "piano tutorial for beginners",
    "piano songs for beginners",
    "keyboard training course",
    "piano learning guide",
    "piano practice techniques",
    "piano chord charts",
    "online keyboard teacher",
    "best piano course online",
    "piano learning website",
    "piano tutorial videos",
    "beginner piano songs",
    "piano basics course",
  ],
  "Guitar Learning": [
    "guitar lessons for beginners",
    "learn guitar online",
    "guitar chords for beginners",
    "easy guitar songs",
    "beginner guitar tutorial",
    "guitar practice routine",
    "guitar exercises for beginners",
    "how to play guitar",
    "online guitar classes",
    "guitar training course",
    "acoustic guitar lessons",
    "electric guitar lessons",
    "guitar chord charts",
    "guitar scales for beginners",
    "guitar learning course",
    "guitar strumming patterns",
    "guitar finger exercises",
    "beginner guitar songs",
    "guitar lessons near me",
    "learn guitar step by step",
    "guitar basics course",
    "guitar training online",
    "guitar practice techniques",
    "guitar tutorial videos",
    "professional guitar training",
    "guitar classes online",
    "guitar course for beginners",
    "online guitar teacher",
    "guitar learning guide",
    "guitar training exercises",
  ],
  "Indian Classical Music": [
    "hindustani classical music lessons",
    "indian classical singing lessons",
    "learn hindustani classical music",
    "raag yaman tutorial",
    "raag bhairav tutorial",
    "raag kafi tutorial",
    "alankar practice exercises",
    "indian music theory",
    "hindustani vocal training",
    "classical singing course",
    "raag practice guide",
    "indian classical music basics",
    "hindustani music lessons online",
    "classical vocal exercises",
    "indian music training",
    "raag structure explained",
    "hindustani music tutorial",
    "classical singing lessons online",
    "indian music classes online",
    "raag learning course",
    "indian classical singing training",
    "beginner classical singing",
    "classical vocal practice routine",
    "indian music education",
    "raag training exercises",
    "classical singing teacher",
    "indian classical music course",
    "hindustani vocal lessons",
    "indian music academy",
    "classical singing techniques",
    "tabla lessons online",
    "learn tabla for beginners",
    "tabla practice exercises",
    "tabla course online",
    "tabla rhythms tutorial",
    "tabla basics for beginners",
    "harmonium lessons online",
    "harmonium tutorial for beginners",
    "harmonium practice exercises",
    "learn harmonium online",
    "harmonium chords guide",
    "harmonium course online",
    "flute lessons online",
    "flute tutorial for beginners",
    "flute practice exercises",
    "learn flute online",
    "flute training course",
    "flute breathing exercises",
    "flute fingering chart",
    "flute course for beginners",
    "tabla training course",
    "harmonium training course",
    "flute practice routine",
    "indian instrument lessons",
    "learn indian instruments",
    "tabla practice guide",
    "harmonium beginner course",
    "flute basics course",
    "indian instrument training",
    "online instrument classes",
  ],
  "Music Career": [
    "how to become a singer",
    "music career guide",
    "stage performance training",
    "singing audition preparation",
    "music industry career",
    "how to prepare for singing auditions",
    "reality show singing tips",
    "professional music training",
    "stage singing techniques",
    "singing confidence training",
    "performance skills for singers",
    "music teacher training",
    "how to start teaching music",
    "music career opportunities",
    "recording studio singing tips",
    "music performance course",
    "singing stage presence",
    "live performance training",
    "music competition preparation",
    "reality show preparation course",
    "music audition tips",
    "how to become a playback singer",
    "singing stage practice",
    "music production basics",
    "music composition course",
    "songwriting course",
    "professional singer training",
    "how to record songs",
    "music recording techniques",
    "music career development",
    "music mentor training",
    "performing arts training",
    "singer career tips",
    "music training institute",
    "online music academy",
  ],
};

export const blogTopKeywords = [
  "how to learn singing",
  "singing lessons online",
  "how to sing better",
  "piano lessons for beginners",
  "learn piano online",
  "piano chords guide",
  "guitar lessons for beginners",
  "guitar chords for beginners",
  "learn guitar online",
  "hindustani classical music lessons",
  "raag yaman tutorial",
  "indian classical singing lessons",
  "how to become a singer",
  "music career guide",
  "stage performance training",
];

export type BlogSection = {
  heading?: string;
  paragraphs: string[];
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  author: string;
  category: BlogCategory;
  publishedAt: string;
  sections: BlogSection[];
  keywords?: string[];
  featured?: boolean;
};

const author = "Debojeet Lahiri";

const callToAction =
  "Book a free music trial class today and get a personalized practice plan.";

const getKeywordsForCategory = (
  category: BlogCategory,
  count = 10,
  offset = 0
) => {
  const keywords = blogKeywordClusters[category] || [];
  if (keywords.length === 0) return [];
  const start = offset % keywords.length;
  return [...keywords.slice(start), ...keywords.slice(0, start)].slice(0, count);
};

export const blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    title: "How to Learn Singing at Home (Beginner Guide)",
    slug: "how-to-learn-singing-at-home-beginner-guide",
    excerpt:
      "A step-by-step plan to learn singing at home with daily exercises and clear practice goals.",
    image: "/vasu/vasu-practice-room.svg",
    author,
    category: "Singing & Vocal Training",
    publishedAt: "2026-02-22",
    keywords: getKeywordsForCategory("Singing & Vocal Training", 10, 0),
    featured: true,
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          "If you are searching how to learn singing at home, start with a simple routine and build consistency.",
          "This beginner guide focuses on voice control, breathing, and daily riyaz habits.",
        ],
      },
      {
        heading: "Main Sections",
        paragraphs: [
          "Warm up with humming and gentle siren glides to relax the voice.",
          "Practice sargam slowly and keep a steady tempo using a metronome.",
          "Record short clips to track progress and improve confidence.",
        ],
      },
      {
        heading: "Video Section",
        paragraphs: [
          "Embed a short performance or teaching video here to demonstrate the warmup routine.",
        ],
      },
      {
        heading: "Practice Tips",
        paragraphs: [
          "Start with 20 minutes daily and increase to 45 minutes as stamina improves.",
          "Use a tanpura or drone app to maintain sur accuracy.",
        ],
      },
      {
        heading: "Call to Action",
        paragraphs: [callToAction],
      },
    ],
  },
  {
    id: "blog-2",
    title: "How to Sing Better in 30 Days",
    slug: "how-to-sing-better-in-30-days",
    excerpt:
      "A 30-day vocal training plan to improve voice quality, control, and confidence.",
    image: "/vasu/vasu-hero-stage.svg",
    author,
    category: "Singing & Vocal Training",
    publishedAt: "2026-02-20",
    keywords: getKeywordsForCategory("Singing & Vocal Training", 10, 8),
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          "If you want to sing better, focus on breath control, pitch accuracy, and daily practice.",
          "This 30-day plan is designed for beginners searching how to improve voice quickly.",
        ],
      },
      {
        heading: "Main Sections",
        paragraphs: [
          "Week 1: Breath and posture drills for stable tone.",
          "Week 2: Pitch training with slow sargam and basic scales.",
          "Week 3: Song phrasing and expression.",
          "Week 4: Performance practice and recording feedback.",
        ],
      },
      {
        heading: "Video Section",
        paragraphs: [
          "Embed a daily practice video or Instagram reel from the academy.",
        ],
      },
      {
        heading: "Practice Tips",
        paragraphs: [
          "Track your progress in a practice journal and record a 30-second clip every week.",
          "Use a metronome to keep rhythm consistent.",
        ],
      },
      {
        heading: "Call to Action",
        paragraphs: [callToAction],
      },
    ],
  },
  {
    id: "blog-3",
    title: "Breathing Techniques for Singing",
    slug: "breathing-techniques-for-singing",
    excerpt:
      "Learn diaphragmatic breathing and breath control exercises for better singing.",
    image: "/vasu/vasu-studio-session.svg",
    author,
    category: "Singing & Vocal Training",
    publishedAt: "2026-02-18",
    keywords: getKeywordsForCategory("Singing & Vocal Training", 10, 16),
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          "Breathing techniques for singing improve stamina, stability, and vocal tone.",
          "This guide is ideal for beginners looking to improve voice control.",
        ],
      },
      {
        heading: "Main Sections",
        paragraphs: [
          "Practice diaphragmatic breathing with slow inhale and controlled exhale.",
          "Use breath support drills with long sustained notes.",
          "Apply breath control to simple songs and sargam patterns.",
        ],
      },
      {
        heading: "Video Section",
        paragraphs: [
          "Embed a breathing demonstration video with timing cues.",
        ],
      },
      {
        heading: "Practice Tips",
        paragraphs: [
          "Practice 5 minutes of breathing drills before every riyaz session.",
          "Avoid shallow chest breathing during long phrases.",
        ],
      },
      {
        heading: "Call to Action",
        paragraphs: [callToAction],
      },
    ],
  },
  {
    id: "blog-4",
    title: "Bollywood Singing Tips for Expressive Performance",
    slug: "bollywood-singing-tips-expressive-performance",
    excerpt:
      "Learn Bollywood singing techniques to improve emotion, diction, and stage presence.",
    image: "/vasu/vasu-hero-stage.svg",
    author,
    category: "Singing & Vocal Training",
    publishedAt: "2026-02-15",
    keywords: getKeywordsForCategory("Singing & Vocal Training", 10, 24),
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          "Bollywood singing techniques combine clear diction, breath control, and emotional delivery.",
          "This guide helps singers searching how to sing better for film songs.",
        ],
      },
      {
        heading: "Main Sections",
        paragraphs: [
          "Focus on clear pronunciation and vowel shaping.",
          "Use dynamic contrast to bring out the emotion of lyrics.",
          "Practice with a backing track to build timing and stage confidence.",
        ],
      },
      {
        heading: "Video Section",
        paragraphs: [
          "Embed a Bollywood performance clip or teaching reel.",
        ],
      },
      {
        heading: "Practice Tips",
        paragraphs: [
          "Pick one song and rehearse the chorus with three different emotions.",
          "Record and compare takes to refine expression.",
        ],
      },
      {
        heading: "Call to Action",
        paragraphs: [callToAction],
      },
    ],
  },
  {
    id: "blog-5",
    title: "How to Improve Your Singing Voice",
    slug: "how-to-improve-your-singing-voice",
    excerpt:
      "Simple exercises and routines to improve your voice for beginners and intermediates.",
    image: "/vasu/vasu-practice-room.svg",
    author,
    category: "Singing & Vocal Training",
    publishedAt: "2026-02-12",
    keywords: getKeywordsForCategory("Singing & Vocal Training", 10, 32),
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          "Many students search for how to improve voice. The key is consistent vocal training.",
          "This guide covers daily voice exercises for beginners.",
        ],
      },
      {
        heading: "Main Sections",
        paragraphs: [
          "Start with humming, lip trills, and gentle scale practice.",
          "Build range gradually with controlled high note practice.",
          "Use pitch training tools to check sur accuracy.",
        ],
      },
      {
        heading: "Video Section",
        paragraphs: ["Embed a warmup video that students can follow."],
      },
      {
        heading: "Practice Tips",
        paragraphs: [
          "Do not strain. Keep sessions short and focused.",
          "Hydrate and rest your voice between sessions.",
        ],
      },
      {
        heading: "Call to Action",
        paragraphs: [callToAction],
      },
    ],
  },
  {
    id: "blog-6",
    title: "Piano Lessons for Beginners: 7-Day Starter Plan",
    slug: "piano-lessons-for-beginners-7-day-starter-plan",
    excerpt:
      "A simple plan to start piano lessons for beginners with daily practice steps.",
    image: "/vasu/vasu-masterclass.svg",
    author,
    category: "Piano & Keyboard",
    publishedAt: "2026-02-10",
    keywords: getKeywordsForCategory("Piano & Keyboard", 10, 0),
    featured: true,
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          "If you are searching piano lessons for beginners, start with posture, finger numbers, and simple melodies.",
          "This 7-day plan keeps practice structured and effective.",
        ],
      },
      {
        heading: "Main Sections",
        paragraphs: [
          "Day 1-2: Learn hand position and note names.",
          "Day 3-4: Practice simple scales with a metronome.",
          "Day 5-7: Play short songs and record your progress.",
        ],
      },
      {
        heading: "Video Section",
        paragraphs: ["Embed a beginner piano lesson video here."],
      },
      {
        heading: "Practice Tips",
        paragraphs: [
          "Keep sessions short and focus on clean finger movement.",
          "Use a virtual piano tool for extra practice.",
        ],
      },
      {
        heading: "Call to Action",
        paragraphs: [callToAction],
      },
    ],
  },
  {
    id: "blog-7",
    title: "10 Easy Piano Songs for Beginners",
    slug: "10-easy-piano-songs-for-beginners",
    excerpt:
      "A list of easy piano songs to help beginners build confidence and musicality.",
    image: "/vasu/vasu-hero-stage.svg",
    author,
    category: "Piano & Keyboard",
    publishedAt: "2026-02-08",
    keywords: getKeywordsForCategory("Piano & Keyboard", 10, 8),
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          "Easy piano songs keep beginners motivated and focused on rhythm and timing.",
        ],
      },
      {
        heading: "Main Sections",
        paragraphs: [
          "Choose songs with simple chord progressions and steady tempos.",
          "Start with one hand and add the second hand once comfortable.",
        ],
      },
      {
        heading: "Video Section",
        paragraphs: ["Embed a song demonstration video for quick learning."],
      },
      {
        heading: "Practice Tips",
        paragraphs: [
          "Practice in short loops and increase speed gradually.",
        ],
      },
      {
        heading: "Call to Action",
        paragraphs: [callToAction],
      },
    ],
  },
  {
    id: "blog-8",
    title: "How to Play Bollywood Songs on Piano",
    slug: "how-to-play-bollywood-songs-on-piano",
    excerpt:
      "Learn chord progressions and rhythm patterns to play Bollywood songs on piano.",
    image: "/vasu/vasu-studio-session.svg",
    author,
    category: "Piano & Keyboard",
    publishedAt: "2026-02-06",
    keywords: getKeywordsForCategory("Piano & Keyboard", 10, 16),
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          "Bollywood songs on piano rely on chord progressions and steady rhythm.",
          "This guide helps you learn songs quickly and confidently.",
        ],
      },
      {
        heading: "Main Sections",
        paragraphs: [
          "Learn common Bollywood chord progressions like I-V-vi-IV.",
          "Use arpeggios to make accompaniment sound rich.",
          "Play with a metronome to keep timing strong.",
        ],
      },
      {
        heading: "Video Section",
        paragraphs: ["Embed a Bollywood piano tutorial video here."],
      },
      {
        heading: "Practice Tips",
        paragraphs: [
          "Pick one song and practice the chorus with both hands.",
        ],
      },
      {
        heading: "Call to Action",
        paragraphs: [callToAction],
      },
    ],
  },
  {
    id: "blog-9",
    title: "Piano Scales Guide for Beginners",
    slug: "piano-scales-guide-for-beginners",
    excerpt:
      "A practical piano scales guide to improve finger strength and fluency.",
    image: "/vasu/vasu-practice-room.svg",
    author,
    category: "Piano & Keyboard",
    publishedAt: "2026-02-04",
    keywords: getKeywordsForCategory("Piano & Keyboard", 10, 24),
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          "Piano scales improve technique, speed, and coordination.",
        ],
      },
      {
        heading: "Main Sections",
        paragraphs: [
          "Start with C Major and G Major at slow tempos.",
          "Practice hands separately before combining.",
          "Use consistent fingering for muscle memory.",
        ],
      },
      {
        heading: "Video Section",
        paragraphs: ["Embed a scale practice video with fingering guidance."],
      },
      {
        heading: "Practice Tips",
        paragraphs: [
          "Focus on even tone and relaxed wrists.",
        ],
      },
      {
        heading: "Call to Action",
        paragraphs: [callToAction],
      },
    ],
  },
  {
    id: "blog-10",
    title: "Guitar Chords for Beginners",
    slug: "guitar-chords-for-beginners",
    excerpt:
      "Learn essential open chords and simple progressions for beginner guitarists.",
    image: "/vasu/vasu-hero-stage.svg",
    author,
    category: "Guitar Learning",
    publishedAt: "2026-02-02",
    keywords: getKeywordsForCategory("Guitar Learning", 10, 0),
    featured: true,
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          "Beginner guitar lessons often start with open chords like C, G, D, and Em.",
          "This guide helps you learn guitar chords quickly and accurately.",
        ],
      },
      {
        heading: "Main Sections",
        paragraphs: [
          "Practice chord shapes slowly and build clean finger placement.",
          "Use a simple chord progression to train transitions.",
        ],
      },
      {
        heading: "Video Section",
        paragraphs: ["Embed a chord diagram walkthrough or video lesson."],
      },
      {
        heading: "Practice Tips",
        paragraphs: [
          "Switch chords every four beats with a metronome.",
        ],
      },
      {
        heading: "Call to Action",
        paragraphs: [callToAction],
      },
    ],
  },
  {
    id: "blog-11",
    title: "How to Learn Guitar Fast (Daily Practice Plan)",
    slug: "how-to-learn-guitar-fast-daily-practice-plan",
    excerpt:
      "A simple guitar practice routine to build chords, rhythm, and speed.",
    image: "/vasu/vasu-studio-session.svg",
    author,
    category: "Guitar Learning",
    publishedAt: "2026-01-30",
    keywords: getKeywordsForCategory("Guitar Learning", 10, 7),
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          "If you want to learn guitar fast, focus on short, consistent sessions.",
        ],
      },
      {
        heading: "Main Sections",
        paragraphs: [
          "Warm up with finger stretches and simple chords.",
          "Practice strumming patterns for 10 minutes.",
          "End with a simple song to build confidence.",
        ],
      },
      {
        heading: "Video Section",
        paragraphs: ["Embed a strumming trainer video for beginners."],
      },
      {
        heading: "Practice Tips",
        paragraphs: [
          "Track your daily practice with a timer and set small goals.",
        ],
      },
      {
        heading: "Call to Action",
        paragraphs: [callToAction],
      },
    ],
  },
  {
    id: "blog-12",
    title: "Easy Bollywood Songs on Guitar",
    slug: "easy-bollywood-songs-on-guitar",
    excerpt:
      "A beginner list of Bollywood songs that work well on acoustic guitar.",
    image: "/vasu/vasu-practice-room.svg",
    author,
    category: "Guitar Learning",
    publishedAt: "2026-01-28",
    keywords: getKeywordsForCategory("Guitar Learning", 10, 14),
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          "Easy Bollywood songs are perfect for beginner guitar lessons.",
        ],
      },
      {
        heading: "Main Sections",
        paragraphs: [
          "Pick songs with common chord progressions and steady tempo.",
          "Start with simple strumming patterns and build complexity later.",
        ],
      },
      {
        heading: "Video Section",
        paragraphs: ["Embed a Bollywood guitar tutorial or performance video."],
      },
      {
        heading: "Practice Tips",
        paragraphs: [
          "Play along with the original track to improve timing.",
        ],
      },
      {
        heading: "Call to Action",
        paragraphs: [callToAction],
      },
    ],
  },
  {
    id: "blog-13",
    title: "Fingerstyle Guitar Guide for Beginners",
    slug: "fingerstyle-guitar-guide-for-beginners",
    excerpt:
      "A beginner guide to fingerstyle guitar with easy exercises and patterns.",
    image: "/vasu/vasu-live-class.svg",
    author,
    category: "Guitar Learning",
    publishedAt: "2026-01-26",
    keywords: getKeywordsForCategory("Guitar Learning", 10, 21),
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          "Fingerstyle guitar builds control and tone. Start with simple patterns.",
        ],
      },
      {
        heading: "Main Sections",
        paragraphs: [
          "Assign each finger to a string and practice slow arpeggios.",
          "Use a metronome to keep rhythm consistent.",
        ],
      },
      {
        heading: "Video Section",
        paragraphs: ["Embed a fingerstyle practice video."],
      },
      {
        heading: "Practice Tips",
        paragraphs: [
          "Focus on clean tone and avoid rushing transitions.",
        ],
      },
      {
        heading: "Call to Action",
        paragraphs: [callToAction],
      },
    ],
  },
  {
    id: "blog-14",
    title: "Introduction to Hindustani Classical Music",
    slug: "introduction-to-hindustani-classical-music",
    excerpt:
      "Learn the basics of raag, taal, and riyaz in Hindustani classical music.",
    image: "/vasu/vasu-studio-session.svg",
    author,
    category: "Indian Classical Music",
    publishedAt: "2026-01-24",
    keywords: getKeywordsForCategory("Indian Classical Music", 10, 0),
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          "Hindustani classical singing builds strong sur control and deep musical expression.",
        ],
      },
      {
        heading: "Main Sections",
        paragraphs: [
          "Learn the concept of raag and its mood.",
          "Understand taal cycles and theka patterns.",
          "Practice basic alankars to build voice agility.",
        ],
      },
      {
        heading: "Video Section",
        paragraphs: ["Embed a classical performance or lesson video."],
      },
      {
        heading: "Practice Tips",
        paragraphs: [
          "Start with slow sargam and increase speed gradually.",
        ],
      },
      {
        heading: "Call to Action",
        paragraphs: [callToAction],
      },
    ],
  },
  {
    id: "blog-15",
    title: "What is Raag Yaman? Tutorial and Practice Guide",
    slug: "what-is-raag-yaman-tutorial-practice-guide",
    excerpt:
      "A complete Raag Yaman tutorial with aroh, avaroh, and practice tips.",
    image: "/vasu/vasu-hero-stage.svg",
    author,
    category: "Indian Classical Music",
    publishedAt: "2026-01-22",
    keywords: getKeywordsForCategory("Indian Classical Music", 10, 10),
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          "Raag Yaman is one of the most popular evening raags in Hindustani classical music.",
        ],
      },
      {
        heading: "Main Sections",
        paragraphs: [
          "Aroh: N R G M D N S.",
          "Avaroh: S N D P M G R S.",
          "Practice pakad phrases to build memory.",
        ],
      },
      {
        heading: "Video Section",
        paragraphs: ["Embed a Raag Yaman tutorial or bandish performance."],
      },
      {
        heading: "Practice Tips",
        paragraphs: [
          "Sing slowly with tanpura support and focus on sur accuracy.",
        ],
      },
      {
        heading: "Call to Action",
        paragraphs: [callToAction],
      },
    ],
  },
  {
    id: "blog-16",
    title: "Basic Alankars for Singing",
    slug: "basic-alankars-for-singing",
    excerpt:
      "Learn simple alankars to improve voice agility and pitch control.",
    image: "/vasu/vasu-practice-room.svg",
    author,
    category: "Indian Classical Music",
    publishedAt: "2026-01-20",
    keywords: getKeywordsForCategory("Indian Classical Music", 10, 20),
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          "Alankars are essential for building speed, clarity, and sur control.",
        ],
      },
      {
        heading: "Main Sections",
        paragraphs: [
          "Start with basic patterns in Madhya Saptak.",
          "Use a slow tempo and clear pronunciation of swaras.",
        ],
      },
      {
        heading: "Video Section",
        paragraphs: ["Embed an alankar practice video with tempo guidance."],
      },
      {
        heading: "Practice Tips",
        paragraphs: [
          "Repeat each pattern 5 times and increase speed gradually.",
        ],
      },
      {
        heading: "Call to Action",
        paragraphs: [callToAction],
      },
    ],
  },
  {
    id: "blog-17",
    title: "Understanding Taal in Indian Music",
    slug: "understanding-taal-in-indian-music",
    excerpt:
      "Learn the basics of taal, theka, and layakari for Indian music practice.",
    image: "/vasu/vasu-live-class.svg",
    author,
    category: "Indian Classical Music",
    publishedAt: "2026-01-18",
    keywords: getKeywordsForCategory("Indian Classical Music", 10, 30),
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          "Taal is the rhythmic cycle that supports Indian classical music and Bollywood songs.",
        ],
      },
      {
        heading: "Main Sections",
        paragraphs: [
          "Learn Teentaal and Keherwa as foundational cycles.",
          "Practice clapping and khali patterns before adding vocals.",
        ],
      },
      {
        heading: "Video Section",
        paragraphs: ["Embed a taal demonstration or tabla video."],
      },
      {
        heading: "Practice Tips",
        paragraphs: [
          "Practice with a metronome or tabla loop to keep rhythm steady.",
        ],
      },
      {
        heading: "Call to Action",
        paragraphs: [callToAction],
      },
    ],
  },
  {
    id: "blog-18",
    title: "Harmonium Lessons for Beginners",
    slug: "harmonium-lessons-for-beginners",
    excerpt:
      "Start harmonium lessons with simple sargam and accompaniment patterns.",
    image: "/vasu/vasu-studio-session.svg",
    author,
    category: "Indian Classical Music",
    publishedAt: "2026-01-16",
    keywords: getKeywordsForCategory("Indian Classical Music", 10, 40),
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          "Harmonium lessons for beginners focus on scale practice and steady rhythm.",
        ],
      },
      {
        heading: "Main Sections",
        paragraphs: [
          "Practice sargam on the harmonium with slow tempo.",
          "Use simple theka patterns to support vocals.",
        ],
      },
      {
        heading: "Video Section",
        paragraphs: ["Embed a harmonium tutorial video here."],
      },
      {
        heading: "Practice Tips",
        paragraphs: [
          "Keep fingers relaxed and maintain consistent bellows pressure.",
        ],
      },
      {
        heading: "Call to Action",
        paragraphs: [callToAction],
      },
    ],
  },
  {
    id: "blog-19",
    title: "Tabla Basics: Theka, Taal, and Practice Routine",
    slug: "tabla-basics-theka-taal-practice-routine",
    excerpt:
      "Learn tabla basics including theka patterns and daily practice routines.",
    image: "/vasu/vasu-hero-stage.svg",
    author,
    category: "Indian Classical Music",
    publishedAt: "2026-01-14",
    keywords: getKeywordsForCategory("Indian Classical Music", 10, 50),
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          "Tabla basics start with understanding bols and theka patterns.",
        ],
      },
      {
        heading: "Main Sections",
        paragraphs: [
          "Practice Teentaal theka slowly with a metronome.",
          "Build clarity of bols before increasing speed.",
        ],
      },
      {
        heading: "Video Section",
        paragraphs: ["Embed a tabla theka demonstration video."],
      },
      {
        heading: "Practice Tips",
        paragraphs: [
          "Use a practice timer and focus on consistent hand technique.",
        ],
      },
      {
        heading: "Call to Action",
        paragraphs: [callToAction],
      },
    ],
  },
  {
    id: "blog-20",
    title: "How to Become a Professional Singer",
    slug: "how-to-become-a-professional-singer",
    excerpt:
      "A clear roadmap for building a professional singing career in India.",
    image: "/vasu/vasu-live-class.svg",
    author,
    category: "Music Career",
    publishedAt: "2026-01-12",
    keywords: getKeywordsForCategory("Music Career", 10, 0),
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          "A professional singing career requires training, performance exposure, and consistency.",
        ],
      },
      {
        heading: "Main Sections",
        paragraphs: [
          "Develop strong vocal technique with daily riyaz.",
          "Build a performance portfolio with recordings and live shows.",
          "Work with mentors to refine style and stage presence.",
        ],
      },
      {
        heading: "Video Section",
        paragraphs: ["Embed a student performance or mentor feedback video."],
      },
      {
        heading: "Practice Tips",
        paragraphs: [
          "Create a weekly plan that includes vocal training and performance practice.",
        ],
      },
      {
        heading: "Call to Action",
        paragraphs: [callToAction],
      },
    ],
  },
  {
    id: "blog-21",
    title: "How to Prepare for Reality Shows",
    slug: "how-to-prepare-for-reality-shows",
    excerpt:
      "Prepare for singing reality shows with audition strategy, song selection, and stage confidence.",
    image: "/vasu/vasu-hero-stage.svg",
    author,
    category: "Music Career",
    publishedAt: "2026-01-10",
    keywords: getKeywordsForCategory("Music Career", 10, 9),
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          "Reality show preparation requires vocal strength, stage presence, and mental focus.",
        ],
      },
      {
        heading: "Main Sections",
        paragraphs: [
          "Choose a song that highlights range and emotion.",
          "Practice with live performance simulations.",
          "Build a confident audition routine and warmup.",
        ],
      },
      {
        heading: "Video Section",
        paragraphs: ["Embed an audition practice video with feedback."],
      },
      {
        heading: "Practice Tips",
        paragraphs: [
          "Record your audition daily for a week to refine delivery.",
        ],
      },
      {
        heading: "Call to Action",
        paragraphs: [callToAction],
      },
    ],
  },
  {
    id: "blog-22",
    title: "Careers in the Music Industry in India",
    slug: "careers-in-the-music-industry-in-india",
    excerpt:
      "Explore career paths like performer, teacher, composer, and music producer.",
    image: "/vasu/vasu-studio-session.svg",
    author,
    category: "Music Career",
    publishedAt: "2026-01-08",
    keywords: getKeywordsForCategory("Music Career", 10, 18),
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          "The music industry offers multiple career paths beyond performance.",
        ],
      },
      {
        heading: "Main Sections",
        paragraphs: [
          "Performance: Live shows, recordings, and collaborations.",
          "Teaching: Online classes and private coaching.",
          "Composition: Scoring for films and digital content.",
        ],
      },
      {
        heading: "Video Section",
        paragraphs: ["Embed a mentor talk on music careers."],
      },
      {
        heading: "Practice Tips",
        paragraphs: [
          "Build a portfolio and keep a consistent practice routine.",
        ],
      },
      {
        heading: "Call to Action",
        paragraphs: [callToAction],
      },
    ],
  },
  {
    id: "blog-23",
    title: "How to Start Teaching Music Online",
    slug: "how-to-start-teaching-music-online",
    excerpt:
      "A step-by-step guide to start teaching music online and build students.",
    image: "/vasu/vasu-live-class.svg",
    author,
    category: "Music Career",
    publishedAt: "2026-01-06",
    keywords: getKeywordsForCategory("Music Career", 10, 27),
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          "Teaching music online requires a clear curriculum, tools, and consistency.",
        ],
      },
      {
        heading: "Main Sections",
        paragraphs: [
          "Create a structured syllabus and lesson plan.",
          "Use video tools and live class platforms for smooth sessions.",
          "Collect feedback and improve your teaching style.",
        ],
      },
      {
        heading: "Video Section",
        paragraphs: ["Embed a teaching demo or class highlight."],
      },
      {
        heading: "Practice Tips",
        paragraphs: [
          "Record sessions to review and refine your teaching flow.",
        ],
      },
      {
        heading: "Call to Action",
        paragraphs: [callToAction],
      },
    ],
  },
];

blogPosts.forEach((post) => {
  const replacement = longFormSections[post.slug];
  post.image = getBlogArt(post.slug);
  if (replacement) {
    post.sections = replacement;
  }
});

export const getBlogPostBySlug = (slug: string) =>
  blogPosts.find((post) => post.slug === slug);

export const getRelatedPosts = (post: BlogPost, limit = 3) =>
  blogPosts
    .filter((item) => item.slug !== post.slug && item.category === post.category)
    .slice(0, limit);

export const getLatestPosts = (limit = 3) =>
  [...blogPosts]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, limit);
