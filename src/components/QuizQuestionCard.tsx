import React, { useEffect, useState } from 'react';
import { Search, ChevronLeft, Sparkles, CornerDownLeft } from 'lucide-react';
import type { Question, QuestionOption, CategoryId } from '../quiz/types.ts';
import { HOST_QUIPS } from '../quiz/data.ts';
import { sound } from '../utils/sound.ts';

interface QuizQuestionCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedOptionKey?: 'A' | 'B' | 'C' | 'D';
  onSelectOption: (key: 'A' | 'B' | 'C' | 'D') => void;
  onPrevious?: () => void;
  canGoBack: boolean;
}

export const QuizQuestionCard: React.FC<QuizQuestionCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  selectedOptionKey,
  onSelectOption,
  onPrevious,
  canGoBack,
}) => {
  const [activeQuip, setActiveQuip] = useState<string | null>(null);

  // Keyboard shortcut listener for A, B, C, D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      const key = e.key.toUpperCase();
      if (key === 'A' || key === 'B' || key === 'C' || key === 'D') {
        e.preventDefault();
        sound.playSelect();
        onSelectOption(key as 'A' | 'B' | 'C' | 'D');
      } else if (key === '1') {
        e.preventDefault();
        sound.playSelect();
        onSelectOption('A');
      } else if (key === '2') {
        e.preventDefault();
        sound.playSelect();
        onSelectOption('B');
      } else if (key === '3') {
        e.preventDefault();
        sound.playSelect();
        onSelectOption('C');
      } else if (key === '4') {
        e.preventDefault();
        sound.playSelect();
        onSelectOption('D');
      } else if ((key === 'ARROWLEFT' || key === 'BACKSPACE') && canGoBack && onPrevious) {
        e.preventDefault();
        onPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectOption, canGoBack, onPrevious]);

  // When question changes, clear the active quip
  useEffect(() => {
    setActiveQuip(null);
  }, [question.id]);

  const handleOptionClick = (option: QuestionOption) => {
    sound.playSelect();
    const quipList = HOST_QUIPS[option.category];
    if (quipList && quipList.length > 0) {
      const randomQuip = quipList[Math.floor(Math.random() * quipList.length)];
      setActiveQuip(randomQuip);
    }
    onSelectOption(option.key);
  };

  const progressPercentage = ((questionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:py-10">
      {/* Progress & Navigation Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
          <div className="flex items-center gap-2">
            {canGoBack && onPrevious && (
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  onPrevious();
                }}
                className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors cursor-pointer py-1 pr-2"
                aria-label="Go to previous question"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
            <span className="font-semibold text-neutral-200">
              Question {questionIndex + 1} of {totalQuestions}
            </span>
          </div>
          <span className="font-mono text-neutral-400 font-medium">
            {Math.round(progressPercentage)}% completed
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Main Question Card styled like an Omnibox / Search Session */}
      <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
        {/* Scenario Header */}
        <div className="flex items-start gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <Search className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-blue-400 mb-1 block">
              Scenario #{questionIndex + 1}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {question.prompt}
            </h2>
          </div>
        </div>

        {/* Options list: CRITICAL rule: ONLY DISPLAY QUERY TEXT, DO NOT SHOW CATEGORY TAGS */}
        <div className="space-y-3 mb-6" role="radiogroup" aria-label={`Options for Question ${questionIndex + 1}`}>
          {question.options.map((option) => {
            const isSelected = selectedOptionKey === option.key;

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => handleOptionClick(option)}
                className={`w-full group text-left p-4 rounded-xl border transition-all flex items-center gap-3.5 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-400/40'
                    : 'bg-neutral-950/60 hover:bg-neutral-800/80 border-neutral-800 hover:border-neutral-700 text-neutral-200'
                }`}
                aria-checked={isSelected}
                role="radio"
              >
                {/* Key Badge [A], [B], [C], [D] */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'bg-neutral-800 group-hover:bg-neutral-700 text-neutral-300'
                  }`}
                >
                  [{option.key}]
                </div>

                {/* Query Text ONLY (No category label visible!) */}
                <div className="flex-1 font-normal text-sm sm:text-base leading-normal flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300 shrink-0" />
                  <span className={isSelected ? 'text-white font-medium' : 'text-neutral-200'}>
                    {option.query}
                  </span>
                </div>

                {/* Subtle indicator */}
                <div className="shrink-0 text-neutral-500 group-hover:text-neutral-300 opacity-60 group-hover:opacity-100 transition-opacity">
                  <CornerDownLeft className="w-3.5 h-3.5 hidden sm:block" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Keyboard shortcut hints & Host commentary */}
        <div className="pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-500">
          <div className="flex items-center gap-1.5">
            <span>Tip: Press keys</span>
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono text-[11px] border border-neutral-700">A</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono text-[11px] border border-neutral-700">B</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono text-[11px] border border-neutral-700">C</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono text-[11px] border border-neutral-700">D</kbd>
            <span>to answer instantly</span>
          </div>

          {activeQuip && (
            <div className="flex items-center gap-1.5 text-blue-300/90 italic animate-fadeIn">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>"{activeQuip}"</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
