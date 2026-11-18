import React from 'react';
import type { CategoryId } from '../quiz/types.ts';
import type { BubblePalette } from './BubbleText3D.tsx';

export interface CuriosityBubbleDesignSpec {
  id: CategoryId;
  index: number;
  emoji: string;
  name: string;
  kicker: string;
  bubbleTitle: string;
  palette: BubblePalette;
  bgColor: string;
  isDarkBg?: boolean;
  imageSrc: string;
  typographyStyle: string;
  isometricPrompt: string;
  centerObjectLabel: string;
}

export const CURIOSITY_BUBBLE_DESIGN_BOOK: Record<CategoryId, CuriosityBubbleDesignSpec> = {
  trendsetter: {
    id: 'trendsetter',
    index: 1,
    emoji: '🔥',
    name: 'Trendsetter',
    kicker: 'You searched like a',
    bubbleTitle: 'Trendsetter',
    palette: 'shopping_aesthetic',
    bgColor: '#EBEFF2',
    imageSrc: '/assets/aistudio/persona_trendsetter.png',
    typographyStyle:
      'Warm yellow-to-orange-to-pink 3D sticker lettering with a crisp dark contour.',
    isometricPrompt:
      'An isometric illustration of a hand holding a smartphone with a blazing VIRAL flame badge, social heart reactions, a floating Meme speech bubble, and a pink megaphone.',
    centerObjectLabel: 'Viral Phone & Megaphone',
  },
  superfan: {
    id: 'superfan',
    index: 2,
    emoji: '🎤',
    name: 'Superfan',
    kicker: 'You searched like a',
    bubbleTitle: 'Superfan',
    palette: 'pop_culture',
    bgColor: '#EBEFF2',
    imageSrc: '/assets/aistudio/persona_superfan.png',
    typographyStyle:
      'Electric magenta with a neon purple outline and glossy stage-light shine.',
    isometricPrompt:
      'An isometric concert stage with a SOLD OUT banner, giant speakers, cheering fans with raised arms, golden VIP ticket stubs, and a clipboard set list.',
    centerObjectLabel: 'Sold-Out Concert Stage',
  },
  foodie: {
    id: 'foodie',
    index: 3,
    emoji: '🍜',
    name: 'Foodie',
    kicker: 'You searched like a',
    bubbleTitle: 'Foodie',
    palette: 'food_snacks',
    bgColor: '#EBEFF2',
    imageSrc: '/assets/aistudio/persona_foodie.png',
    typographyStyle:
      'Sunny-side-up golden yellow with a warm toasted-brown outline.',
    isometricPrompt:
      'An isometric Noodle Bar stall topped with a giant steaming ramen bowl, colorful steamed bao buns, a red-and-yellow striped awning, and a boba milk tea cup.',
    centerObjectLabel: 'Noodle Bar & Boba Stall',
  },
  jetsetter: {
    id: 'jetsetter',
    index: 4,
    emoji: '✈️',
    name: 'Jetsetter',
    kicker: 'You searched like a',
    bubbleTitle: 'Jetsetter',
    palette: 'escapism_travel',
    bgColor: '#EBEFF2',
    imageSrc: '/assets/aistudio/persona_jetsetter.png',
    typographyStyle:
      'Warm golden sunset gradient with a crisp dark contour.',
    isometricPrompt:
      'An isometric globe featuring a pink airport terminal and runway, world landmarks including the Eiffel Tower and Pyramids, a taking-off airliner, a passport with boarding passes, and a vintage travel suitcase.',
    centerObjectLabel: 'Global Airport & Passport',
  },
  ai_whiz: {
    id: 'ai_whiz',
    index: 5,
    emoji: '🤖',
    name: 'AI Whiz',
    kicker: 'You searched like an',
    bubbleTitle: 'AI Whiz',
    palette: 'tech_glitches',
    bgColor: '#EBEFF2',
    imageSrc: '/assets/aistudio/persona_ai_whiz.png',
    typographyStyle:
      'Futuristic cyan and lavender 3D block lettering with a crisp dark contour.',
    isometricPrompt:
      'An isometric futuristic laptop displaying a golden puzzle piece and Prompt window, surrounded by holographic AI interfaces, a glowing neural network brain, and a robotic hand.',
    centerObjectLabel: 'AI Prompt Laptop & Neural Hub',
  },
  curious_mind: {
    id: 'curious_mind',
    index: 6,
    emoji: '🧠',
    name: 'Curious Mind',
    kicker: 'You searched like a',
    bubbleTitle: 'Curious\nMind',
    palette: 'niche_history',
    bgColor: '#EBEFF2',
    imageSrc: '/assets/aistudio/persona_curious_mind.png',
    typographyStyle:
      'Cool lavender-to-cyan gradient text with lime-green highlights and a carved 3D bevel.',
    isometricPrompt:
      'An isometric stack of colorful hardcover books with an open book revealing intricate mechanical gears, a magnifying glass, a glowing lightbulb, a telescope, and a question mark thought cloud.',
    centerObjectLabel: 'Gear Book & Magnifying Glass',
  },
};

export function getCategoryBubbleMeta(categoryId: CategoryId): {
  kicker: string;
  bubbleTitle: string;
  palette: BubblePalette;
  bgColor: string;
  imageSrc: string;
  typographyStyle: string;
  isometricPrompt: string;
  centerObjectLabel: string;
} {
  const spec =
    CURIOSITY_BUBBLE_DESIGN_BOOK[categoryId] || CURIOSITY_BUBBLE_DESIGN_BOOK.trendsetter;
  return {
    kicker: spec.kicker,
    bubbleTitle: spec.bubbleTitle,
    palette: spec.palette,
    bgColor: spec.bgColor,
    imageSrc: spec.imageSrc,
    typographyStyle: spec.typographyStyle,
    isometricPrompt: spec.isometricPrompt,
    centerObjectLabel: spec.centerObjectLabel,
  };
}

interface IllustrationProps {
  categoryId?: CategoryId;
  className?: string;
}

export const WhimsicalIllustration: React.FC<IllustrationProps> = ({
  categoryId = 'trendsetter',
  className = 'w-full h-full',
}) => {
  const spec =
    CURIOSITY_BUBBLE_DESIGN_BOOK[categoryId] || CURIOSITY_BUBBLE_DESIGN_BOOK.trendsetter;

  return (
    <div
      style={{ backgroundColor: spec.bgColor }}
      className={`relative flex items-center justify-center overflow-hidden select-none ${className}`}
    >
      <img
        src={spec.imageSrc}
        alt={`${spec.name} — ${spec.centerObjectLabel} 3D isometric diorama`}
        referrerPolicy="no-referrer"
        className="w-full h-full object-contain object-center p-2 transition-transform duration-500"
      />
    </div>
  );
};
