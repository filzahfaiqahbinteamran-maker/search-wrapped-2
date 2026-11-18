import type { CategoryId, CategoryInfo, Question } from './types.ts';

export const CATEGORIES: Record<CategoryId, CategoryInfo> = {
  trendsetter: {
    id: 'trendsetter',
    name: 'Trendsetter',
    emoji: '🔥',
    badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    bgGradient: 'from-purple-500/20 via-violet-600/10 to-fuchsia-900/30',
    bubbleColor: '#a855f7',
    borderColor: 'border-purple-500/40',
    textColor: 'text-purple-400',
    shortDesc:
      'From Labubu restocks and bag charms to hot honey on everything, you caught every viral wave before it peaked.',
    isometricConcept:
      'An isometric 3D minimalist desk setup diorama featuring a giant walnut wood monitor riser holding a glossy white picture frame, Labubu bag charms, and a tiny figure curating the ultimate viral collection.',
  },
  superfan: {
    id: 'superfan',
    name: 'Superfan',
    emoji: '🎤',
    badgeColor: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
    bgGradient: 'from-pink-500/20 via-rose-600/10 to-purple-900/30',
    bubbleColor: '#ec4899',
    borderColor: 'border-pink-500/40',
    textColor: 'text-pink-400',
    shortDesc:
      'Whether queuing all night for Lady Gaga at the National Stadium or binging Squid Game, your fandom energy is unmatched.',
    isometricConcept:
      'An isometric 3D render of a giant, retro-styled red and white striped popcorn bucket overflowing with glossy golden popcorn kernels next to a concert stage spotlight and smartphone-holding dancers.',
  },
  ai_whiz: {
    id: 'ai_whiz',
    name: 'AI Whiz',
    emoji: '🤖',
    badgeColor: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    bgGradient: 'from-teal-500/20 via-emerald-600/10 to-cyan-900/30',
    bubbleColor: '#14b8a6',
    borderColor: 'border-teal-500/40',
    textColor: 'text-teal-400',
    shortDesc:
      'From DeepSeek vs Gemini showdowns to Nano Banana figurines and vibe coding your own app, you live in the future.',
    isometricConcept:
      'An isometric 3D scene featuring a giant cute retro smartphone with glowing pastel AI prompt tabs fanning out like cards, while tiny figures build apps and 3D figurines around the base.',
  },
  curious_mind: {
    id: 'curious_mind',
    name: 'Curious Mind',
    emoji: '🧠',
    badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    bgGradient: 'from-indigo-500/20 via-blue-600/10 to-slate-900/30',
    bubbleColor: '#6366f1',
    borderColor: 'border-indigo-500/40',
    textColor: 'text-indigo-400',
    shortDesc:
      'From decoding how BTO works and SG Culture Pass perks to why cats knead, no rabbit hole escaped your search bar.',
    isometricConcept:
      'An isometric 3D toy-world representation of curiosity with a giant ancient stone column housing a glowing interior library, while a tiny detective climbs a spiral staircase around the column.',
  },
  foodie: {
    id: 'foodie',
    name: 'Foodie',
    emoji: '🍜',
    badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    bgGradient: 'from-amber-500/20 via-yellow-600/10 to-orange-900/30',
    bubbleColor: '#f59e0b',
    borderColor: 'border-amber-500/40',
    textColor: 'text-amber-400',
    shortDesc:
      'From Yo-Chi queues and homemade Dubai chocolate to sourdough baking and Taiwan night markets, your taste buds led the way.',
    isometricConcept:
      'An isometric 3D miniature kitchen scene featuring an oversized, polished cast-iron skillet holding a giant glossy fried egg and toasted sourdough, while a tiny figure on a step-ladder seasons the dish.',
  },
  jetsetter: {
    id: 'jetsetter',
    name: 'Jetsetter',
    emoji: '✈️',
    badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    bgGradient: 'from-cyan-500/20 via-sky-600/10 to-blue-900/30',
    bubbleColor: '#06b6d4',
    borderColor: 'border-cyan-500/40',
    textColor: 'text-cyan-400',
    shortDesc:
      'Always plotting the next 2026 long weekend, JB getaway, Japan itinerary, or Hokkaido escape before the current trip ends.',
    isometricConcept:
      'An isometric 3D diorama of a giant, vintage-style compass resting on a grassy hill with a cozy wooden A-frame cabin, smoking chimney, stylized pine trees, and a glowing campfire on top of the dial.',
  },
};

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: 'Be honest: what did you search the most this year?',
    options: [
      { key: 'A', query: 'Labubu restock', category: 'trendsetter' },
      { key: 'B', query: 'Lady Gaga Mayhem tour tickets', category: 'superfan' },
      { key: 'C', query: 'DeepSeek vs Gemini', category: 'ai_whiz' },
      { key: 'D', query: 'How to use my SG Culture Pass', category: 'curious_mind' },
    ],
  },
  {
    id: 2,
    prompt: 'Which show did you binge without stopping?',
    options: [
      { key: 'A', query: 'Squid Game', category: 'superfan' },
      { key: 'B', query: 'Culinary Class Wars', category: 'foodie' },
      { key: 'C', query: 'Running Man', category: 'jetsetter' },
      { key: 'D', query: 'Adolescence', category: 'curious_mind' },
    ],
  },
  {
    id: 3,
    prompt: 'Which artist or concert would you queue all night for?',
    options: [
      { key: 'A', query: 'Lady Gaga at the National Stadium', category: 'superfan' },
      { key: 'B', query: 'The KPop Demon Hunters soundtrack, live', category: 'trendsetter' },
      { key: 'C', query: "Any concert, as long as it's in Bangkok or KL", category: 'jetsetter' },
      { key: 'D', query: 'Phantom of the Opera at MBS', category: 'curious_mind' },
    ],
  },
  {
    id: 4,
    prompt: 'Which viral food or drink did you HAVE to try?',
    options: [
      { key: 'A', query: 'Yo-Chi, queue and all', category: 'foodie' },
      { key: 'B', query: 'Hot honey on everything', category: 'trendsetter' },
      { key: 'C', query: 'Thai milk tea, straight from Bangkok', category: 'jetsetter' },
      { key: 'D', query: 'The mala spot AI Mode told me to try', category: 'ai_whiz' },
    ],
  },
  {
    id: 5,
    prompt: 'Finish this search: "Why…", "How to…" or "When is…"',
    options: [
      { key: 'A', query: 'Why do cats knead', category: 'curious_mind' },
      { key: 'B', query: 'How to make Nano Banana figurines', category: 'ai_whiz' },
      { key: 'C', query: 'When is the next long weekend 2026', category: 'jetsetter' },
      { key: 'D', query: 'How to make Dubai chocolate at home', category: 'foodie' },
    ],
  },
  {
    id: 6,
    prompt: 'Which word or meme did you use way too much this year?',
    options: [
      { key: 'A', query: '67', category: 'trendsetter' },
      { key: 'B', query: '"Saranghae" (K-drama brain)', category: 'superfan' },
      { key: 'C', query: 'Gen Z stare', category: 'curious_mind' },
      { key: 'D', query: 'Shiok', category: 'foodie' },
    ],
  },
  {
    id: 7,
    prompt: 'Which social trend did you join, or watch everyone else join?',
    options: [
      { key: 'A', query: 'Labubu bag charms', category: 'trendsetter' },
      { key: 'B', query: 'Nano Banana figurine photos', category: 'ai_whiz' },
      { key: 'C', query: 'JB weekend trips', category: 'jetsetter' },
      { key: 'D', query: 'Concert OOTD posts', category: 'superfan' },
    ],
  },
  {
    id: 8,
    prompt: 'What did you ask AI to help you with?',
    options: [
      { key: 'A', query: 'Building my own app', category: 'ai_whiz' },
      { key: 'B', query: 'Planning a Japan itinerary', category: 'jetsetter' },
      { key: 'C', query: 'What to cook with overnight rice', category: 'foodie' },
      { key: 'D', query: 'Explaining how BTO works', category: 'curious_mind' },
    ],
  },
  {
    id: 9,
    prompt: 'Which new hobby or skill did you pick up?',
    options: [
      { key: 'A', query: 'Learning Korean', category: 'curious_mind' },
      { key: 'B', query: 'Sourdough baking', category: 'foodie' },
      { key: 'C', query: 'Collecting Pokémon cards', category: 'superfan' },
      { key: 'D', query: 'Vibe coding', category: 'ai_whiz' },
    ],
  },
  {
    id: 10,
    prompt: 'Where is your next holiday destination?',
    options: [
      { key: 'A', query: 'Hokkaido', category: 'jetsetter' },
      { key: 'B', query: 'Taiwan night markets', category: 'foodie' },
      { key: 'C', query: 'Bangkok, to hunt for Labubus', category: 'trendsetter' },
      { key: 'D', query: 'Shenzhen tech malls', category: 'ai_whiz' },
    ],
  },
];

export const HOST_QUIPS: Record<CategoryId, string[]> = {
  trendsetter: [
    'Your search bar knows about the Labubu restock before the store even opens.',
    'If it is trending on the timeline, you already have it clipped to your bag.',
    'Catching every cultural wave from 67 to KPop Demon Hunters in real time.',
  ],
  superfan: [
    'Queueing all night at the National Stadium builds character and legendary memories.',
    'From concert OOTDs to K-drama marathons, your dedication deserves a VIP lanyard.',
    'Nobody does main-character concert energy quite like your search history.',
  ],
  ai_whiz: [
    'Why do it manually when you can vibe code an app or prompt a Nano Banana figurine?',
    'Your browser is basically a futuristic command center for AI experiments.',
    'Letting AI Mode pick your dinner spot and build your side project? Peak efficiency.',
  ],
  curious_mind: [
    'One minute it is BTO rules and SG Culture Pass, the next it is why cats knead.',
    'Your search history is a masterclass in connecting completely unrelated rabbit holes.',
    'Never letting a random thought pass by without a thorough Google deep dive.',
  ],
  foodie: [
    'Will queue for Yo-Chi, will bake sourdough, and will never waste overnight rice.',
    'From Culinary Class Wars inspiration to homemade Dubai chocolate, your kitchen is thriving.',
    'Every holiday itinerary starts and ends with which night market stalls to hit first.',
  ],
  jetsetter: [
    'Already cross-referencing the 2026 long weekend calendar with flight deals.',
    'Whether it is a quick JB trip, Bangkok concert, or Hokkaido snow escape, your bags are packed.',
    'Mentally boarding your next getaway before your current trip even lands.',
  ],
};
