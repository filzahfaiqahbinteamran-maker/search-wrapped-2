import React, { useState, useEffect } from 'react';
import type { WrappedResults, InsightCardData } from '../quiz/types.ts';
import { CATEGORIES } from '../quiz/data.ts';
import {
  WhimsicalIllustration,
  getCategoryBubbleMeta,
  CURIOSITY_BUBBLE_DESIGN_BOOK,
} from './WhimsicalIsometricIllustrations.tsx';
import { BubbleText3D, isCoolBubblePalette } from './BubbleText3D.tsx';
import { GoogleLogo, ExploreGlobeIcon } from './GoogleLogo.tsx';
import { formatBubbleHoverIdentity } from '../quiz/worldNavigation.ts';
import { sound } from '../utils/sound.ts';
import {
  Share,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  X,
  Sparkles,
  Grid,
} from 'lucide-react';

interface SwipeableInsightCardsProps {
  results: WrappedResults;
  onShareCard: (card: InsightCardData) => void;
  onExploreWorld: () => void;
}

const ALL_10_CARDS: InsightCardData[] = Object.values(CURIOSITY_BUBBLE_DESIGN_BOOK).map(
  (spec, idx) => {
    const cat = CATEGORIES[spec.id];
    return {
      cardNumber: ((idx % 3) + 1) as 1 | 2 | 3,
      cardRole:
        idx === 0
          ? 'THE PRIMARY HEADSPACE'
          : idx === 1
          ? 'THE CO-PILOT'
          : 'THE WILDCARD',
      cardRoleEmoji: spec.emoji,
      category: cat,
      score: 3,
      diagnosis: cat.shortDesc,
      anthemQuery: spec.centerObjectLabel.toLowerCase(),
      isometricConcept: spec.isometricPrompt,
    };
  }
);

export const SwipeableInsightCards: React.FC<SwipeableInsightCardsProps> = ({
  results,
  onShareCard,
  onExploreWorld,
}) => {
  const [deckMode, setDeckMode] = useState<'top3' | 'all10'>('all10');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isCueCardHovered, setIsCueCardHovered] = useState<boolean>(false);
  const [isInsightMinimized, setIsInsightMinimized] = useState<boolean>(false);

  const activeDeck = deckMode === 'top3' ? results.topCards : ALL_10_CARDS;
  const safeIndex = Math.min(currentIndex, activeDeck.length - 1);
  const currentCard = activeDeck[safeIndex];
  const bubbleMeta = getCategoryBubbleMeta(currentCard.category.id);
  const bubbleSpec = CURIOSITY_BUBBLE_DESIGN_BOOK[currentCard.category.id];
  const isCool = isCoolBubblePalette(bubbleMeta.palette);
  const isTwoLineTitle = bubbleMeta.bubbleTitle.includes('\n');

  const hoverBubbleLabel = formatBubbleHoverIdentity(
    bubbleSpec?.index,
    currentCard.category.emoji,
    currentCard.category.name,
    bubbleSpec?.centerObjectLabel
  );

  const handleNext = () => {
    sound.playSelect();
    if (safeIndex < activeDeck.length - 1) {
      setCurrentIndex(safeIndex + 1);
    } else if (deckMode === 'top3') {
      sound.playReveal();
      onExploreWorld();
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    sound.playSelect();
    if (safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
    } else {
      setCurrentIndex(activeDeck.length - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [safeIndex, deckMode]);

  const activeDotSlot = safeIndex % 4;

  return (
    <div
      style={{ backgroundColor: bubbleMeta.bgColor }}
      data-insight-minimized={isInsightMinimized ? 'true' : 'false'}
      className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none transition-colors duration-300"
    >
      {/* Top Bar Below Status Bar: Circular White 'X' Minimise/Close Button (plus Deck Switcher when minimised) */}
      <div className="absolute top-11 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        {isInsightMinimized ? (
          <div className="pointer-events-auto flex items-center bg-white/95 backdrop-blur-md rounded-full p-0.5 shadow-md border border-neutral-900/80">
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setDeckMode('top3');
                setCurrentIndex(0);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                deckMode === 'top3'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Your Top 3</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setDeckMode('all10');
                setCurrentIndex(0);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                deckMode === 'all10'
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              <Grid className="w-3 h-3" />
              <span>All 6 Bubbles</span>
            </button>
          </div>
        ) : (
          <div />
        )}

        <button
          type="button"
          data-testid="cards-minimize-btn"
          onClick={() => {
            sound.playPop();
            setIsInsightMinimized((prev) => !prev);
          }}
          className="pointer-events-auto w-7 h-7 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 shadow-md flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
          title={
            isInsightMinimized
              ? 'Pop up insight card'
              : 'Minimise insight card to view full diorama'
          }
          aria-label={
            isInsightMinimized
              ? 'Pop up insight card'
              : 'Minimise insight card to view full diorama'
          }
        >
          {isInsightMinimized ? (
            <ChevronUp className="w-4 h-4 stroke-[2.4]" />
          ) : (
            <X className="w-3.5 h-3.5 stroke-[2.4]" />
          )}
        </button>
      </div>

      {/* Full-Bleed 3D Isometric Claymation Diorama Illustration */}
      <div className="relative flex-1 w-full overflow-hidden">
        <WhimsicalIllustration
          categoryId={currentCard.category.id}
          className="w-full h-full"
        />

        {/* Minimised Floating Pill Bar when Minimised to View Diorama */}
        {isInsightMinimized && (
          <div
            data-testid="cards-minimized-bar"
            className="absolute bottom-4 left-3.5 right-3.5 z-30 flex items-center justify-between gap-2 px-3 py-2 rounded-full bg-white/95 backdrop-blur-md text-neutral-900 shadow-[0_10px_30px_rgba(0,0,0,0.28)] border border-neutral-200"
          >
            <div className="flex items-center gap-1 min-w-0">
              <button
                type="button"
                onClick={handlePrev}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Previous card"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Next card"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-xs font-extrabold text-neutral-900 truncate pl-1">
                {currentCard.category.emoji} {bubbleMeta.bubbleTitle.replace(/\n+/g, ' ')}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                data-testid="cards-expand-btn"
                onClick={() => {
                  sound.playPop();
                  setIsInsightMinimized(false);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[11px] shadow-xs transition-all cursor-pointer"
              >
                <span>Pop Up Insight</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playReveal();
                  onExploreWorld();
                }}
                className="px-2.5 py-1.5 rounded-full bg-white hover:bg-neutral-50 text-neutral-900 font-bold text-[11px] border border-neutral-900 flex items-center justify-center cursor-pointer"
                aria-label="Explore World"
              >
                <ExploreGlobeIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Pop-Up Insight Section (Matching Reference Image 100%) */}
      {!isInsightMinimized && (
        <div
          data-testid="swipeable-insight-popup"
          className="relative z-20 shrink-0 w-full rounded-t-[28px] bg-white -mt-7 pb-2.5 flex flex-col items-center transition-all duration-300"
        >
          {/* Full-Width Rounded White Insight Card + Pastel Rainbow Bottom Edge Glow */}
          <div className="relative w-full">
            {/* Multi-Color Gradient Glow Along Bottom Curved Rim of Card */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute -bottom-2 left-1.5 right-1.5 h-6 rounded-full blur-[7px] ${
                isCool
                  ? 'bg-gradient-to-r from-[#818cf8]/75 via-[#38bdf8]/45 to-[#84cc16]/80'
                  : 'bg-gradient-to-r from-[#f472b6]/75 via-[#fb923c]/35 to-[#fde047]/85'
              }`}
            />

            <div
              data-testid="swipeable-insight-cue-card"
              data-bubble-hovered={isCueCardHovered ? 'true' : 'false'}
              onMouseEnter={() => setIsCueCardHovered(true)}
              onMouseLeave={() => setIsCueCardHovered(false)}
              className="group relative w-full bg-white text-neutral-900 rounded-t-[28px] rounded-b-[26px] px-6 pt-5 pb-4 shadow-[0_6px_18px_rgba(0,0,0,0.06)] flex flex-col items-center text-center transition-all duration-200"
            >
              {/* Floating Curiosity Bubble Identity Badge Revealed on Hover */}
              <div
                data-testid="swipeable-cue-card-bubble-reveal"
                className={`pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-white border-2 border-amber-400 shadow-xl transition-all duration-200 w-max max-w-[310px] ${
                  isCueCardHovered
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-1.5 scale-95 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100'
                }`}
              >
                <span
                  style={{ backgroundColor: bubbleMeta.bgColor }}
                  className="w-2.5 h-2.5 rounded-full border border-white shrink-0"
                />
                <span className="text-[10.5px] font-extrabold text-amber-300 tracking-tight truncate">
                  {hoverBubbleLabel}
                </span>
              </div>

              <p className="text-[13px] font-bold text-neutral-900 tracking-tight mb-0.5">
                {isCueCardHovered
                  ? `Bubble #${bubbleSpec?.index ?? 1}: ${currentCard.category.emoji} ${currentCard.category.name}`
                  : bubbleMeta.kicker}
              </p>

              {/* Authentic Multi-Layer 3D Sticker Bubble Title */}
              <BubbleText3D
                text={bubbleMeta.bubbleTitle}
                palette={bubbleMeta.palette}
                className={isTwoLineTitle ? 'w-full h-[92px] mt-1 mb-1.5' : 'w-full h-[72px] mt-1 mb-1.5'}
              />

              {/* Concise 3-Line Readable Copy Matching Reference Image */}
              <p className="text-[13px] text-neutral-800 leading-[1.36] max-w-[260px] mx-auto mt-1.5 mb-4">
                {currentCard.category.shortDesc}
              </p>

              {/* Bottom Watermark Row: Google 'G' on Left + 'youryear.google' Centered */}
              <div className="relative w-full flex items-center justify-center pt-0.5">
                <div className="absolute left-0 flex items-center">
                  <GoogleLogo className="w-4 h-4" />
                </div>
                <span className="text-[11.5px] font-bold text-neutral-900 tracking-tight">
                  youryear.google
                </span>
              </div>
            </div>
          </div>

          {/* Carousel Pagination Dots: < ▬ • • • > Directly Below Card */}
          <div className="flex items-center justify-center gap-3 mt-4 mb-3.5 text-neutral-700 text-xs">
            <button
              type="button"
              onClick={handlePrev}
              className="p-0.5 hover:text-neutral-950 transition-colors cursor-pointer"
              aria-label="Previous card"
            >
              <ChevronLeft className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3].map((slotIdx) => (
                <button
                  key={slotIdx}
                  type="button"
                  onClick={() => setCurrentIndex(slotIdx % activeDeck.length)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    slotIdx === activeDotSlot
                      ? 'w-4 bg-neutral-900'
                      : 'w-1.5 bg-neutral-400 hover:bg-neutral-500'
                  }`}
                  aria-label={`Go to card ${slotIdx + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="p-0.5 hover:text-neutral-950 transition-colors cursor-pointer"
              aria-label="Next card"
            >
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
          </div>

          {/* Action Buttons Below Pagination: Share (Blue gradient pill) & Explore (White dark-outlined pill with black globe) */}
          <div className="w-full px-5 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onShareCard(currentCard);
              }}
              className="flex-1 h-11 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1d7bf6] via-[#4c8df6] to-[#8ea4f8] hover:brightness-105 text-white font-bold text-[13.5px] shadow-xs transition-all cursor-pointer"
            >
              <span>Share</span>
              <Share className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playReveal();
                onExploreWorld();
              }}
              className="flex-1 h-11 flex items-center justify-center gap-2 rounded-full bg-white hover:bg-neutral-50 text-neutral-900 font-bold text-[13.5px] border-[1.25px] border-neutral-800 transition-all cursor-pointer"
            >
              <span>Explore</span>
              <ExploreGlobeIcon className="w-4 h-4 shrink-0" />
            </button>
          </div>

          {/* Bottom iOS Home Indicator Bar */}
          <div className="w-32 h-1 rounded-full bg-neutral-900 mt-3.5" />
        </div>
      )}
    </div>
  );
};
