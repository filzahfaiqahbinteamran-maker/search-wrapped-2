/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header.tsx';
import { WelcomeScreen } from './components/WelcomeScreen.tsx';
import { QuizQuestionCard } from './components/QuizQuestionCard.tsx';
import { SwipeableInsightCards } from './components/SwipeableInsightCards.tsx';
import { InteractiveWorldMap } from './components/InteractiveWorldMap.tsx';
import { PhoneFrame } from './components/PhoneFrame.tsx';
import { ShareModal } from './components/ShareModal.tsx';
import { TaxonomyDrawer } from './components/TaxonomyDrawer.tsx';
import { QUIZ_QUESTIONS } from './quiz/data.ts';
import { calculateWrappedResults } from './quiz/scoring.ts';
import type { UserAnswers, WrappedResults, InsightCardData } from './quiz/types.ts';
import { sound } from './utils/sound.ts';
import { Smartphone, Monitor, Globe, Layers, Share2 } from 'lucide-react';

const SAMPLE_ANSWERS: UserAnswers = {
  1: 'A', // Trendsetter
  2: 'A', // Superfan
  3: 'B', // Trendsetter
  4: 'A', // Foodie
  5: 'B', // AI Whiz
  6: 'A', // Trendsetter
  7: 'A', // Trendsetter
  8: 'A', // AI Whiz
  9: 'C', // Superfan
  10: 'C', // Trendsetter
};

export default function App() {
  const [step, setStep] = useState<'intro' | 'quiz' | 'cards' | 'world'>('intro');
  const [userName, setUserName] = useState<string>('Sambit');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [results, setResults] = useState<WrappedResults | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [shareModalCard, setShareModalCard] = useState<InsightCardData | undefined>(undefined);
  const [showTaxonomy, setShowTaxonomy] = useState<boolean>(false);
  const [isPhoneFrameMode, setIsPhoneFrameMode] = useState<boolean>(false);

  // Check URL query parameter: ?autostart=1 starts quiz, ?view=world jumps to interactive world
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'world' || params.get('view') === 'cards') {
      const isCards = params.get('view') === 'cards';
      const isPhoneParam = params.get('mode') === 'phone';
      setUserAnswers(SAMPLE_ANSWERS);
      setResults(calculateWrappedResults(SAMPLE_ANSWERS, userName));
      setStep(isCards ? 'cards' : 'world');
      setIsPhoneFrameMode(isCards || isPhoneParam);
    } else if (params.get('autostart') === '1') {
      setStep('quiz');
    }
  }, []);

  const handleStartQuiz = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setResults(null);
    setStep('quiz');
  };

  const handlePreviewWorld = () => {
    setUserAnswers(SAMPLE_ANSWERS);
    const sampleResults = calculateWrappedResults(SAMPLE_ANSWERS, userName);
    setResults(sampleResults);
    setIsPhoneFrameMode(false);
    setStep('world');
  };

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];
    const updatedAnswers: UserAnswers = {
      ...userAnswers,
      [currentQ.id]: key,
    };
    setUserAnswers(updatedAnswers);

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Question 15 answered! Calculate top 3 Insight Cards and go straight to the Interactive World (no bubble page!)
      const finalResults = calculateWrappedResults(updatedAnswers, userName);
      setResults(finalResults);
      setIsPhoneFrameMode(false);
      setStep('world');
      sound.playReveal();

      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#ec4899', '#f59e0b', '#8b5cf6'],
        });
      } catch {
        // Optional confetti
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setResults(null);
    setStep('intro');
  };

  const handleOpenShare = (card?: InsightCardData) => {
    sound.playPop();
    setShareModalCard(card);
    setShowShareModal(true);
  };

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const currentAnswerKey = currentQuestion ? userAnswers[currentQuestion.id] : undefined;

  const isPostQuiz = step === 'cards' || step === 'world';

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-blue-500/30 selection:text-blue-200">
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const next = !soundEnabled;
          sound.enabled = next;
          setSoundEnabled(next);
        }}
        onOpenTaxonomy={() => setShowTaxonomy(true)}
        onRestart={step !== 'intro' ? handleRestart : undefined}
        currentStep={step === 'intro' ? 'intro' : step === 'quiz' ? 'quiz' : 'results'}
      />

      {/* Top Mode Switcher Bar (shown on post-quiz interactive world & cards views) */}
      {isPostQuiz && (
        <div className="w-full max-w-6xl mx-auto pt-3 px-4 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400">
          {/* Screen Switcher: Explore World vs Insights Cards */}
          <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setStep('world');
                setIsPhoneFrameMode(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                step === 'world'
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Explore World</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setStep('cards');
                setIsPhoneFrameMode(true);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                step === 'cards'
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Insights Cards</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setIsPhoneFrameMode(true)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  isPhoneFrameMode
                    ? 'bg-neutral-800 text-white font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Phone Frame View"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Phone</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPhoneFrameMode(false)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  !isPhoneFrameMode
                    ? 'bg-neutral-800 text-white font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Expanded Wide View"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Expanded</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleOpenShare()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Story</span>
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col justify-center items-center py-3 px-2">
        {step === 'intro' && (
          <WelcomeScreen
            userName={userName}
            onUserNameChange={setUserName}
            onStartQuiz={handleStartQuiz}
            onPreviewWorld={handlePreviewWorld}
          />
        )}

        {step === 'quiz' && currentQuestion && (
          <QuizQuestionCard
            question={currentQuestion}
            questionIndex={currentQuestionIndex}
            totalQuestions={QUIZ_QUESTIONS.length}
            selectedOptionKey={currentAnswerKey}
            onSelectOption={handleSelectOption}
            onPrevious={handlePreviousQuestion}
            canGoBack={currentQuestionIndex > 0}
          />
        )}

        {isPostQuiz && results && (
          <PhoneFrame isExpanded={!isPhoneFrameMode}>
            {step === 'cards' && (
              <SwipeableInsightCards
                results={results}
                onShareCard={(card) => handleOpenShare(card)}
                onExploreWorld={() => {
                  setStep('world');
                }}
              />
            )}

            {step === 'world' && (
              <InteractiveWorldMap
                results={results}
                isPhoneMode={isPhoneFrameMode}
                onBackToCards={() => {
                  setIsPhoneFrameMode(true);
                  setStep('cards');
                }}
                onOpenShareModal={(card) => handleOpenShare(card)}
              />
            )}
          </PhoneFrame>
        )}
      </main>

      {/* Share Modal with Story, Strict Markdown, and 15-question review */}
      {showShareModal && results && (
        <ShareModal
          results={results}
          userAnswers={userAnswers}
          initialCard={shareModalCard}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Taxonomy Drawer */}
      {showTaxonomy && (
        <TaxonomyDrawer onClose={() => setShowTaxonomy(false)} />
      )}
    </div>
  );
}
