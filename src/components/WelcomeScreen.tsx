import React from 'react';
import { ArrowRight, Search, Globe, User } from 'lucide-react';
import { CURIOSITY_BUBBLE_DESIGN_BOOK } from './WhimsicalIsometricIllustrations.tsx';
import { BubbleText3D } from './BubbleText3D.tsx';
import { sound } from '../utils/sound.ts';

interface WelcomeScreenProps {
  userName: string;
  onUserNameChange: (name: string) => void;
  onStartQuiz: () => void;
  onPreviewWorld: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  userName,
  onUserNameChange,
  onStartQuiz,
  onPreviewWorld,
}) => {
  const dioramaSpecs = Object.values(CURIOSITY_BUBBLE_DESIGN_BOOK);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-10 flex flex-col items-center text-center">
      {/* Clean unboxed metadata kicker */}
      <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-400 mb-4">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
        <span>2026 Annual Search Audit</span>
        <span aria-hidden="true">·</span>
        <span>10 Questions</span>
        <span aria-hidden="true">·</span>
        <span>6 Search Personalities</span>
      </div>

      {/* Main Hero Title */}
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.1] mb-5">
        Explore <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">Your World in Search</span>
      </h1>

      <p className="text-base sm:text-xl text-neutral-300 max-w-2xl leading-relaxed mb-6">
        Answer 10 unfiltered search scenarios to unlock your personalized isometric <span className="text-white font-semibold">World of Search</span>, swipeable <span className="text-white font-semibold">3D Claymation Diorama Cards</span>, and 2026 <span className="text-white font-semibold">Search Personalities</span>.
      </p>

      {/* Name Input */}
      <div className="w-full max-w-sm mb-6 flex flex-col items-center">
        <label htmlFor="user-name-input" className="text-xs font-semibold text-neutral-400 mb-2 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-blue-400" />
          <span>Your Explorer Name</span>
        </label>
        <div className="w-full relative">
          <input
            id="user-name-input"
            type="text"
            value={userName}
            onChange={(e) => onUserNameChange(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-center font-medium"
          />
        </div>
      </div>

      {/* Google Search Bar interactive mock */}
      <div className="w-full max-w-xl mb-7 p-1.5 rounded-2xl bg-neutral-900/90 border border-neutral-700/80 shadow-2xl flex items-center gap-3 px-4 py-3 text-left">
        <Search className="w-5 h-5 text-blue-400 shrink-0" />
        <span className="text-neutral-300 text-sm sm:text-base font-normal font-mono truncate">
          Labubu restock...
        </span>
        <span className="w-2 h-5 bg-blue-400/80 animate-pulse ml-auto"></span>
      </div>

      {/* Call to action buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10">
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onStartQuiz();
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-600 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold text-base shadow-xl shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          aria-label="Start Your Search Wrapped Quiz"
        >
          <span>Start Your Search Wrapped</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playReveal();
            onPreviewWorld();
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white font-semibold text-sm border border-neutral-700 transition-all cursor-pointer"
          aria-label="Explore Interactive World Now"
        >
          <Globe className="w-4 h-4 text-blue-400" />
          <span>Explore Sample World</span>
        </button>
      </div>

      {/* Interactive Insights World Reference Map Preview Banner */}
      <div className="w-full mb-10">
        <button
          type="button"
          onClick={() => {
            sound.playReveal();
            onPreviewWorld();
          }}
          className="group relative w-full rounded-3xl overflow-hidden border-2 border-neutral-800 hover:border-blue-500/70 shadow-2xl transition-all cursor-pointer block text-left"
        >
          <img
            src="/assets/aistudio/image_1794304504667793_3a902cc7.png"
            alt="Interactive 3D Isometric Insights World Map"
            className="w-full aspect-[1369/768] object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent flex items-end justify-between p-4 sm:p-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-600/90 text-white text-[11px] font-bold uppercase tracking-wider mb-1.5">
                <Globe className="w-3 h-3" />
                <span>Interactive Insights World</span>
              </span>
              <h2 className="text-lg sm:text-2xl font-extrabold text-white">
                Explore All 6 Isometric Curiosity Bubble Islands
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300">
                Click any island in the rainbow-road search city to inspect its 3D diorama &amp; your search diagnosis.
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-neutral-950 font-bold text-xs shadow-lg group-hover:bg-blue-50 transition-colors shrink-0">
              <span>Enter Insights World</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </button>
      </div>

      {/* 6 Curiosity Bubbles 3D Isometric Toy-World Dioramas Preview Grid */}
      <div className="w-full pt-8 border-t border-neutral-800/80">
        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-5">
          The 6 Search Personalities — 3D Isometric Dioramas
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {dioramaSpecs.map((spec) => (
            <button
              key={spec.id}
              type="button"
              onClick={() => {
                sound.playReveal();
                onPreviewWorld();
              }}
              className="rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-blue-500/50 overflow-hidden flex flex-col items-center transition-all text-center group cursor-pointer"
            >
              <div
                style={{ backgroundColor: spec.bgColor }}
                className="w-full h-28 overflow-hidden relative"
              >
                <img
                  src={spec.imageSrc}
                  alt={spec.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain p-1.5 group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-neutral-950/75 text-sm flex items-center justify-center">
                  {spec.emoji}
                </span>
              </div>
              <div className="p-2 w-full flex flex-col items-center bg-white">
                <BubbleText3D
                  text={spec.bubbleTitle}
                  palette={spec.palette}
                  className="w-full h-7"
                />
                <span className="text-[10px] font-bold text-neutral-700 truncate max-w-full mt-0.5">
                  {spec.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
