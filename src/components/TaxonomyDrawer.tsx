import React, { useState } from 'react';
import { CURIOSITY_BUBBLE_DESIGN_BOOK } from './WhimsicalIsometricIllustrations.tsx';
import { BubbleText3D } from './BubbleText3D.tsx';
import { X, Compass, Copy, Check, Sparkles, Box } from 'lucide-react';

interface TaxonomyDrawerProps {
  onClose: () => void;
}

export const TaxonomyDrawer: React.FC<TaxonomyDrawerProps> = ({ onClose }) => {
  const specs = Object.values(CURIOSITY_BUBBLE_DESIGN_BOOK);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPrompt = (id: string, prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="taxonomy-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative w-full max-w-4xl max-h-[88vh] bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-blue-400" />
            <div>
              <h3 id="taxonomy-title" className="text-base font-bold text-white">
                6 Search Personalities — 3D Isometric Design System & Prompt Book
              </h3>
              <p className="text-xs text-neutral-400">
                Miniature 30° orthographic claymation dioramas & custom 3D bubble typography for all 6 search personalities.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Core Design System Rules Banner */}
          <div className="p-4 rounded-2xl bg-neutral-950/90 border border-neutral-800 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800/80">
              <div className="font-bold text-blue-400 mb-1 flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5" />
                <span>Perspective</span>
              </div>
              <p className="text-neutral-300 leading-relaxed">
                Isometric projection (30° angle), orthographic camera view.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800/80">
              <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Material & Lighting</span>
              </div>
              <p className="text-neutral-300 leading-relaxed">
                Soft clay textures, semi-glossy plastic, polished glass, warm diffuse lighting.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800/80">
              <div className="font-bold text-amber-400 mb-1">Color Scheme</div>
              <p className="text-neutral-300 leading-relaxed">
                High-saturation pastel block colors (Google Blue, Red, Yellow, Green + vibrant accents).
              </p>
            </div>
            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800/80">
              <div className="font-bold text-pink-400 mb-1">Scale Contrast</div>
              <p className="text-neutral-300 leading-relaxed">
                Giant stylized center object visited by tiny 3D humanoid character figures.
              </p>
            </div>
          </div>

          {/* 10 Curiosity Bubble Diorama & Prompt Book Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specs.map((spec) => (
              <div
                key={spec.id}
                className="rounded-2xl bg-neutral-950/80 border border-neutral-800 overflow-hidden flex flex-col hover:border-neutral-700 transition-colors"
              >
                {/* Top 3D Diorama + Live 3D Bubble Typography Preview */}
                <div
                  style={{ backgroundColor: spec.bgColor }}
                  className="relative h-52 w-full overflow-hidden flex items-center justify-center"
                >
                  <img
                    src={spec.imageSrc}
                    alt={spec.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain object-center p-2"
                  />
                  {/* Floating Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 border border-white/15">
                    <span>{spec.emoji}</span>
                    <span>
                      {spec.index}. {spec.name}
                    </span>
                  </div>
                  {/* Live 3D Bubble Typography Overlay Pill */}
                  <div className="absolute bottom-2 inset-x-3 bg-white/95 backdrop-blur-md rounded-2xl px-3 py-1 shadow-lg border border-neutral-200/80 flex items-center justify-between">
                    <BubbleText3D
                      text={spec.bubbleTitle}
                      palette={spec.palette}
                      className="w-36 h-11"
                    />
                    <span className="text-[11px] font-bold text-neutral-700 pr-1 text-right">
                      {spec.centerObjectLabel}
                    </span>
                  </div>
                </div>

                {/* Typography Spec & 3D Isometric Prompt */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-xs">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-0.5">
                      Bubble Typography Style
                    </div>
                    <p className="text-neutral-300 leading-relaxed">
                      {spec.typographyStyle}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800/90">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                        3D Isometric Prompt
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyPrompt(spec.id, spec.isometricPrompt)}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        {copiedId === spec.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Prompt</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-neutral-400 italic leading-relaxed">
                      "{spec.isometricPrompt}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
