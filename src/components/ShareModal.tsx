import React, { useState } from 'react';
import type { WrappedResults, UserAnswers, InsightCardData } from '../quiz/types.ts';
import { QUIZ_QUESTIONS } from '../quiz/data.ts';
import {
  WhimsicalIllustration,
  getCategoryBubbleMeta,
} from './WhimsicalIsometricIllustrations.tsx';
import { BubbleText3D } from './BubbleText3D.tsx';
import { GoogleLogo } from './GoogleLogo.tsx';
import { Copy, Check, X, Heart, Send } from 'lucide-react';
import { sound } from '../utils/sound.ts';

interface ShareModalProps {
  results: WrappedResults;
  userAnswers: UserAnswers;
  initialCard?: InsightCardData;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  results,
  userAnswers,
  initialCard,
  onClose,
}) => {
  const [copiedMd, setCopiedMd] = useState(false);
  const [activeTab, setActiveTab] = useState<'story' | 'markdown' | 'review'>('story');
  const [selectedCardIdx, setSelectedCardIdx] = useState<number>(
    initialCard ? initialCard.cardNumber - 1 : 0
  );

  const activeCard = results.topCards[selectedCardIdx];
  const bubbleMeta = getCategoryBubbleMeta(activeCard.category.id);

  const handleCopyMarkdown = async () => {
    sound.playPop();
    try {
      await navigator.clipboard.writeText(results.markdownOutput);
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2400);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-lg max-h-[95vh] bg-neutral-900 border border-neutral-800 rounded-[36px] shadow-2xl flex flex-col overflow-hidden">
        {/* Header Tabs */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex gap-2">
            <button
              id="share-modal-title"
              type="button"
              onClick={() => setActiveTab('story')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'story'
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Story Card
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('markdown')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'markdown'
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Strict Markdown
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('review')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'review'
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              10 Questions
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 flex flex-col items-center">
          {activeTab === 'story' && (
            <div className="w-full flex flex-col items-center space-y-4">
              {/* Card Selector Pills */}
              <div className="flex gap-1.5">
                {results.topCards.map((card, idx) => {
                  const meta = getCategoryBubbleMeta(card.category.id);
                  return (
                    <button
                      key={card.category.id}
                      type="button"
                      onClick={() => setSelectedCardIdx(idx)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                        selectedCardIdx === idx
                          ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {card.category.emoji} {meta.bubbleTitle.replace(/\n+/g, ' ')}
                    </button>
                  );
                })}
              </div>

              {/* Exact Screen 3 Replica: Instagram/TikTok Story Frame */}
              <div
                id="story-card"
                className="w-full max-w-[340px] h-[580px] rounded-[36px] bg-black border-4 border-neutral-800 shadow-2xl flex flex-col justify-between overflow-hidden relative select-none"
              >
                {/* Story Progress Bars at Top */}
                <div className="absolute top-2.5 left-4 right-4 z-30 grid grid-cols-3 gap-1.5">
                  {[0, 1, 2].map((idx) => (
                    <div
                      key={idx}
                      className={`h-1 rounded-full ${
                        idx === selectedCardIdx
                          ? 'bg-white'
                          : idx < selectedCardIdx
                          ? 'bg-white/80'
                          : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>

                {/* Story User Header */}
                <div className="absolute top-5 left-4 right-4 z-30 flex items-center justify-between text-white drop-shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-600 p-0.5">
                      <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center text-[10px] font-bold">
                        {results.userName.slice(0, 2).toUpperCase()}
                      </div>
                    </div>
                    <span className="text-xs font-bold">{results.userName.toLowerCase()}</span>
                    <span className="text-[10px] opacity-75 font-normal">12h</span>
                  </div>
                  <X className="w-4 h-4 cursor-pointer" onClick={onClose} />
                </div>

                {/* Whimsical 3D Illustration */}
                <div className="relative w-full flex-1 overflow-hidden">
                  <WhimsicalIllustration
                    categoryId={activeCard.category.id}
                    className="w-full h-full"
                  />
                </div>

                {/* Bottom Card (Screen 3 style) — Hover shows which Curiosity Bubble it is */}
                <div className="p-3 pt-0 -mt-8 relative z-20 w-full bg-gradient-to-b from-transparent via-black/90 to-black">
                  <div className="group relative w-full bg-white text-neutral-900 rounded-[26px] px-4 pt-3.5 pb-4 shadow-xl border-2 border-transparent hover:border-blue-600 transition-all flex flex-col items-center text-center">
                    <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity px-2.5 py-0.5 rounded-full bg-slate-950 text-amber-300 border border-amber-400 text-[10px] font-extrabold whitespace-nowrap shadow-lg">
                      {activeCard.category.emoji} {activeCard.category.name}
                    </div>
                    <span className="text-[11px] font-semibold text-neutral-900 mb-0.5">
                      <span className="group-hover:hidden">You&apos;ve been searching</span>
                      <span className="hidden group-hover:inline text-blue-600 font-bold">
                        {activeCard.category.emoji} {activeCard.category.name}
                      </span>
                    </span>

                    <BubbleText3D
                      text={bubbleMeta.bubbleTitle}
                      palette={bubbleMeta.palette}
                      className={
                        bubbleMeta.bubbleTitle.includes('\n')
                          ? 'w-full h-[76px] mt-1 mb-2'
                          : 'w-full h-[60px] mt-1 mb-2'
                      }
                    />

                    <p className="text-[11px] text-neutral-700 leading-snug mt-0.5 mb-1 max-w-[235px]">
                      {activeCard.diagnosis}
                    </p>

                    <div className="absolute bottom-3 right-3.5">
                      <GoogleLogo className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Send Message story input (exact match to Screen 3 bottom bar) */}
                  <div className="w-full mt-2.5 flex items-center justify-between px-1 text-white">
                    <div className="flex-1 py-2 px-3.5 rounded-full bg-black border border-white/35 text-[11px] text-white/80">
                      Send Message
                    </div>
                    <div className="flex items-center gap-3 pl-3">
                      <Heart className="w-4 h-4 text-white" />
                      <Send className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                {copiedMd ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedMd ? 'Copied Results Markdown!' : 'Copy Formatted Results'}</span>
              </button>
            </div>
          )}

          {activeTab === 'markdown' && (
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400 font-medium">
                  Strictly rendered according to the Search Wrapped specification:
                </span>
                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold cursor-pointer"
                >
                  {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedMd ? 'Copied!' : 'Copy Markdown'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap max-h-96 leading-relaxed selection:bg-blue-900">
                {results.markdownOutput}
              </pre>
            </div>
          )}

          {activeTab === 'review' && (
            <div className="w-full space-y-3">
              <p className="text-xs text-neutral-400">
                Your selections across all 10 scenarios:
              </p>
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {QUIZ_QUESTIONS.map((q) => {
                  const userKey = userAnswers[q.id];
                  const chosenOpt = q.options.find((o) => o.key === userKey);

                  return (
                    <div
                      key={q.id}
                      className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs space-y-1"
                    >
                      <div className="font-semibold text-neutral-200">
                        {q.id}. {q.prompt}
                      </div>
                      {chosenOpt && (
                        <div className="flex items-center gap-2 text-blue-300 font-mono">
                          <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] text-white">
                            [{chosenOpt.key}]
                          </span>
                          <span>"{chosenOpt.query}"</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
