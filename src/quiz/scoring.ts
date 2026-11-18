import type {
  CategoryId,
  InsightCardData,
  WrappedResults,
  UserAnswers,
} from './types.ts';
import { CATEGORIES, QUIZ_QUESTIONS } from './data.ts';

const CATEGORY_DIAGNOSES: Record<CategoryId, { primary: string; copilot: string; wildcard: string }> = {
  trendsetter: {
    primary:
      'You had your finger firmly on the cultural pulse all year—from Labubu restocks and bag charms to drizzling hot honey on everything and flying to Bangkok for collectibles. Nothing goes viral without your search bar knowing first.',
    copilot:
      'Keeping your radar locked onto every emerging meme, soundtrack, and collectible drop so you are never out of the loop.',
    wildcard:
      'A spontaneous burst of hype-chasing energy that strikes whenever a new drop or viral obsession hits the group chat.',
  },
  superfan: {
    primary:
      'When you love something, you go all in. Between hunting down Lady Gaga Mayhem tour tickets at the National Stadium, binging Squid Game in one sitting, and curating concert OOTDs, your loyalty is unmatched.',
    copilot:
      'Channeling main-character stadium energy, K-drama catchphrases, and Pokémon card hunts into your everyday routine.',
    wildcard:
      'An instant surge of fan devotion whenever tickets drop or a new season lands on your watchlist.',
  },
  ai_whiz: {
    primary:
      'You lived in 3026 this year—comparing DeepSeek vs Gemini, generating Nano Banana figurines, vibe coding your own apps, and letting AI Mode recommend your next mala spot.',
    copilot:
      'Always ready to automate, experiment, and turn a wild idea into a working prototype or AI prompt.',
    wildcard:
      'A sudden urge to test the latest AI tool or browse Shenzhen tech malls for the next big thing.',
  },
  curious_mind: {
    primary:
      'Your brain never stops asking questions. One moment you are maximizing your SG Culture Pass and decoding how BTO works; the next you are learning Korean or investigating why cats knead.',
    copilot:
      'Serving as your ever-curious research companion, turning everyday mysteries and cultural moments into deep-dive learning sessions.',
    wildcard:
      'A late-night spark of curiosity that sends you down an unexpected rabbit hole just to understand how the world works.',
  },
  foodie: {
    primary:
      'Your year was deliciously driven by flavour—braving the Yo-Chi queue, recreating Dubai chocolate at home, baking sourdough after binging Culinary Class Wars, and dreaming of Taiwan night markets.',
    copilot:
      'Guiding every weekend plan and midnight kitchen experiment toward something undeniably shiok.',
    wildcard:
      'A sudden craving that turns leftover overnight rice or a viral recipe into a full culinary mission.',
  },
  jetsetter: {
    primary:
      'Your passport and calendar worked overtime this year. From mapping out 2026 long weekends and JB weekend runs to planning Japan itineraries, Bangkok concerts, and Hokkaido holidays, you are always ready for takeoff.',
    copilot:
      'Keeping one eye permanently on flight deals, cross-border getaways, and your next overseas adventure.',
    wildcard:
      'An impulsive wanderlust reflex that turns any free weekend into an excuse to pack a carry-on.',
  },
};

export function calculateWrappedResults(
  userAnswers: UserAnswers,
  userNameInput: string = 'Curious Voyager'
): WrappedResults {
  const userName = userNameInput.trim() || 'Curious Voyager';

  // 1. Tally scores
  const allScores: Record<CategoryId, number> = {
    trendsetter: 0,
    superfan: 0,
    ai_whiz: 0,
    curious_mind: 0,
    foodie: 0,
    jetsetter: 0,
  };

  const categoryQueriesPicked: Record<CategoryId, string[]> = {
    trendsetter: [],
    superfan: [],
    ai_whiz: [],
    curious_mind: [],
    foodie: [],
    jetsetter: [],
  };

  for (const q of QUIZ_QUESTIONS) {
    const chosenKey = userAnswers[q.id];
    if (chosenKey) {
      const option = q.options.find((opt) => opt.key === chosenKey);
      if (option) {
        allScores[option.category] += 1;
        categoryQueriesPicked[option.category].push(option.query);
      }
    }
  }

  // 2. Tie-breaking rule using final question (Q10), midpoint (Q6), and early anchor (Q3)
  const tieBreakBonus: Record<CategoryId, number> = {
    trendsetter: 0,
    superfan: 0,
    ai_whiz: 0,
    curious_mind: 0,
    foodie: 0,
    jetsetter: 0,
  };

  const qLast = QUIZ_QUESTIONS[QUIZ_QUESTIONS.length - 1];
  if (qLast && userAnswers[qLast.id]) {
    const opt = qLast.options.find((o) => o.key === userAnswers[qLast.id]);
    if (opt) tieBreakBonus[opt.category] += 4;
  }

  const q6 = QUIZ_QUESTIONS.find((q) => q.id === 6);
  if (q6 && userAnswers[6]) {
    const opt = q6.options.find((o) => o.key === userAnswers[6]);
    if (opt) tieBreakBonus[opt.category] += 2;
  }

  const q3 = QUIZ_QUESTIONS.find((q) => q.id === 3);
  if (q3 && userAnswers[3]) {
    const opt = q3.options.find((o) => o.key === userAnswers[3]);
    if (opt) tieBreakBonus[opt.category] += 1;
  }

  const allCategoryIds = Object.keys(CATEGORIES) as CategoryId[];
  const sortedCategories = [...allCategoryIds].sort((a, b) => {
    const scoreDiff = allScores[b] - allScores[a];
    if (scoreDiff !== 0) return scoreDiff;
    const tieDiff = tieBreakBonus[b] - tieBreakBonus[a];
    if (tieDiff !== 0) return tieDiff;
    return a.localeCompare(b);
  });

  // Top 3 categories
  const top3Ids = sortedCategories.slice(0, 3) as [CategoryId, CategoryId, CategoryId];

  const getAnthemQuery = (catId: CategoryId): string => {
    const picked = categoryQueriesPicked[catId];
    if (picked && picked.length > 0) {
      return picked[0];
    }
    for (const q of QUIZ_QUESTIONS) {
      const match = q.options.find((o) => o.category === catId);
      if (match) return match.query;
    }
    return 'unfiltered late-night curiosity';
  };

  const card1Category = CATEGORIES[top3Ids[0]];
  const card2Category = CATEGORIES[top3Ids[1]];
  const card3Category = CATEGORIES[top3Ids[2]];

  const card1: InsightCardData = {
    cardNumber: 1,
    cardRole: 'THE PRIMARY HEADSPACE',
    cardRoleEmoji: '📱',
    category: card1Category,
    score: allScores[top3Ids[0]],
    diagnosis: CATEGORY_DIAGNOSES[top3Ids[0]].primary,
    anthemQuery: getAnthemQuery(top3Ids[0]),
    isometricConcept: card1Category.isometricConcept,
  };

  const card2: InsightCardData = {
    cardNumber: 2,
    cardRole: 'THE CO-PILOT',
    cardRoleEmoji: '📱',
    category: card2Category,
    score: allScores[top3Ids[1]],
    diagnosis: CATEGORY_DIAGNOSES[top3Ids[1]].copilot,
    anthemQuery: getAnthemQuery(top3Ids[1]),
    isometricConcept: card2Category.isometricConcept,
  };

  const card3: InsightCardData = {
    cardNumber: 3,
    cardRole: 'THE WILDCARD',
    cardRoleEmoji: '📱',
    category: card3Category,
    score: allScores[top3Ids[2]],
    diagnosis: CATEGORY_DIAGNOSES[top3Ids[2]].wildcard,
    anthemQuery: getAnthemQuery(top3Ids[2]),
    isometricConcept: card3Category.isometricConcept,
  };

  const webglSpec = `// Render a transparent, glass-textured container sphere on canvas using Three.js and Matter.js.
// Inside are 3 interactive spherical 3D meshes representing the user's top categories:
// 1. Mesh #1 (Giant - Blue): ${card1.category.name} (Primary Space)
// 2. Mesh #2 (Medium - Red): ${card2.category.name} (Co-Pilot)
// 3. Mesh #3 (Small - Yellow): ${card3.category.name} (Wildcard)
// Each mesh has physics boundaries, collision detection, and custom drag-and-throw gesture handlers.
// Users can grab bubbles with pointer events, drag them, and toss them around—watching them bounce.`;

  const markdownOutput = `---
# 🔍 GOOGLE SEARCH WRAPPED

## 🗺️ INTERACTIVE LOAD SCREEN:
### YOUR WORLD OF SEARCH
> "${userName}, you've gone down every rabbit hole imaginable — So we built your World of Search. Click, drag, and toss the bubbles below to explore it!"

*🎮 [INTERACTIVE 3D WEBGL COMPONENT SPECIFICATION]:*
\`\`\`javascript
${webglSpec}
\`\`\`

---

## 🗂️ SWIPEABLE INSIGHT CARDS

### 📱 CARD #1: THE PRIMARY HEADSPACE
**[ ${card1.category.name} ${card1.category.emoji} ]**
> "You've been searching..."

## **${card1.category.name.toUpperCase()}**

*🎨 [3D ISOMETRIC ILLUSTRATION CONCEPT]: ${card1.isometricConcept}*

> **The Diagnosis:** ${card1.diagnosis}
> **Your Anthem Query:** \`${card1.anthemQuery}\`

**[ 📤 Share to Story ]**  **[ ➡️ Swipe to Next Card ]**

---

### 📱 CARD #2: THE CO-PILOT
**[ ${card2.category.name} ${card2.category.emoji} ]**
> "You've been searching..."

## **${card2.category.name.toUpperCase()}**

*🎨 [3D ISOMETRIC ILLUSTRATION CONCEPT]: ${card2.isometricConcept}*

> **The Diagnosis:** ${card2.diagnosis}
> **Your Anthem Query:** \`${card2.anthemQuery}\`

**[ 📤 Share to Story ]**  **[ ➡️ Swipe to Next Card ]**

---

### 📱 CARD #3: THE WILDCARD
**[ ${card3.category.name} ${card3.category.emoji} ]**
> "You've been searching..."

## **${card3.category.name.toUpperCase()}**

*🎨 [3D ISOMETRIC ILLUSTRATION CONCEPT]: ${card3.isometricConcept}*

> **The Diagnosis:** ${card3.diagnosis}
> **Your Anthem Query:** \`${card3.anthemQuery}\`

**[ 📤 Share to Story ]**  **[ 🌐 Explore Your World ]**
---
*(Share your bubbles with #GoogleSearchWrapped • g.co/searchwrapped)*`;

  return {
    userName,
    topCards: [card1, card2, card3],
    loadScreen: {
      leadIn: `${userName}, you've gone down every rabbit hole imaginable — So we built your World of Search. Click, drag, and toss the bubbles below to explore it!`,
      illustrationConcept: webglSpec,
    },
    allScores,
    markdownOutput,
  };
}
