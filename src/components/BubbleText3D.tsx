import React, { useId } from 'react';

export type BubblePalette =
  | 'pets_critters'
  | 'pop_culture'
  | 'food_snacks'
  | 'escapism_travel'
  | 'health_panic'
  | 'shopping_aesthetic'
  | 'niche_history'
  | 'productivity_hacks'
  | 'existential_overthinking'
  | 'tech_glitches'
  | 'warm'
  | 'cool'
  | 'jimothy'
  | 'purple'
  | 'gold'
  | 'blue';

interface BubbleText3DProps {
  text: string;
  palette?: BubblePalette;
  className?: string;
  singleLine?: boolean;
}

interface PaletteConfig {
  /** Top-to-bottom vertical gradient stops for the thick 3D extruded block */
  blockStops: [string, string, string];
  /** Deepest 3D bottom rim tint */
  bottomRimColor: string;
  /** Crisp thin dark contour stroke around the white letter face and outer sticker edge */
  contourColor: string;
  /** Whether this palette uses the cool (purple-cyan-lime) vs warm (yellow-orange-coral) glow family */
  isCool?: boolean;
}

const PALETTE_STOPS: Record<BubblePalette, PaletteConfig> = {
  // 1. Pets & Critters ("Kitty Lore"): Warm yellow -> tangerine orange -> coral-pink with rich dark brown contour
  pets_critters: {
    blockStops: ['#FDE047', '#FB923C', '#F472B6'],
    bottomRimColor: '#EA580C',
    contourColor: '#6E2E1A',
    isCool: false,
  },
  // 2. Pop Culture & Memes ("Cinema Deep Dives"): Sunny yellow -> orange -> vibrant pink
  pop_culture: {
    blockStops: ['#FDE047', '#FB923C', '#EC4899'],
    bottomRimColor: '#DB2777',
    contourColor: '#6E2E1A',
    isCool: false,
  },
  // 3. Food & Midnight Snacks ("Midnight Sous Chef"): Golden yellow -> warm orange -> coral
  food_snacks: {
    blockStops: ['#FEF08A', '#F59E0B', '#F97316'],
    bottomRimColor: '#D97706',
    contourColor: '#6E2E1A',
    isCool: false,
  },
  // 4. Escapism & Travel ("Trail Whisperer"): Warm yellow -> bright orange -> coral rose (matching Screen 2 reference)
  escapism_travel: {
    blockStops: ['#FDE047', '#FB923C', '#F472B6'],
    bottomRimColor: '#E11D48',
    contourColor: '#6E2E1A',
    isCool: false,
  },
  // 5. Health & Bodily Panic ("Sleepy Remedies"): Soft lavender purple -> cyan -> lime green
  health_panic: {
    blockStops: ['#C084FC', '#22D3EE', '#84CC16'],
    bottomRimColor: '#65A30D',
    contourColor: '#2B3B4E',
    isCool: true,
  },
  // 6. Shopping & Aesthetic Finds ("Desk Curator"): Warm gold -> peach orange -> rose pink
  shopping_aesthetic: {
    blockStops: ['#FDE047', '#FB923C', '#F472B6'],
    bottomRimColor: '#E11D48',
    contourColor: '#6E2E1A',
    isCool: false,
  },
  // 7. Niche History & Rabbit Holes ("Ancient Lore"): Purple -> cyan -> lime green
  niche_history: {
    blockStops: ['#C084FC', '#22D3EE', '#84CC16'],
    bottomRimColor: '#65A30D',
    contourColor: '#2B3B4E',
    isCool: true,
  },
  // 8. Productivity & Life Hacks ("Physics Simulations"): Lavender purple -> cyan -> lime green (matching Screen 3 reference)
  productivity_hacks: {
    blockStops: ['#C084FC', '#22D3EE', '#84CC16'],
    bottomRimColor: '#65A30D',
    contourColor: '#2B3B4E',
    isCool: true,
  },
  // 9. Existential Overthinking ("Midnight Philosopher"): Lavender -> sky blue -> lime emerald
  existential_overthinking: {
    blockStops: ['#C084FC', '#38BDF8', '#4ADE80'],
    bottomRimColor: '#16A34A',
    contourColor: '#2B3B4E',
    isCool: true,
  },
  // 10. Tech Glitches & Digital Hygiene ("Tab Wrangler"): Purple -> cyan -> lime
  tech_glitches: {
    blockStops: ['#C084FC', '#22D3EE', '#84CC16'],
    bottomRimColor: '#65A30D',
    contourColor: '#2B3B4E',
    isCool: true,
  },
  warm: {
    blockStops: ['#FDE047', '#FB923C', '#F472B6'],
    bottomRimColor: '#EA580C',
    contourColor: '#6E2E1A',
    isCool: false,
  },
  cool: {
    blockStops: ['#C084FC', '#22D3EE', '#84CC16'],
    bottomRimColor: '#65A30D',
    contourColor: '#2B3B4E',
    isCool: true,
  },
  jimothy: {
    blockStops: ['#C084FC', '#22D3EE', '#84CC16'],
    bottomRimColor: '#65A30D',
    contourColor: '#2B3B4E',
    isCool: true,
  },
  purple: {
    blockStops: ['#C084FC', '#22D3EE', '#84CC16'],
    bottomRimColor: '#65A30D',
    contourColor: '#2B3B4E',
    isCool: true,
  },
  gold: {
    blockStops: ['#FDE047', '#FB923C', '#F472B6'],
    bottomRimColor: '#EA580C',
    contourColor: '#6E2E1A',
    isCool: false,
  },
  blue: {
    blockStops: ['#C084FC', '#22D3EE', '#84CC16'],
    bottomRimColor: '#65A30D',
    contourColor: '#2B3B4E',
    isCool: true,
  },
};

export function isCoolBubblePalette(palette?: BubblePalette): boolean {
  if (!palette) return false;
  return Boolean(PALETTE_STOPS[palette]?.isCool);
}

export const BubbleText3D: React.FC<BubbleText3DProps> = ({
  text,
  palette = 'warm',
  className = 'w-full h-20',
  singleLine = false,
}) => {
  const uid = useId().replace(/:/g, '');
  const blockGradId = `bubble-block-${uid}`;
  const shadowFilterId = `bubble-shadow-${uid}`;
  const colors = PALETTE_STOPS[palette] || PALETTE_STOPS.warm;

  const normalizedText = singleLine ? text.replace(/\n+/g, ' ') : text;
  const lines = normalizedText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const isTwoLines = lines.length > 1;
  const maxLineChars = Math.max(...lines.map((l) => l.length), 5);

  const fontSize = isTwoLines
    ? maxLineChars > 11
      ? 52
      : 56
    : maxLineChars > 11
    ? 56
    : maxLineChars > 8
    ? 64
    : 68;

  const viewWidth = Math.max(
    330,
    maxLineChars * (fontSize * 0.56) + (isTwoLines ? 44 : 52)
  );
  const viewHeight = isTwoLines ? 142 : 104;

  const linePositions = isTwoLines
    ? [
        { text: lines[0], y: 40 },
        { text: lines[1], y: 88 },
      ]
    : [{ text: lines[0] || text, y: 44 }];

  const fontStack =
    '"Outfit", "Plus Jakarta Sans", "Arial Rounded MT Bold", "Nunito", system-ui, -apple-system, sans-serif';
  const letterSpacing = '-2.4px';

  // Extrusion offsets to form a solid 3D sticker block
  const extrusionOffsets = [0, 2, 4, 6];

  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        className="w-full h-full overflow-visible"
        role="heading"
        aria-label={text.replace(/\n+/g, ' ')}
      >
        <defs>
          {/* UserSpaceOnUse vertical gradient so 2-line stacked titles share one seamless top-to-bottom gradient */}
          <linearGradient
            id={blockGradId}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="8"
            x2="0"
            y2={String(viewHeight - 6)}
          >
            <stop offset="0%" stopColor={colors.blockStops[0]} />
            <stop offset="52%" stopColor={colors.blockStops[1]} />
            <stop offset="100%" stopColor={colors.blockStops[2]} />
          </linearGradient>

          <filter id={shadowFilterId} x="-15%" y="-15%" width="130%" height="140%">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="2"
              floodColor="#0F172A"
              floodOpacity="0.10"
            />
          </filter>
        </defs>

        <g filter={`url(#${shadowFilterId})`}>
          {/* PASS 1: Unified Outer Dark Sticker Contour across all lines & extrusion steps */}
          {linePositions.map((line, lIdx) =>
            extrusionOffsets.map((dy) => (
              <text
                key={`outer-contour-${lIdx}-${dy}`}
                x="50%"
                y={line.y + dy}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily={fontStack}
                fontSize={fontSize}
                fontWeight="900"
                letterSpacing={letterSpacing}
                fill={colors.contourColor}
                stroke={colors.contourColor}
                strokeWidth="19.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              >
                {line.text}
              </text>
            ))
          )}

          {/* PASS 2: Unified Vibrant Vertical Gradient 3D Sticker Block across all lines & extrusion steps */}
          {linePositions.map((line, lIdx) =>
            extrusionOffsets.map((dy) => (
              <text
                key={`grad-block-${lIdx}-${dy}`}
                x="50%"
                y={line.y + dy}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily={fontStack}
                fontSize={fontSize}
                fontWeight="900"
                letterSpacing={letterSpacing}
                fill={`url(#${blockGradId})`}
                stroke={`url(#${blockGradId})`}
                strokeWidth="16.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              >
                {line.text}
              </text>
            ))
          )}

          {/* PASS 3: Crisp Inner Letter Contour + Pure White Letter Face (#FFFFFF) */}
          {linePositions.map((line, lIdx) => (
            <g key={`face-group-${lIdx}`}>
              <text
                x="50%"
                y={line.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily={fontStack}
                fontSize={fontSize}
                fontWeight="900"
                letterSpacing={letterSpacing}
                fill={colors.contourColor}
                stroke={colors.contourColor}
                strokeWidth="3.2"
                strokeLinejoin="round"
                strokeLinecap="round"
              >
                {line.text}
              </text>
              <text
                x="50%"
                y={line.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily={fontStack}
                fontSize={fontSize}
                fontWeight="900"
                letterSpacing={letterSpacing}
                fill="#FFFFFF"
              >
                {line.text}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};
