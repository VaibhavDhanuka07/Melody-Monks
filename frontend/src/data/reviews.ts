export type Review = {
  id: string;
  studentName: string;
  photo: string;
  rating: number;
  reviewText: string;
  program: string;
  videoUrl?: string;
  videoPoster?: string;
};

const reviewData: Omit<Review, "id">[] = [
  {
    studentName: "Riya Sharma",
    photo: "/vasu/vasu-student-recital.svg",
    rating: 5,
    program: "Hindustani Classical Vocal",
    reviewText:
      "My sur accuracy improved dramatically. The riyaz plan and feedback were exactly what I needed.",
    videoUrl: "/videos/piano-student.mp4",
    videoPoster: "/vasu/vasu-student-recital.svg",
  },
  {
    studentName: "Aman Verma",
    photo: "/vasu/vasu-hero-stage.svg",
    rating: 4.9,
    program: "Bollywood Singing",
    reviewText:
      "Breath control and performance coaching helped me sing confidently on stage.",
  },
  {
    studentName: "Sneha Gupta",
    photo: "/vasu/vasu-studio-session.svg",
    rating: 5,
    program: "Playback Singing",
    reviewText:
      "The recording workflow training made studio sessions easy and professional.",
    videoUrl: "/videos/piano-instructor.mp4",
    videoPoster: "/vasu/vasu-studio-session.svg",
  },
  {
    studentName: "Karan Mehta",
    photo: "/vasu/vasu-live-class.svg",
    rating: 4.8,
    program: "Harmonium",
    reviewText:
      "I can now accompany my own vocals with confidence. The step-by-step guidance was excellent.",
  },
  {
    studentName: "Neha Kapoor",
    photo: "/vasu/vasu-practice-room.svg",
    rating: 5,
    program: "Stage Performance",
    reviewText:
      "I finally feel confident performing live. Stagecraft drills and feedback were a game-changer.",
  },
  {
    studentName: "Ishaan Rao",
    photo: "/vasu/vasu-mentor-portrait.svg",
    rating: 4.9,
    program: "Hindustani Classical Vocal",
    reviewText:
      "The riyaz structure is clear and consistent. I can finally hold notes without strain.",
  },
  {
    studentName: "Mansi Kulkarni",
    photo: "/vasu/vasu-studio-session.svg",
    rating: 5,
    program: "Bollywood Singing",
    reviewText:
      "Phrasing tips and mic guidance helped me sound more professional during recordings.",
  },
  {
    studentName: "Arjun Sethi",
    photo: "/vasu/vasu-concert-hall.svg",
    rating: 4.7,
    program: "Light Classical Music",
    reviewText:
      "Thumri and bhajan sessions are thoughtfully paced. I feel my expression improving.",
  },
  {
    studentName: "Payal Nair",
    photo: "/vasu/vasu-live-class.svg",
    rating: 5,
    program: "Playback Singing",
    reviewText:
      "The studio discipline modules are gold. I now understand how to prepare for takes.",
  },
  {
    studentName: "Rahul Khanna",
    photo: "/vasu/vasu-practice-room.svg",
    rating: 4.8,
    program: "Piano / Keyboard",
    reviewText:
      "Weekly drills and chord progressions make accompaniment feel easy and confident.",
  },
  {
    studentName: "Tanvi Joshi",
    photo: "/vasu/vasu-student-recital.svg",
    rating: 5,
    program: "Guitar",
    reviewText:
      "Chord transitions improved fast. The rhythm practice helped my strumming feel steady.",
  },
  {
    studentName: "Dev Patel",
    photo: "/vasu/vasu-hero-stage.svg",
    rating: 4.6,
    program: "Harmonium",
    reviewText:
      "I finally understand how to support vocal practice with the harmonium.",
  },
  {
    studentName: "Sakshi Jindal",
    photo: "/vasu/vasu-studio-session.svg",
    rating: 4.9,
    program: "Tabla",
    reviewText:
      "The bol patterns and layakari exercises are very systematic. Big improvement in clarity.",
  },
  {
    studentName: "Ritvik Das",
    photo: "/vasu/vasu-mentor-portrait.svg",
    rating: 5,
    program: "Music Theory",
    reviewText:
      "Concepts like harmony and notation finally make sense. The lessons are clean and structured.",
  },
  {
    studentName: "Nidhi Arora",
    photo: "/vasu/vasu-student-recital.svg",
    rating: 4.8,
    program: "Music Composition",
    reviewText:
      "I wrote my first complete melody with arrangement guidance. The feedback was precise.",
  },
  {
    studentName: "Vikram Iyer",
    photo: "/vasu/vasu-live-class.svg",
    rating: 4.7,
    program: "Recording Techniques",
    reviewText:
      "Mic placement and basic editing tips improved my home recordings instantly.",
  },
  {
    studentName: "Meera Balakrishnan",
    photo: "/vasu/vasu-practice-room.svg",
    rating: 5,
    program: "Stage Performance",
    reviewText:
      "Confidence drills and performance practice made me far more comfortable on stage.",
  },
  {
    studentName: "Saurabh Jain",
    photo: "/vasu/vasu-concert-hall.svg",
    rating: 4.9,
    program: "Hindustani Classical Vocal",
    reviewText:
      "The raag practice structure is strong. My intonation has become more stable.",
  },
  {
    studentName: "Ananya Roy",
    photo: "/vasu/vasu-hero-stage.svg",
    rating: 4.8,
    program: "Bollywood Singing",
    reviewText:
      "Diction and emotion coaching helped my performances feel genuine and expressive.",
  },
  {
    studentName: "Kabir Singh",
    photo: "/vasu/vasu-studio-session.svg",
    rating: 4.7,
    program: "Piano / Keyboard",
    reviewText:
      "The chord mapping and rhythm tasks are practical. I can now play along with songs.",
  },
  {
    studentName: "Ira Malhotra",
    photo: "/vasu/vasu-student-recital.svg",
    rating: 5,
    program: "Guitar",
    reviewText:
      "Fingerstyle basics and practice routines are easy to follow. Huge progress in 4 weeks.",
  },
  {
    studentName: "Rajeev Bhat",
    photo: "/vasu/vasu-practice-room.svg",
    rating: 4.6,
    program: "Harmonium",
    reviewText:
      "Warmups plus riyaz guidance improved my right-hand clarity and timing.",
  },
  {
    studentName: "Pooja Menon",
    photo: "/vasu/vasu-mentor-portrait.svg",
    rating: 4.9,
    program: "Tabla",
    reviewText:
      "Theka practice and bol clarity are emphasized the right way. Great structure.",
  },
  {
    studentName: "Rohan Chakraborty",
    photo: "/vasu/vasu-live-class.svg",
    rating: 4.8,
    program: "Light Classical Music",
    reviewText:
      "The expression exercises and bandish guidance made my singing more musical.",
  },
  {
    studentName: "Simran Kaur",
    photo: "/vasu/vasu-concert-hall.svg",
    rating: 5,
    program: "Playback Singing",
    reviewText:
      "Recording workflow and take discipline are now clear. My studio confidence grew fast.",
  },
  {
    studentName: "Kunal Bose",
    photo: "/vasu/vasu-studio-session.svg",
    rating: 4.7,
    program: "Music Theory",
    reviewText:
      "Intervals and chord basics are explained simply. I finally understand progressions.",
  },
  {
    studentName: "Aditi Sen",
    photo: "/vasu/vasu-student-recital.svg",
    rating: 4.9,
    program: "Music Composition",
    reviewText:
      "The melody writing templates are excellent. I can build themes faster now.",
  },
  {
    studentName: "Rakesh Kulkarni",
    photo: "/vasu/vasu-live-class.svg",
    rating: 4.8,
    program: "Recording Techniques",
    reviewText:
      "Clean signal chain tips and editing basics improved my vocal takes quickly.",
  },
  {
    studentName: "Shreya Nair",
    photo: "/vasu/vasu-hero-stage.svg",
    rating: 5,
    program: "Stage Performance",
    reviewText:
      "The stage confidence drills and live feedback made me comfortable in front of crowds.",
  },
  {
    studentName: "Avinash Rao",
    photo: "/vasu/vasu-practice-room.svg",
    rating: 4.9,
    program: "Hindustani Classical Vocal",
    reviewText:
      "Alaap practice and sur placement work are now part of my daily routine.",
  },
  {
    studentName: "Rupal Shah",
    photo: "/vasu/vasu-studio-session.svg",
    rating: 4.7,
    program: "Bollywood Singing",
    reviewText:
      "The phrase shaping drills made my singing feel lighter and more controlled.",
  },
  {
    studentName: "Siddharth Kapoor",
    photo: "/vasu/vasu-concert-hall.svg",
    rating: 4.8,
    program: "Piano / Keyboard",
    reviewText:
      "Left-hand patterns finally feel natural. The weekly goals are very practical.",
  },
  {
    studentName: "Kavya Reddy",
    photo: "/vasu/vasu-student-recital.svg",
    rating: 5,
    program: "Guitar",
    reviewText:
      "The strumming trainer and rhythm guidance corrected my timing issues quickly.",
  },
  {
    studentName: "Nitin Sood",
    photo: "/vasu/vasu-live-class.svg",
    rating: 4.6,
    program: "Harmonium",
    reviewText:
      "Accompaniment drills are clear and practical. Great for vocal support.",
  },
  {
    studentName: "Ayesha Khan",
    photo: "/vasu/vasu-mentor-portrait.svg",
    rating: 4.9,
    program: "Tabla",
    reviewText:
      "The rhythm exercises and bols were broken down perfectly. Very helpful.",
  },
  {
    studentName: "Priyansh Varma",
    photo: "/vasu/vasu-practice-room.svg",
    rating: 4.8,
    program: "Light Classical Music",
    reviewText:
      "I learned how to control dynamics and emotion. The guidance is truly professional.",
  },
  {
    studentName: "Leena Thomas",
    photo: "/vasu/vasu-studio-session.svg",
    rating: 5,
    program: "Playback Singing",
    reviewText:
      "Session planning and vocal stamina practice improved my recording consistency.",
  },
  {
    studentName: "Harshita Mehra",
    photo: "/vasu/vasu-hero-stage.svg",
    rating: 4.7,
    program: "Music Theory",
    reviewText:
      "The lessons connect theory to real songs, making it much easier to understand.",
  },
  {
    studentName: "Arpit Agarwal",
    photo: "/vasu/vasu-concert-hall.svg",
    rating: 4.9,
    program: "Music Composition",
    reviewText:
      "I can create melodic motifs and variations now. The feedback is direct and useful.",
  },
  {
    studentName: "Sonal Desai",
    photo: "/vasu/vasu-practice-room.svg",
    rating: 4.8,
    program: "Recording Techniques",
    reviewText:
      "Noise control and mic placement tips made my home setup much cleaner.",
  },
  {
    studentName: "Abhishek Rana",
    photo: "/vasu/vasu-live-class.svg",
    rating: 4.9,
    program: "Stage Performance",
    reviewText:
      "Live rehearsal and feedback helped me move naturally on stage. Big confidence boost.",
  },
  {
    studentName: "Pallavi Das",
    photo: "/vasu/vasu-student-recital.svg",
    rating: 5,
    program: "Hindustani Classical Vocal",
    reviewText:
      "Riyaz discipline and raag structure training improved my tone and stability.",
  },
  {
    studentName: "Devika Mohan",
    photo: "/vasu/vasu-mentor-portrait.svg",
    rating: 4.8,
    program: "Bollywood Singing",
    reviewText:
      "Performance confidence and diction training helped me sing with clarity.",
  },
  {
    studentName: "Sahil Grover",
    photo: "/vasu/vasu-concert-hall.svg",
    rating: 4.7,
    program: "Piano / Keyboard",
    reviewText:
      "Chord voicing drills and rhythm patterns are the best part of this program.",
  },
  {
    studentName: "Trisha Banerjee",
    photo: "/vasu/vasu-studio-session.svg",
    rating: 5,
    program: "Guitar",
    reviewText:
      "The practice schedule is simple and effective. My chords now sound clean.",
  },
];

export const reviews: Review[] = reviewData.map((review, index) => ({
  id: `review-${index + 1}`,
  ...review,
}));
