import React from 'react';
import { Volume2, VolumeX, RotateCcw, Compass, Globe } from 'lucide-react';
import { sound } from '../utils/sound.ts';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenTaxonomy: () => void;
  onRestart?: () => void;
  currentStep?: 'intro' | 'quiz' | 'results';
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenTaxonomy,
  onRestart,
  currentStep = 'intro',
}) => {
  return (
    <header className="w-full border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Branding */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold text-lg ring-1 ring-white/20">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent">
                Google Search Wrapped
              </span>
              <span className="text-[11px] font-semibold text-neutral-400">
                · 2026
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block">
              Your World in Search
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenTaxonomy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-medium border border-neutral-800 transition-all cursor-pointer"
            title="Explore the 6 Search Personalities"
            aria-label="Explore the 6 Search Personalities"
          >
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">6 Search Ports</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onToggleSound();
            }}
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-all cursor-pointer"
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-500" />
            )}
          </button>

          {currentStep !== 'intro' && onRestart && (
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onRestart();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-red-950/40 hover:text-red-300 text-neutral-400 hover:border-red-800/40 text-xs font-medium border border-neutral-800 transition-all cursor-pointer"
              title="Retake quiz"
              aria-label="Restart quiz"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restart</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
