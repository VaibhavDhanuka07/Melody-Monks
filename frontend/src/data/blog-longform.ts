type LongFormSection = {
  heading?: string;
  paragraphs: string[];
};

type PracticeArticleConfig = {
  introTopic: string;
  introProblem: string;
  fundamentals: [string, string, string];
  session: [string, string, string];
  progress: [string, string, string];
  videoFocus: string;
  practiceTips: [string, string, string];
};

type CareerArticleConfig = {
  introTopic: string;
  reality: string;
  build: [string, string, string];
  professionalHabits: [string, string, string];
  videoFocus: string;
  practiceTips: [string, string, string];
};

const trialCta =
  "Train directly with Debojeet Lahiri at Melody Monks. Book a free trial class and get a personalized practice plan with live sessions on Google Meet or Zoom.";

const buildPracticeArticle = ({
  introTopic,
  introProblem,
  fundamentals,
  session,
  progress,
  videoFocus,
  practiceTips,
}: PracticeArticleConfig): LongFormSection[] => [
  {
    heading: "Introduction",
    paragraphs: [
      `${introTopic} becomes much easier when you stop guessing and follow a clear routine. ${introProblem}. Most learners improve faster when they build around ${fundamentals[0]}, ${fundamentals[1]}, and ${fundamentals[2]} instead of rushing into advanced material too early. The goal is not quick tricks. The goal is repeatable habits that make the skill feel stable from one practice session to the next. At Melody Monks, Debojeet Lahiri teaches this same idea through disciplined daily riyaz and clear weekly milestones. When practice is structured, motivation lasts longer because progress becomes easier to notice.`,
    ],
  },
  {
    heading: "Main Sections",
    paragraphs: [
      `Start each session with ${session[0]}. Then move into ${session[1]}. Finish by ${session[2]}. This sequence works because it prepares the body, trains the ear, and applies the concept inside real music. When students skip directly to speed or performance, weak fundamentals stay hidden and progress becomes inconsistent.`,
      `Do not judge progress only by how impressive the result sounds on one good day. Look for ${progress[0]}, ${progress[1]}, and ${progress[2]}. Recording short clips and reviewing them honestly is one of the fastest ways to improve because small technical problems become visible before they become permanent habits.`,
    ],
  },
  {
    heading: "Video Section",
    paragraphs: [
      `A useful video for this article should ${videoFocus}. The best lessons show the idea slowly first and then place it inside a short musical example. That makes the article practical instead of theoretical and helps students copy the routine immediately in their own practice. Visual pacing matters because beginners often understand a concept only after seeing it demonstrated step by step.`,
    ],
  },
  {
    heading: "Practice Tips",
    paragraphs: [
      `Keep practice ${practiceTips[0]}. ${practiceTips[1]}. ${practiceTips[2]}. Consistency matters more than intensity, and steady weekly work produces better long term results than occasional long sessions. A simple repeatable routine almost always beats a complicated plan that is followed for only two or three days.`,
    ],
  },
  {
    heading: "Call to Action",
    paragraphs: [trialCta],
  },
];

const buildCareerArticle = ({
  introTopic,
  reality,
  build,
  professionalHabits,
  videoFocus,
  practiceTips,
}: CareerArticleConfig): LongFormSection[] => [
  {
    heading: "Introduction",
    paragraphs: [
      `${introTopic} is less about one big break and more about long term preparation. ${reality}. Students who build patiently around skill, clarity, and consistency usually last longer than people who chase visibility before they are truly ready. At Melody Monks, Debojeet Lahiri frames career growth as a long term discipline built on repeatable standards, not short bursts of excitement. A music career grows when training and professional thinking improve together. The strongest careers are usually built through many small disciplined steps that compound over time.`,
    ],
  },
  {
    heading: "Main Sections",
    paragraphs: [
      `The first step is to build ${build[0]}, ${build[1]}, and ${build[2]}. That combination gives you a stronger base than talent alone because it prepares you for auditions, recordings, classes, collaborations, and live performance. A career becomes realistic when your work can be repeated under pressure, not only when the mood feels perfect.`,
      `The next step is to develop ${professionalHabits[0]}, ${professionalHabits[1]}, and ${professionalHabits[2]}. These habits matter because the industry notices reliability very quickly. Musicians who communicate clearly, arrive prepared, and keep learning tend to create more opportunities than equally talented people who remain inconsistent.`,
    ],
  },
  {
    heading: "Video Section",
    paragraphs: [
      `A strong video for this topic should ${videoFocus}. Practical behind the scenes examples are more useful than motivational talk alone because students need to see how preparation works in real situations and not just hear general advice. Real examples make it easier to connect classroom training with actual professional expectations.`,
    ],
  },
  {
    heading: "Practice Tips",
    paragraphs: [
      `Keep your career development ${practiceTips[0]}. ${practiceTips[1]}. ${practiceTips[2]}. Professional growth in music is usually the result of small disciplined steps repeated over a long period of time. People who treat preparation seriously before opportunities arrive are usually the ones who can use those opportunities well when they finally appear.`,
    ],
  },
  {
    heading: "Call to Action",
    paragraphs: [trialCta],
  },
];

export const longFormSections: Record<string, LongFormSection[]> = {
  "how-to-learn-singing-at-home-beginner-guide": buildPracticeArticle({
    introTopic: "Learning singing at home",
    introProblem:
      "many beginners wait for a teacher, studio, or perfect song before they start",
    fundamentals: [
      "posture and relaxed breathing",
      "slow sargam with pitch awareness",
      "simple song work done with patience",
    ],
    session: [
      "gentle humming, sirens, and breath preparation",
      "steady scale work with a tanpura or keyboard reference",
      "one easy melody where the same notes are applied musically",
    ],
    progress: [
      "cleaner note beginnings",
      "better breath management from week to week",
      "more stable sur when you record yourself",
    ],
    videoFocus:
      "demonstrate a full beginner home routine with breathing, sargam, one alankar, and one short song phrase",
    practiceTips: [
      "short and daily rather than heroic and irregular",
      "softer when the throat feels tired instead of louder",
      "recorded once a week so improvement can be heard clearly",
    ],
  }),
  "how-to-sing-better-in-30-days": buildPracticeArticle({
    introTopic: "Singing better in 30 days",
    introProblem:
      "many singers chase instant transformation without tracking their weekly progress",
    fundamentals: [
      "breath support",
      "pitch stability",
      "clear phrasing and diction",
    ],
    session: [
      "warmups and posture drills in week one",
      "slow sur training and scale work in week two",
      "song phrasing, recording review, and performance practice in weeks three and four",
    ],
    progress: [
      "steadier long notes",
      "more accurate phrases in recordings",
      "greater confidence on complete song lines",
    ],
    videoFocus:
      "compare day one practice with week by week checkpoints so the listener can hear realistic improvement",
    practiceTips: [
      "consistent enough that every week has a clear target",
      "tracked in a notebook or phone log after each session",
      "focused on one or two songs instead of constant switching",
    ],
  }),
  "breathing-techniques-for-singing": buildPracticeArticle({
    introTopic: "Breathing techniques for singing",
    introProblem:
      "many beginners inhale high into the chest and lose control halfway through a phrase",
    fundamentals: [
      "diaphragmatic expansion",
      "quiet shoulders and relaxed posture",
      "controlled release of air into the note",
    ],
    session: [
      "slow inhale and hiss exercises to control airflow",
      "comfortable sustained vowels with even tone",
      "simple musical phrases where breathing choices are planned in advance",
    ],
    progress: [
      "longer phrases without panic",
      "more stable tone on sustained notes",
      "less tension at phrase endings",
    ],
    videoFocus:
      "show the body from the side and compare unsupported breathing with supported breathing on the same phrase",
    practiceTips: [
      "included for five minutes before every singing session",
      "calm and controlled instead of forceful",
      "reduced in tempo whenever tension starts to appear",
    ],
  }),
  "bollywood-singing-tips-expressive-performance": buildPracticeArticle({
    introTopic: "Bollywood singing with expressive performance",
    introProblem:
      "many singers imitate famous voices too early and lose natural emotion in the process",
    fundamentals: [
      "clear diction",
      "emotional phrasing",
      "dynamic control that matches the lyric",
    ],
    session: [
      "speaking the lyrics like dialogue to find emotional stress",
      "singing the same line with different shades of intensity",
      "applying expression to one full verse without overacting",
    ],
    progress: [
      "more believable lyric delivery",
      "better control of soft and strong phrases",
      "greater confidence with mic friendly singing",
    ],
    videoFocus:
      "compare a flat version and an expressive version of the same Bollywood phrase with commentary on what changed",
    practiceTips: [
      "centered on one song at a time instead of many at once",
      "balanced with regular sur and rhythm work",
      "recorded often so emotional delivery can be reviewed honestly",
    ],
  }),
  "how-to-improve-your-singing-voice": buildPracticeArticle({
    introTopic: "Improving your singing voice",
    introProblem:
      "many people think a better voice comes from singing harder instead of singing smarter",
    fundamentals: [
      "balanced warmups",
      "resonance awareness",
      "consistent vowels and pitch control",
    ],
    session: [
      "relaxing the voice before heavy singing starts",
      "slow note and vowel work that keeps tone centered",
      "short recorded phrases where the same corrections are applied immediately",
    ],
    progress: [
      "steadier tone",
      "cleaner transitions between low and high notes",
      "recordings that sound more controlled than the week before",
    ],
    videoFocus:
      "walk through a real voice improvement session with before and after examples instead of only showing a polished result",
    practiceTips: [
      "inside a comfortable range until stability improves",
      "supported by sleep, hydration, and recovery",
      "patient enough that technique can settle before range is pushed",
    ],
  }),
  "piano-lessons-for-beginners-7-day-starter-plan": buildPracticeArticle({
    introTopic: "A 7 day beginner piano plan",
    introProblem:
      "many new students sit at the keyboard with enthusiasm but no clear first week structure",
    fundamentals: [
      "hand position and finger numbers",
      "note awareness around middle C",
      "simple rhythm and melody control",
    ],
    session: [
      "correct posture and keyboard layout on the first days",
      "small right hand patterns and counted rhythm exercises",
      "one easy melody plus basic left hand support by the end of the week",
    ],
    progress: [
      "cleaner finger shape",
      "better counting without rushing",
      "more confidence finding notes on the keyboard",
    ],
    videoFocus:
      "show the seven day plan step by step so the viewer can copy each day exactly at home",
    practiceTips: [
      "short enough that concentration stays high",
      "slow enough that every wrong note can be corrected immediately",
      "spoken aloud with note names and counts whenever possible",
    ],
  }),
  "10-easy-piano-songs-for-beginners": buildPracticeArticle({
    introTopic: "Choosing easy piano songs for beginners",
    introProblem:
      "many students pick songs that are too ambitious and turn practice into frustration",
    fundamentals: [
      "small hand movement",
      "repeated melodic patterns",
      "simple rhythm with clear phrasing",
    ],
    session: [
      "learning one hand melodies before full accompaniment",
      "adding steady left hand notes or chords gradually",
      "using each song as a lesson in timing, tone, and confidence",
    ],
    progress: [
      "smoother phrase connection",
      "better pulse",
      "cleaner coordination between melody and accompaniment",
    ],
    videoFocus:
      "present a set of beginner friendly songs and explain what skill each song teaches",
    practiceTips: [
      "limited to two or three songs at one time",
      "built around looping difficult bars instead of restarting constantly",
      "guided by musical accuracy before speed",
    ],
  }),
  "how-to-play-bollywood-songs-on-piano": buildPracticeArticle({
    introTopic: "Playing Bollywood songs on piano",
    introProblem:
      "many beginners can find the melody with one finger but do not know how to support it harmonically",
    fundamentals: [
      "accurate right hand melody",
      "basic chord understanding",
      "an accompaniment pattern that fits the song mood",
    ],
    session: [
      "learning the melody phrase by phrase",
      "adding simple blocked chords or broken chords under key lines",
      "shaping the rhythm so the arrangement sounds musical instead of mechanical",
    ],
    progress: [
      "clearer melody plus chord balance",
      "more convincing rhythmic flow",
      "arrangements that sound complete even at a beginner level",
    ],
    videoFocus:
      "break one Bollywood song into melody only, melody plus chords, and melody plus fuller accompaniment",
    practiceTips: [
      "slow enough that both hands stay relaxed",
      "based on songs that fit your current technical level",
      "guided by listening for mood and phrasing, not only note correctness",
    ],
  }),
  "piano-scales-guide-for-beginners": buildPracticeArticle({
    introTopic: "Piano scales for beginners",
    introProblem:
      "many students avoid scales because they sound repetitive and do not yet understand their value",
    fundamentals: [
      "fingering consistency",
      "smooth thumb crossings",
      "even tone and rhythm",
    ],
    session: [
      "one key at a time with separate hands",
      "slow scale repetitions that stay relaxed at the crossover points",
      "daily scale work before songs so technique supports repertoire",
    ],
    progress: [
      "less hesitation at finger crossings",
      "stronger knowledge of key shapes",
      "easier navigation of melodies and chords in songs",
    ],
    videoFocus:
      "show the hands from above and from the side so students can see both fingering and wrist freedom",
    practiceTips: [
      "brief but daily instead of occasional marathon scale sessions",
      "counted with a steady pulse at every speed",
      "stopped immediately when tension appears in the hands",
    ],
  }),
  "guitar-chords-for-beginners": buildPracticeArticle({
    introTopic: "Learning guitar chords as a beginner",
    introProblem:
      "many players press too hard, mute strings accidentally, and then rush into strumming before the shape is ready",
    fundamentals: [
      "smart finger placement close to the fret",
      "a relaxed thumb and wrist",
      "slow chord transitions practiced without panic",
    ],
    session: [
      "checking each note of the chord one string at a time",
      "switching between two shapes before adding rhythm",
      "bringing in a simple metronome strum only after the changes feel cleaner",
    ],
    progress: [
      "fewer muted strings",
      "faster chord setup with less tension",
      "strumming that feels steadier because the left hand is more secure",
    ],
    videoFocus:
      "show the fretting hand closely and explain why buzzing or muted strings happen on common beginner chords",
    practiceTips: [
      "focused on two or three chord pairs at a time",
      "gentle enough that the hand can rest before tension builds",
      "judged by clarity first and speed second",
    ],
  }),
  "how-to-learn-guitar-fast-daily-practice-plan": buildPracticeArticle({
    introTopic: "Learning guitar fast with a daily practice plan",
    introProblem:
      "many beginners spend time repeating favorite songs without fixing the weak basics underneath them",
    fundamentals: [
      "targeted chord work",
      "rhythm training with a metronome",
      "short technical drills followed by song application",
    ],
    session: [
      "five minutes of hand preparation and picking control",
      "ten minutes of chord transitions and timing work",
      "a final song segment where the same chords and rhythms are used musically",
    ],
    progress: [
      "smoother weekly chord goals",
      "better tempo control",
      "songs that can be played from start to finish with fewer breaks",
    ],
    videoFocus:
      "show one full beginner session in real time so the student understands how each block supports the next",
    practiceTips: [
      "guided by one weekly goal instead of random targets",
      "logged after each session so trends are visible",
      "slow enough that mistakes remain easy to notice and correct",
    ],
  }),
  "easy-bollywood-songs-on-guitar": buildPracticeArticle({
    introTopic: "Easy Bollywood songs on guitar",
    introProblem:
      "many learners choose flashy arrangements before they can hold rhythm and chord changes steadily",
    fundamentals: [
      "friendly open chord progressions",
      "steady strumming",
      "song choices that match the current level",
    ],
    session: [
      "playing the chord progression alone with counted beats",
      "adding melody awareness by humming or singing over the pattern",
      "layering simple fills only after the base groove feels solid",
    ],
    progress: [
      "cleaner transitions inside real songs",
      "stronger rhythmic confidence",
      "arrangements that sound musical without being overcomplicated",
    ],
    videoFocus:
      "demonstrate several beginner friendly Bollywood songs and explain why each one is useful for chord and rhythm development",
    practiceTips: [
      "built on songs you genuinely enjoy practicing",
      "kept simple until the groove feels automatic",
      "improved by isolating one rough transition at a time",
    ],
  }),
  "fingerstyle-guitar-guide-for-beginners": buildPracticeArticle({
    introTopic: "Beginning fingerstyle guitar",
    introProblem:
      "many students love the sound but feel lost because the right hand roles are not yet organized",
    fundamentals: [
      "thumb control on bass strings",
      "independence of the index and middle fingers",
      "steady pulse underneath every picking pattern",
    ],
    session: [
      "repeating the simplest bass and treble pattern without chords first",
      "adding one easy chord while keeping the same hand motion",
      "bringing out melody notes only after the pattern feels rhythmically stable",
    ],
    progress: [
      "more even picking",
      "clearer separation between bass and melody",
      "less tension in the right hand during longer patterns",
    ],
    videoFocus:
      "show the picking hand closely and name the role of each finger on a simple beginner pattern",
    practiceTips: [
      "narrow enough that one or two patterns can actually become comfortable",
      "counted like rhythm practice rather than guessed by feel",
      "expanded slowly from accuracy to speed to expression",
    ],
  }),
  "introduction-to-hindustani-classical-music": buildPracticeArticle({
    introTopic: "Understanding Hindustani classical music as a beginner",
    introProblem:
      "many students feel overwhelmed because the vocabulary seems deep before the basics are explained clearly",
    fundamentals: [
      "sur and listening",
      "taal awareness",
      "the relationship between riyaz and raag identity",
    ],
    session: [
      "hearing and matching a drone with slow swaras",
      "clapping a simple taal while counting the cycle aloud",
      "repeating short melodic phrases so theory is connected to sound",
    ],
    progress: [
      "stronger pitch awareness",
      "better rhythmic grounding",
      "a clearer sense of how classical concepts connect to actual music",
    ],
    videoFocus:
      "explain sur, taal, riyaz, and raag with live musical examples instead of theory alone",
    practiceTips: [
      "patient enough that listening becomes part of study",
      "focused on a few core ideas before advanced repertoire",
      "repeated daily through short musical exercises rather than only reading definitions",
    ],
  }),
  "what-is-raag-yaman-tutorial-practice-guide": buildPracticeArticle({
    introTopic: "Learning Raag Yaman",
    introProblem:
      "many beginners memorize the notes but do not yet hear the raag character in the phrasing",
    fundamentals: [
      "clear aroha and avaroha",
      "sensitivity to tivra Ma",
      "simple phrases that reveal the raag identity",
    ],
    session: [
      "singing or playing the scale slowly against a drone",
      "repeating the pakad and a few short phrase patterns",
      "applying the same sound inside a small bandish or alaap idea",
    ],
    progress: [
      "cleaner intonation on important notes",
      "phrases that sound more settled and less mechanical",
      "a stronger feeling for the mood of the raag",
    ],
    videoFocus:
      "move from scale to pakad to phrase practice so learners hear how a raag is different from a plain scale",
    practiceTips: [
      "soft and unhurried so the ear can settle into the drone",
      "reviewed through recordings for rushed phrasing or weak intonation",
      "done briefly every day rather than in one long weekly session",
    ],
  }),
  "basic-alankars-for-singing": buildPracticeArticle({
    introTopic: "Practicing basic alankars for singing",
    introProblem:
      "many learners know alankars are important but treat them like mechanical drills instead of musical training",
    fundamentals: [
      "slow note accuracy",
      "pattern memory",
      "even vocal movement between swaras",
    ],
    session: [
      "simple straight patterns at a calm speed",
      "small grouped note combinations with a drone or keyboard reference",
      "the same alankars in different speeds only after accuracy is secure",
    ],
    progress: [
      "cleaner swara placement",
      "smoother transitions between notes",
      "greater confidence when similar movements appear inside songs or raag work",
    ],
    videoFocus:
      "demonstrate a few beginner alankars slowly, then correct common mistakes like rushing and swallowed notes",
    practiceTips: [
      "included in every daily riyaz session for at least a few minutes",
      "guided by tone quality and not only by memory",
      "kept relaxed so repetition builds control instead of tension",
    ],
  }),
  "understanding-taal-in-indian-music": buildPracticeArticle({
    introTopic: "Understanding taal in Indian music",
    introProblem:
      "many beginners hear rhythm only as speed and do not yet feel the full cycle underneath the phrase",
    fundamentals: [
      "clapping and counting the cycle correctly",
      "feeling the sam and khali",
      "applying rhythm inside real musical phrases",
    ],
    session: [
      "speaking and clapping a simple taal like teentaal or keharwa",
      "counting divisions clearly while listening for the return to sam",
      "singing or playing a short phrase inside the cycle instead of outside it",
    ],
    progress: [
      "more secure counting",
      "better phrase placement in rhythm",
      "greater confidence during performance or practice with accompaniment",
    ],
    videoFocus:
      "show the hand gestures, counts, and one short musical example in the same taal so structure and sound are connected",
    practiceTips: [
      "slow enough that the cycle never feels rushed",
      "spoken aloud before being performed musically",
      "repeated until the body starts feeling the return to sam naturally",
    ],
  }),
  "harmonium-lessons-for-beginners": buildPracticeArticle({
    introTopic: "Beginning harmonium lessons",
    introProblem:
      "many students press the right notes but still sound uneven because hand control and phrasing are not yet organized",
    fundamentals: [
      "keyboard familiarity",
      "steady fingering",
      "musical connection between swaras instead of isolated key pressing",
    ],
    session: [
      "locating swaras clearly in one comfortable octave",
      "practicing sargam and simple alankars with even movement",
      "using short song or bandish phrases to turn note work into music",
    ],
    progress: [
      "cleaner swara recognition",
      "more even phrase flow",
      "better support for vocal practice or self accompaniment",
    ],
    videoFocus:
      "show the hand position, note layout, and one simple accompaniment example from a close camera angle",
    practiceTips: [
      "calm and accurate instead of fast and careless",
      "guided by consistent fingering on repeated phrases",
      "reviewed for evenness and tone rather than only note correctness",
    ],
  }),
  "tabla-basics-theka-taal-practice-routine": buildPracticeArticle({
    introTopic: "Learning tabla basics",
    introProblem:
      "many beginners want speed too early and miss the clarity that makes real progress possible",
    fundamentals: [
      "clear bols",
      "a stable theka",
      "awareness of how every stroke fits inside taal",
    ],
    session: [
      "speaking bols before playing them",
      "repeating individual strokes until the sound becomes cleaner",
      "playing a simple theka with a steady lehra or metronome at a slow speed",
    ],
    progress: [
      "clearer stroke quality",
      "better timing through the full cycle",
      "more confidence maintaining theka without rushing",
    ],
    videoFocus:
      "demonstrate hand position closely and connect each bol to its place inside a simple taal cycle",
    practiceTips: [
      "short, focused, and regular",
      "based on accuracy before tempo increases",
      "supported by listening back to timing and sound quality often",
    ],
  }),
  "how-to-become-a-professional-singer": buildCareerArticle({
    introTopic: "Becoming a professional singer",
    reality:
      "A real career usually grows from years of preparation, not one lucky moment",
    build: [
      "dependable vocal technique",
      "a truthful repertoire that suits your voice",
      "real performance and recording experience",
    ],
    professionalHabits: [
      "clear artistic identity",
      "consistent rehearsal and self review",
      "professional communication with collaborators and clients",
    ],
    videoFocus:
      "show the path from training room to rehearsal to recording or stage performance so students can see the real workflow",
    practiceTips: [
      "serious even before the first paid opportunity arrives",
      "built through small public performances and strong recordings",
      "open to honest feedback instead of empty praise",
    ],
  }),
  "how-to-prepare-for-reality-shows": buildCareerArticle({
    introTopic: "Preparing for reality shows",
    reality:
      "Auditions test voice, confidence, adaptability, and emotional control at the same time",
    build: [
      "smart song selection that fits your current strength",
      "mock auditions that simulate pressure and timing",
      "backup material for sudden changes or judge requests",
    ],
    professionalHabits: [
      "clear speaking and stage presence",
      "calm recovery after small mistakes",
      "vocal care and rest in the final days before the audition",
    ],
    videoFocus:
      "simulate a full audition process from entry to performance and explain common mistakes in real time",
    practiceTips: [
      "centered on the songs you can deliver reliably right now",
      "rehearsed under realistic pressure instead of only in comfort",
      "finished with confidence, not last minute experimentation",
    ],
  }),
  "careers-in-the-music-industry-in-india": buildCareerArticle({
    introTopic: "Building a career in the music industry in India",
    reality:
      "The field is much wider than only playback or stage fame and often rewards versatile musicians most",
    build: [
      "an honest understanding of your strengths",
      "skills that match real market needs such as teaching, accompaniment, composing, or performing",
      "a body of work that can be shared professionally",
    ],
    professionalHabits: [
      "reliable communication and deadlines",
      "strong demo or portfolio presentation",
      "steady networking built on skill rather than hype",
    ],
    videoFocus:
      "feature several professionals explaining what daily work looks like in performance, teaching, session recording, and related music roles",
    practiceTips: [
      "open to more than one income stream in music",
      "rooted in strong musicianship before branding ambitions",
      "grown through consistent output and relationships over time",
    ],
  }),
  "how-to-start-teaching-music-online": buildCareerArticle({
    introTopic: "Starting to teach music online",
    reality:
      "Online teaching becomes effective only when structure, demonstration quality, and feedback are handled seriously",
    build: [
      "a clear student focus and syllabus",
      "lessons that combine technique with musical application",
      "simple reliable tools for class notes, assignments, and recordings",
    ],
    professionalHabits: [
      "good audio and camera framing",
      "pacing that keeps students engaged through the screen",
      "regular feedback that shows students how to improve week by week",
    ],
    videoFocus:
      "show a real online class where the teacher demonstrates, listens, corrects, and follows up clearly",
    practiceTips: [
      "started with a small group so the teaching flow can improve quickly",
      "reviewed through student feedback after every cycle",
      "supported by a setup that values clarity more than decoration",
    ],
  }),
};
