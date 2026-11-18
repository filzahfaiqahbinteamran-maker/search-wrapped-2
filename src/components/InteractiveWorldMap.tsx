import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import type { WrappedResults, InsightCardData, CategoryId } from '../quiz/types.ts';
import { CATEGORIES } from '../quiz/data.ts';
import { BubbleText3D, isCoolBubblePalette, type BubblePalette } from './BubbleText3D.tsx';
import { CURIOSITY_BUBBLE_DESIGN_BOOK } from './WhimsicalIsometricIllustrations.tsx';
import { GoogleLogo, ExploreGlobeIcon } from './GoogleLogo.tsx';
import { sound } from '../utils/sound.ts';
import {
  ORDERED_TOUR_STOP_IDS,
  DEFAULT_WORLD_ZOOM,
  MIN_WORLD_ZOOM,
  MAX_WORLD_ZOOM,
  clampFocusCoord,
  computeCameraTranslationPercent,
  interpolateTourPosition,
  formatBubbleHoverIdentity,
} from '../quiz/worldNavigation.ts';
import {
  Share,
  Share2,
  Layers,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Search,
  Trophy,
  Play,
  Pause,
  Navigation,
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

interface InteractiveWorldMapProps {
  results: WrappedResults;
  onBackToCards: () => void;
  onOpenShareModal: (card?: InsightCardData) => void;
  isPhoneMode?: boolean;
}

export interface WorldHotspot {
  id: string;
  categoryId?: CategoryId;
  bubbleIndex?: number;
  emoji: string;
  centerObjectLabel: string;
  bgColor: string;
  /** Normalized percentage coordinates (0-100) on the 1334x784 reference world image */
  islandX: number;
  islandY: number;
  /** Radius in % of width/height for the clickable diorama platform hitbox */
  hitRadiusX: number;
  hitRadiusY: number;
  /** Badge pin position in % (placed cleanly at the front rim of each island) */
  badgeX: number;
  badgeY: number;
  type: 'curiosity_island' | 'easter_egg';
  label: string;
  fullTitle: string;
  kicker: string;
  subtitle: string;
  bubbleTitle: string;
  palette: BubblePalette;
  description: string;
  shortText: string;
  islandSummary: string;
  dioramaImage?: string;
  anthemQuery: string;
  userRank?: 1 | 2 | 3;
  cardData?: InsightCardData;
}

const WORLD_IMAGE_SRC = '/assets/aistudio/image_1794304504667793_3a902cc7.png';

export const InteractiveWorldMap: React.FC<InteractiveWorldMapProps> = ({
  results,
  onBackToCards,
  onOpenShareModal,
  isPhoneMode = false,
}) => {
  // Helper to check if user has a matching category in their top 3 cards
  const getUserCardAndRank = useCallback(
    (catId: CategoryId): { card?: InsightCardData; rank?: 1 | 2 | 3 } => {
      const idx = results.topCards.findIndex((c) => c.category.id === catId);
      if (idx === -1) return {};
      return {
        card: results.topCards[idx],
        rank: (idx + 1) as 1 | 2 | 3,
      };
    },
    [results.topCards]
  );

  // All 10 Curiosity Bubble Islands mapped to exact coordinates on /assets/aistudio/img_7_ea56e1e8.png (1334x784)
  const hotspots: WorldHotspot[] = useMemo(() => {
    const buildHotspot = (
      id: string,
      categoryId: CategoryId,
      islandX: number,
      islandY: number,
      hitRadiusX: number,
      hitRadiusY: number,
      badgeX: number,
      badgeY: number,
      shortLabel: string,
      defaultDiagnosis: string,
      defaultAnthem: string,
      fallbackCardIdx: number
    ): WorldHotspot => {
      const spec = CURIOSITY_BUBBLE_DESIGN_BOOK[categoryId];
      const catInfo = CATEGORIES[categoryId];
      const { card, rank } = getUserCardAndRank(categoryId);
      return {
        id,
        categoryId,
        bubbleIndex: spec.index,
        emoji: spec.emoji,
        centerObjectLabel: spec.centerObjectLabel,
        bgColor: spec.bgColor,
        islandX,
        islandY,
        hitRadiusX,
        hitRadiusY,
        badgeX,
        badgeY,
        type: 'curiosity_island',
        label: shortLabel,
        fullTitle: spec.name,
        kicker: spec.kicker,
        subtitle: rank
          ? `#${rank} in ${results.userName}'s Search World`
          : "You've been searching",
        bubbleTitle: spec.bubbleTitle,
        palette: spec.palette,
        dioramaImage: spec.imageSrc,
        description: card?.diagnosis || defaultDiagnosis,
        shortText: catInfo.shortDesc,
        islandSummary: defaultDiagnosis,
        anthemQuery: defaultAnthem,
        userRank: rank,
        cardData: card || results.topCards[fallbackCardIdx % results.topCards.length],
      };
    };

    return [
      // 1. Lower-Left Platform: TRENDSETTER (x: 26.0%, y: 56.5%)
      buildHotspot(
        'spot-trendsetter',
        'trendsetter',
        26.0,
        56.5,
        9.0,
        14.5,
        26.0,
        70.0,
        'Trendsetter',
        'From Labubu restocks and bag charms to hot honey on everything, you caught every viral wave first.',
        'Labubu restock',
        0
      ),
      // 2. Upper-Left Globe: JETSETTER (x: 30.0%, y: 22.5%)
      buildHotspot(
        'spot-jetsetter',
        'jetsetter',
        30.0,
        22.5,
        9.0,
        14.5,
        30.0,
        36.5,
        'Jetsetter',
        'Mapping out 2026 long weekends, JB weekend trips, Japan itineraries, and Hokkaido holidays.',
        'When is the next long weekend 2026',
        0
      ),
      // 3. Center AI Laptop Hub: AI WHIZ (x: 50.5%, y: 44.5%)
      buildHotspot(
        'spot-ai-whiz',
        'ai_whiz',
        50.5,
        44.5,
        8.5,
        13.5,
        50.5,
        57.5,
        'AI Whiz',
        'Comparing DeepSeek vs Gemini, making Nano Banana figurines, and vibe coding your own app.',
        'DeepSeek vs Gemini',
        1
      ),
      // 4. Upper-Right Stage: SUPERFAN (x: 68.5%, y: 21.0%)
      buildHotspot(
        'spot-superfan',
        'superfan',
        68.5,
        21.0,
        9.0,
        14.5,
        68.5,
        34.5,
        'Superfan',
        'Queuing all night for Lady Gaga at the National Stadium and binging Squid Game without stopping.',
        'Lady Gaga Mayhem tour tickets',
        1
      ),
      // 5. Lower-Right Noodle Bar: FOODIE (x: 88.5%, y: 72.0%)
      buildHotspot(
        'spot-foodie',
        'foodie',
        88.5,
        72.0,
        9.0,
        14.5,
        88.5,
        86.0,
        'Foodie',
        'From Yo-Chi queues and homemade Dubai chocolate to sourdough baking and Taiwan night markets.',
        'Yo-Chi, queue and all',
        2
      ),
      // 6. Bottom-Center Books & Gears: CURIOUS MIND (x: 53.0%, y: 77.5%)
      buildHotspot(
        'spot-curious-mind',
        'curious_mind',
        53.0,
        77.5,
        9.0,
        14.5,
        53.0,
        91.0,
        'Curious Mind',
        'Decoding how BTO works, SG Culture Pass perks, learning Korean, and why cats knead.',
        'How to use my SG Culture Pass',
        2
      ),
    ];
  }, [getUserCardAndRank, results.topCards, results.userName]);

  // Ordered tour stops following the connected walkways across the world
  const orderedTourStops: WorldHotspot[] = useMemo(() => {
    return ORDERED_TOUR_STOP_IDS.map((id) => hotspots.find((h) => h.id === id)).filter(
      (h): h is WorldHotspot => Boolean(h)
    );
  }, [hotspots]);

  // Start zoomed-in on the user's #1 top island (or Pets & Critters)
  const initialStopIndex = useMemo(() => {
    const topCatId = results.topCards[0]?.category.id;
    if (!topCatId) return 0;
    const foundIdx = orderedTourStops.findIndex((s) => s.categoryId === topCatId);
    return foundIdx >= 0 ? foundIdx : 0;
  }, [orderedTourStops, results.topCards]);

  const initialSpot = orderedTourStops[initialStopIndex] || hotspots[0];

  // Camera starts ZOOMED IN (2.25x) and centered on the starting island
  const [zoom, setZoom] = useState<number>(DEFAULT_WORLD_ZOOM);
  const [focusPos, setFocusPos] = useState<{ x: number; y: number }>({
    x: initialSpot.islandX,
    y: initialSpot.islandY,
  });
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(initialSpot.id);
  const [routeProgress, setRouteProgress] = useState<number>(initialStopIndex);
  const [isMovingAlong, setIsMovingAlong] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hoveredSpotId, setHoveredSpotId] = useState<string | null>(null);
  const [isCueCardHovered, setIsCueCardHovered] = useState<boolean>(false);
  const [showBadges, setShowBadges] = useState<boolean>(true);
  const [isInsightMinimized, setIsInsightMinimized] = useState<boolean>(false);

  const dragStartRef = useRef<{
    clientX: number;
    clientY: number;
    startFocusX: number;
    startFocusY: number;
    moved: boolean;
  }>({
    clientX: 0,
    clientY: 0,
    startFocusX: initialSpot.islandX,
    startFocusY: initialSpot.islandY,
    moved: false,
  });
  const stageRef = useRef<HTMLDivElement>(null);

  const activeHotspot =
    hotspots.find((h) => h.id === activeHotspotId) || orderedTourStops[0];

  // If the user hovers over an island on the map, show that island's bubble on the cue card too
  const displayedHotspot =
    (hoveredSpotId ? hotspots.find((h) => h.id === hoveredSpotId) : null) ||
    activeHotspot;

  const isBubbleRevealVisible = isCueCardHovered || Boolean(hoveredSpotId);

  const currentTourIndex = useMemo(() => {
    const idx = orderedTourStops.findIndex((s) => s.id === displayedHotspot?.id);
    return idx >= 0 ? idx : 0;
  }, [orderedTourStops, displayedHotspot]);

  // Focus camera on a specific island (always ensuring zoomed-in view unless explicitly 1x)
  const focusHotspot = useCallback(
    (spot: WorldHotspot, targetZoom?: number, stopAutoTour = true) => {
      sound.playPop();
      if (stopAutoTour) {
        setIsMovingAlong(false);
      }
      const nextZoom =
        targetZoom !== undefined
          ? targetZoom
          : zoom < 1.35
          ? DEFAULT_WORLD_ZOOM
          : zoom;
      setZoom(nextZoom);
      setActiveHotspotId(spot.id);
      setFocusPos({
        x: clampFocusCoord(spot.islandX, nextZoom, 'x'),
        y: clampFocusCoord(spot.islandY, nextZoom, 'y'),
      });
      const tourIdx = orderedTourStops.findIndex((s) => s.id === spot.id);
      if (tourIdx >= 0) {
        setRouteProgress(tourIdx);
      }
    },
    [orderedTourStops, zoom]
  );

  // Move along to Next / Previous stop along the walkway route
  const stepAlongWorld = useCallback(
    (delta: 1 | -1) => {
      const nextIdx =
        (currentTourIndex + delta + orderedTourStops.length) %
        orderedTourStops.length;
      const nextSpot = orderedTourStops[nextIdx];
      if (nextSpot) {
        focusHotspot(
          nextSpot,
          zoom < 1.5 ? DEFAULT_WORLD_ZOOM : zoom,
          true
        );
      }
    },
    [currentTourIndex, focusHotspot, orderedTourStops, zoom]
  );

  // Free-roam nudge camera in any direction (also works with keyboard WASD / Arrows)
  const nudgeCamera = useCallback(
    (dxPercent: number, dyPercent: number) => {
      setIsMovingAlong(false);
      const nextZoom = zoom < 1.35 ? DEFAULT_WORLD_ZOOM : zoom;
      if (nextZoom !== zoom) setZoom(nextZoom);

      setFocusPos((prev) => {
        const nextX = clampFocusCoord(prev.x + dxPercent, nextZoom, 'x');
        const nextY = clampFocusCoord(prev.y + dyPercent, nextZoom, 'y');

        // Snap active hotspot highlight to whichever island is closest to the camera center
        let closestSpot = orderedTourStops[0];
        let minDist = Infinity;
        for (const spot of orderedTourStops) {
          const dist = Math.hypot(spot.islandX - nextX, spot.islandY - nextY);
          if (dist < minDist) {
            minDist = dist;
            closestSpot = spot;
          }
        }
        if (closestSpot && minDist < 18) {
          setActiveHotspotId(closestSpot.id);
          const idx = orderedTourStops.findIndex((s) => s.id === closestSpot.id);
          if (idx >= 0) setRouteProgress(idx);
        }

        return { x: nextX, y: nextY };
      });
    },
    [orderedTourStops, zoom]
  );

  // Continuous "Move Along" auto-gliding camera loop along the 11 islands
  useEffect(() => {
    if (!isMovingAlong || isDragging) return;

    if (zoom < 1.4) {
      setZoom(DEFAULT_WORLD_ZOOM);
    }

    const isHeadless =
      typeof navigator !== 'undefined' &&
      (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));
    const intervalMs = isHeadless ? 120 : 50;
    const stepPerTick = (intervalMs / 1000) * 0.24;

    const timer = window.setInterval(() => {
      setRouteProgress((prev) => {
        const nextProgress =
          (prev + stepPerTick) % orderedTourStops.length;
        const interp = interpolateTourPosition(orderedTourStops, nextProgress);
        setFocusPos({
          x: clampFocusCoord(interp.focusX, DEFAULT_WORLD_ZOOM, 'x'),
          y: clampFocusCoord(interp.focusY, DEFAULT_WORLD_ZOOM, 'y'),
        });
        const nearestSpot = orderedTourStops[interp.currentStopIndex];
        if (nearestSpot) {
          setActiveHotspotId((currId) =>
            currId === nearestSpot.id ? currId : nearestSpot.id
          );
        }
        return nextProgress;
      });
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [isMovingAlong, isDragging, orderedTourStops, zoom]);

  // Keyboard navigation: ArrowLeft/ArrowRight or WASD to move along the world
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        stepAlongWorld(1);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        stepAlongWorld(-1);
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        nudgeCamera(0, -7);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        nudgeCamera(0, 7);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsMovingAlong((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nudgeCamera, stepAlongWorld]);

  const handleZoomToggle = () => {
    sound.playSelect();
    if (zoom > 1.35) {
      setIsMovingAlong(false);
      setZoom(MIN_WORLD_ZOOM);
      setFocusPos({ x: 50, y: 50 });
    } else {
      const targetSpot = activeHotspot || orderedTourStops[0];
      setZoom(DEFAULT_WORLD_ZOOM);
      setFocusPos({
        x: clampFocusCoord(targetSpot.islandX, DEFAULT_WORLD_ZOOM, 'x'),
        y: clampFocusCoord(targetSpot.islandY, DEFAULT_WORLD_ZOOM, 'y'),
      });
    }
  };

  const adjustZoomLevel = (delta: number) => {
    sound.playSelect();
    const nextZoom = Number(
      Math.max(MIN_WORLD_ZOOM, Math.min(MAX_WORLD_ZOOM, zoom + delta)).toFixed(2)
    );
    setZoom(nextZoom);
    if (nextZoom <= 1.05) {
      setIsMovingAlong(false);
      setFocusPos({ x: 50, y: 50 });
    } else {
      setFocusPos((prev) => ({
        x: clampFocusCoord(prev.x, nextZoom, 'x'),
        y: clampFocusCoord(prev.y, nextZoom, 'y'),
      }));
    }
  };

  // Drag-to-move-along on the zoomed-in canvas
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (zoom <= 1.05) return;
    setIsDragging(true);
    setIsMovingAlong(false);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startFocusX: focusPos.x,
      startFocusY: focusPos.y,
      moved: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const dxPx = e.clientX - dragStartRef.current.clientX;
    const dyPx = e.clientY - dragStartRef.current.clientY;

    if (Math.abs(dxPx) > 4 || Math.abs(dyPx) > 4) {
      dragStartRef.current.moved = true;
    }

    const deltaXPercent = -(dxPx / Math.max(rect.width, 300)) * (100 / zoom);
    const deltaYPercent = -(dyPx / Math.max(rect.height, 200)) * (100 / zoom);

    const nextX = clampFocusCoord(
      dragStartRef.current.startFocusX + deltaXPercent,
      zoom,
      'x'
    );
    const nextY = clampFocusCoord(
      dragStartRef.current.startFocusY + deltaYPercent,
      zoom,
      'y'
    );
    setFocusPos({ x: nextX, y: nextY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Compute CSS percentage translation for the zoomed-in camera
  const { txPercent, tyPercent } = computeCameraTranslationPercent(
    focusPos.x,
    focusPos.y,
    zoom
  );

  // SVG polyline points connecting the 11 islands in order
  const tourPolylinePoints = useMemo(() => {
    if (orderedTourStops.length === 0) return '';
    const closedLoop = [...orderedTourStops, orderedTourStops[0]];
    return closedLoop.map((s) => `${s.islandX},${s.islandY}`).join(' ');
  }, [orderedTourStops]);

  const bubbleHoverLabel = displayedHotspot
    ? formatBubbleHoverIdentity(
        displayedHotspot.bubbleIndex,
        displayedHotspot.emoji,
        displayedHotspot.fullTitle,
        displayedHotspot.centerObjectLabel
      )
    : '';

  return (
    <div
      data-world-zoom={zoom}
      data-moving-along={isMovingAlong ? 'true' : 'false'}
      data-insight-minimized={isInsightMinimized ? 'true' : 'false'}
      className="relative w-full h-full bg-[#0F172A] select-none flex flex-col overflow-hidden"
    >
      {/* ================= DEDICATED TOP HUD BAR (DESKTOP EXPANDED MODE ONLY) ================= */}
      {!isPhoneMode && (
        <div className="relative z-30 shrink-0 flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 bg-slate-950 border-b border-slate-800/90">
          {/* Left: Explorer World Title + Move-Along Status + Top 3 Personal Island Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 text-white border border-white/15">
              <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[11px] font-extrabold tracking-tight">
                {results.userName}&apos;s World
              </span>
              <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold">
                {zoom.toFixed(1)}x
              </span>
            </div>

            {/* Primary Auto Move-Along Toggle Button */}
            <button
              type="button"
              onClick={() => {
                sound.playSelect();
                if (!isMovingAlong && zoom < 1.35) {
                  setZoom(DEFAULT_WORLD_ZOOM);
                }
                setIsMovingAlong((prev) => !prev);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer border ${
                isMovingAlong
                  ? 'bg-emerald-400 text-slate-950 border-white shadow-[0_0_15px_rgba(52,211,153,0.45)]'
                  : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-400'
              }`}
              aria-label={isMovingAlong ? 'Pause moving along world' : 'Move along world tour'}
            >
              {isMovingAlong ? (
                <>
                  <Pause className="w-3 h-3 fill-current" />
                  <span>Moving Along ({currentTourIndex + 1}/{orderedTourStops.length})</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>Move Along World</span>
                </>
              )}
            </button>
          </div>

          {/* Right: Zoom Controls, Overview Toggle, Cards */}
          <div className="flex items-center gap-1.5 ml-auto">
            <div className="hidden sm:flex items-center bg-slate-900 rounded-full border border-slate-700 p-0.5">
              <button
                type="button"
                onClick={() => adjustZoomLevel(-0.4)}
                className="p-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Zoom out world"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleZoomToggle}
                className="px-2 py-0.5 text-[10px] font-extrabold text-white hover:text-amber-300 transition-colors cursor-pointer"
                title={zoom > 1.35 ? 'Switch to 1x Full Map Overview' : 'Zoom In 2.3x'}
              >
                {zoom > 1.35 ? 'Fit 1x' : 'Zoom 2.3x'}
              </button>
              <button
                type="button"
                onClick={() => adjustZoomLevel(0.4)}
                className="p-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Zoom in world"
                title="Zoom In Closer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowBadges((prev) => !prev)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                showBadges
                  ? 'bg-slate-900 text-white border-white/25 hover:bg-slate-800'
                  : 'bg-white text-slate-900 border-white'
              }`}
              title="Toggle Hotspot Badges"
            >
              {showBadges ? 'Hide Pins' : 'Show Pins'}
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onBackToCards();
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] border border-white/20 transition-transform hover:scale-105 cursor-pointer"
              title="Swipe Insight Cards"
            >
              <Layers className="w-3 h-3" />
              <span>Cards</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= ZOOMED-IN ISOMETRIC INSIGHTS WORLD STAGE ================= */}
      <div
        ref={stageRef}
        data-testid="interactive-world-canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`relative w-full overflow-hidden bg-[#5B9BD5] flex items-center justify-center flex-1 min-h-0 ${
          zoom > 1.05
            ? isDragging
              ? 'cursor-grabbing'
              : 'cursor-grab'
            : 'cursor-default'
        }`}
      >
        {/* ================= PHONE FLOATING TOP CONTROLS & CLOSE/MINIMISE BUTTON ================= */}
        {isPhoneMode && (
          <div className="absolute top-11 left-4 right-4 z-30 flex items-center justify-between gap-1.5 pointer-events-none">
            {isInsightMinimized ? (
              <div className="flex items-center gap-1 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    if (!isMovingAlong && zoom < 1.35) {
                      setZoom(DEFAULT_WORLD_ZOOM);
                    }
                    setIsMovingAlong((prev) => !prev);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-extrabold whitespace-nowrap shadow-md transition-all cursor-pointer border ${
                    isMovingAlong
                      ? 'bg-emerald-400 text-slate-950 border-emerald-500'
                      : 'bg-white/95 text-slate-900 border-slate-300 hover:bg-white'
                  }`}
                  aria-label={isMovingAlong ? 'Pause moving along world' : 'Move along world tour'}
                >
                  {isMovingAlong ? (
                    <>
                      <Pause className="w-2.5 h-2.5 fill-current shrink-0" />
                      <span>Pause {currentTourIndex + 1}/{orderedTourStops.length}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-2.5 h-2.5 fill-current shrink-0" />
                      <span>Move Along</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleZoomToggle}
                  className="px-2 py-1 rounded-full bg-white/95 hover:bg-white text-slate-900 border border-slate-300 shadow-md text-[10px] font-extrabold whitespace-nowrap transition-colors cursor-pointer"
                  title={zoom > 1.35 ? 'Switch to 1x Full Map Overview' : 'Zoom In 2.3x'}
                >
                  {zoom > 1.35 ? 'Fit 1x' : '2.3x'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    onBackToCards();
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white border border-white/20 shadow-md text-[10px] font-bold whitespace-nowrap transition-colors cursor-pointer"
                  title="View Swipeable Cards"
                >
                  <Layers className="w-2.5 h-2.5 text-blue-400 shrink-0" />
                  <span>Cards</span>
                </button>
              </div>
            ) : (
              <div />
            )}

            {/* Circular White 'X' Button from Reference Image — Minimises or Re-opens Insight Popup */}
            <button
              type="button"
              data-testid="minimize-insight-btn"
              onClick={() => {
                sound.playPop();
                setIsInsightMinimized((prev) => !prev);
              }}
              className="pointer-events-auto w-7 h-7 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 shadow-md flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shrink-0"
              aria-label={
                isInsightMinimized
                  ? 'Pop up world insight card'
                  : 'Minimise insight card to view world'
              }
              title={
                isInsightMinimized
                  ? 'Pop up insight card'
                  : 'Minimise insight card to view full world'
              }
            >
              {isInsightMinimized ? (
                <ChevronUp className="w-4 h-4 stroke-[2.4]" />
              ) : (
                <X className="w-3.5 h-3.5 stroke-[2.4]" />
              )}
            </button>
          </div>
        )}

        {/* True 1334:784 Aspect-Preserving Isometric World Container */}
        <div
          style={{
            transformOrigin: '50% 50%',
            transform: `scale(${
              isPhoneMode && isInsightMinimized ? Math.max(zoom * 1.42, 2.85) : zoom
            }) translate3d(${txPercent}%, ${tyPercent}%, 0)`,
            transition: isDragging
              ? 'none'
              : isMovingAlong
              ? 'transform 0.14s linear'
              : 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          className="relative w-full aspect-[1369/768]"
        >
          <div className="relative w-full h-full">
            {/* Reference Isometric Insights World Artwork */}
            <img
              src={WORLD_IMAGE_SRC}
              alt="Interactive 3D Isometric Insights World Map with 6 Search Personalities"
              draggable={false}
              className="w-full h-full object-contain select-none pointer-events-none block"
            />

            {/* Subtle Walkway Route Line */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
            >
              <polyline
                points={tourPolylinePoints}
                fill="none"
                stroke="rgba(255, 255, 255, 0.35)"
                strokeWidth="0.25"
                strokeDasharray="0.9 0.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Interactive Diorama Island Hit-Zones */}
            {hotspots.map((spot) => {
              const isSelected = activeHotspotId === spot.id;
              const isHovered = hoveredSpotId === spot.id;

              return (
                <button
                  key={`island-zone-${spot.id}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (dragStartRef.current.moved) return;
                    focusHotspot(spot, zoom < 1.5 ? DEFAULT_WORLD_ZOOM : zoom, true);
                  }}
                  onMouseEnter={() => setHoveredSpotId(spot.id)}
                  onMouseLeave={() =>
                    setHoveredSpotId((prev) => (prev === spot.id ? null : prev))
                  }
                  style={{
                    left: `${spot.islandX}%`,
                    top: `${spot.islandY}%`,
                    width: `${spot.hitRadiusX * 2}%`,
                    height: `${spot.hitRadiusY * 2}%`,
                  }}
                  aria-label={`Inspect ${spot.fullTitle} island`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full z-10 cursor-pointer focus:outline-none group"
                >
                  <span
                    className={`block w-full h-full rounded-full transition-all duration-300 pointer-events-none ${
                      isSelected
                        ? 'ring-1 ring-amber-300/90 bg-amber-300/5 shadow-[0_0_18px_rgba(251,191,36,0.55)]'
                        : isHovered
                        ? 'ring-1 ring-white/90 bg-white/15 shadow-[0_0_14px_rgba(255,255,255,0.65)]'
                        : ''
                    }`}
                  />
                </button>
              );
            })}

            {/* Sleek Counter-Scaled Hotspot Pins */}
            {showBadges &&
              hotspots.map((spot) => {
                const isSelected = activeHotspotId === spot.id;
                const isHovered = hoveredSpotId === spot.id;
                const invScale = Number((1 / Math.max(1, zoom * 0.85)).toFixed(3));

                return (
                  <button
                    key={spot.id}
                    type="button"
                    style={{
                      left: `${spot.badgeX}%`,
                      top: `${spot.badgeY}%`,
                      transform: `translate(-50%, -50%) scale(${invScale})`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (dragStartRef.current.moved) return;
                      focusHotspot(spot, zoom < 1.5 ? DEFAULT_WORLD_ZOOM : zoom, true);
                    }}
                    onMouseEnter={() => setHoveredSpotId(spot.id)}
                    onMouseLeave={() =>
                      setHoveredSpotId((prev) => (prev === spot.id ? null : prev))
                    }
                    aria-label={`Open ${spot.label} hotspot`}
                    className="absolute z-20 group cursor-pointer focus:outline-none"
                  >
                    <div
                      className={`relative flex items-center gap-1 px-2 py-0.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.55)] border transition-all ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 border-white font-black'
                          : 'bg-slate-950/85 text-white border-white/80 hover:bg-blue-600 hover:border-white'
                      }`}
                    >
                      {isSelected && (
                        <Navigation className="w-2.5 h-2.5 fill-current rotate-45 shrink-0" />
                      )}
                      <span className="text-[10px] leading-none">{spot.emoji}</span>
                      {(isSelected || isHovered) && (
                        <span className="text-[10px] font-extrabold tracking-tight whitespace-nowrap">
                          {spot.label}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* ================= FLOATING ON-STAGE D-PAD & MINIMAP RADAR ================= */}
        {(!isPhoneMode || isInsightMinimized) && (
          <div
            className={`absolute ${
              isPhoneMode ? 'top-20 left-2.5 p-1 rounded-xl' : 'top-3 left-3 p-1.5 rounded-2xl'
            } z-20 flex flex-col items-center gap-0.5 bg-slate-950/85 backdrop-blur-md border border-white/15 shadow-lg`}
          >
            <button
              type="button"
              onClick={() => nudgeCamera(0, -10)}
              className="w-6 h-6 rounded-lg bg-slate-800/90 hover:bg-blue-600 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Pan world north"
              title="Move Up (W / Up Arrow)"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => nudgeCamera(-12, 0)}
                className="w-6 h-6 rounded-lg bg-slate-800/90 hover:bg-blue-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Pan world west"
                title="Move Left (A / Left Arrow)"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleZoomToggle}
                className="w-6 h-6 rounded-lg bg-slate-900 hover:bg-slate-700 text-amber-400 flex items-center justify-center text-[9px] font-black transition-colors cursor-pointer"
                aria-label="Toggle world overview zoom"
                title="Toggle Zoom / Fit World"
              >
                <Maximize2 className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => nudgeCamera(12, 0)}
                className="w-6 h-6 rounded-lg bg-slate-800/90 hover:bg-blue-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Pan world east"
                title="Move Right (D / Right Arrow)"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => nudgeCamera(0, 10)}
              className="w-6 h-6 rounded-lg bg-slate-800/90 hover:bg-blue-600 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Pan world south"
              title="Move Down (S / Down Arrow)"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Top-Right Interactive World Minimap (Desktop Expanded View Only) */}
        {!isPhoneMode && (
          <div className="hidden sm:block absolute top-3 right-3 z-20 w-36 aspect-[1369/768] rounded-xl overflow-hidden border-2 border-white/30 bg-slate-950/90 shadow-xl">
            <img
              src={WORLD_IMAGE_SRC}
              alt="World Minimap"
              draggable={false}
              className="w-full h-full object-cover opacity-85 pointer-events-none"
            />
            {zoom > 1.05 && (
              <div
                style={{
                  width: `${100 / zoom}%`,
                  height: `${100 / zoom}%`,
                  left: `${focusPos.x}%`,
                  top: `${focusPos.y}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 border-2 border-amber-400 bg-amber-400/15 rounded-sm pointer-events-none transition-all duration-150"
              />
            )}
            {orderedTourStops.map((spot) => {
              const isCurr = activeHotspotId === spot.id;
              return (
                <button
                  key={`minimap-${spot.id}`}
                  type="button"
                  onClick={() => focusHotspot(spot, DEFAULT_WORLD_ZOOM, true)}
                  style={{
                    left: `${spot.islandX}%`,
                    top: `${spot.islandY}%`,
                  }}
                  aria-label={`Jump camera to ${spot.label} on minimap`}
                  title={`${spot.emoji} ${spot.fullTitle}`}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform cursor-pointer ${
                    isCurr
                      ? 'w-2.5 h-2.5 bg-emerald-400 ring-2 ring-white scale-125 z-10'
                      : 'w-1.5 h-1.5 bg-white/80 hover:bg-amber-300'
                  }`}
                />
              );
            })}
          </div>
        )}

        {/* ================= MINIMISED INSIGHT FLOATING BAR (WHEN MINIMISED TO VIEW WORLD) ================= */}
        {isInsightMinimized && displayedHotspot && (
          <div
            data-testid="minimized-insight-bar"
            className="absolute bottom-3.5 left-3 right-3 z-30 flex items-center justify-between gap-2 px-2.5 py-2 rounded-full bg-white/95 backdrop-blur-md text-neutral-900 shadow-[0_10px_30px_rgba(0,0,0,0.32)] border border-neutral-200"
          >
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <button
                type="button"
                onClick={() => stepAlongWorld(-1)}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Move to previous island"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => stepAlongWorld(1)}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Move along to next island"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1.5 pl-1 min-w-0 flex-1">
                <span className="text-sm leading-none shrink-0">{displayedHotspot.emoji}</span>
                <span className="text-xs font-extrabold text-neutral-900 truncate">
                  {displayedHotspot.label}
                </span>
                {!isPhoneMode && (
                  <span className="text-[11px] font-medium text-neutral-500 truncate">
                    — {displayedHotspot.fullTitle}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {!isPhoneMode && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    onOpenShareModal(displayedHotspot.cardData);
                  }}
                  className="px-2.5 py-1.5 rounded-full bg-gradient-to-r from-[#2b7de9] to-[#8fa8ff] text-white font-bold text-[11px] flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <span>Share</span>
                  <Share className="w-3 h-3" />
                </button>
              )}

              <button
                type="button"
                data-testid="expand-insight-btn"
                onClick={() => {
                  sound.playPop();
                  setIsInsightMinimized(false);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[11px] shadow-xs transition-all cursor-pointer"
              >
                <span>Pop Up Insight</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= POP-UP INSIGHTS PORTION (WHEN NOT MINIMISED) ================= */}
      {!isInsightMinimized &&
        displayedHotspot &&
        (isPhoneMode ? (
          /* ================= PHONE VERSION: POP-UP INSIGHT CARD MATCHING REFERENCE IMAGE 100% ================= */
          <div
            data-testid="world-insight-popup"
            className="relative z-30 shrink-0 w-full rounded-t-[28px] bg-white -mt-7 pb-2.5 flex flex-col items-center transition-all duration-300"
          >
            {/* Full-Width Rounded White Insight Card + Pastel Rainbow Bottom Edge Glow */}
            <div className="relative w-full">
              {/* Multi-Color Gradient Glow Along Bottom Curved Rim of Card */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -bottom-2 left-1.5 right-1.5 h-6 rounded-full blur-[7px] ${
                  isCoolBubblePalette(displayedHotspot.palette)
                    ? 'bg-gradient-to-r from-[#818cf8]/75 via-[#38bdf8]/45 to-[#84cc16]/80'
                    : 'bg-gradient-to-r from-[#f472b6]/75 via-[#fb923c]/35 to-[#fde047]/85'
                }`}
              />

              <div
                data-testid="world-insight-cue-card"
                data-bubble-hovered={isBubbleRevealVisible ? 'true' : 'false'}
                onMouseEnter={() => setIsCueCardHovered(true)}
                onMouseLeave={() => setIsCueCardHovered(false)}
                className="group relative w-full rounded-t-[28px] rounded-b-[26px] bg-white text-neutral-900 px-6 pt-5 pb-4 shadow-[0_6px_18px_rgba(0,0,0,0.06)] flex flex-col items-center text-center transition-all duration-200"
              >
                {/* Floating Curiosity Bubble Identity Popover on Hover */}
                <div
                  data-testid="cue-card-bubble-reveal"
                  className={`pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-white border-2 border-amber-400 shadow-xl transition-all duration-200 w-max max-w-[96%] ${
                    isBubbleRevealVisible
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-1.5 scale-95 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100'
                  }`}
                >
                  <span
                    style={{ backgroundColor: displayedHotspot.bgColor }}
                    className="w-2.5 h-2.5 rounded-full border border-white shrink-0"
                  />
                  <span className="text-[10.5px] font-extrabold tracking-tight text-amber-300 truncate">
                    {bubbleHoverLabel}
                  </span>
                </div>

                {/* Centered Kicker Text ("You searched for" / "You searched like a") */}
                <p className="text-[13px] font-bold text-neutral-900 tracking-tight mb-0.5">
                  {isBubbleRevealVisible
                    ? `Bubble #${displayedHotspot.bubbleIndex}: ${displayedHotspot.emoji} ${displayedHotspot.fullTitle}`
                    : displayedHotspot.kicker}
                </p>

                {/* Prominent Centered 3D Extruded Sticker Bubble Title */}
                <BubbleText3D
                  text={displayedHotspot.bubbleTitle}
                  palette={displayedHotspot.palette}
                  className={
                    displayedHotspot.bubbleTitle.includes('\n')
                      ? 'w-full h-[92px] mt-1 mb-1.5'
                      : 'w-full h-[72px] mt-1 mb-1.5'
                  }
                />

                {/* Centered 3-Line Readable Text */}
                <div
                  data-testid="phone-world-short-text"
                  className="w-full max-w-[260px] mx-auto mt-1.5 mb-4"
                >
                  <p className="text-[13px] text-neutral-800 leading-[1.36] font-normal">
                    {displayedHotspot.shortText}
                  </p>
                </div>

                {/* Card Bottom Watermark Row: Google 'G' on Left + 'youryear.google' Centered */}
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

            {/* Carousel Pagination Stepper Row (< ▬ • • • >) Directly Below Card */}
            <div className="flex items-center justify-center gap-3 mt-4 mb-3.5 text-neutral-700">
              <button
                type="button"
                onClick={() => stepAlongWorld(-1)}
                className="p-0.5 hover:text-neutral-950 transition-colors cursor-pointer"
                aria-label="Move to previous island"
              >
                <ChevronLeft className="w-3.5 h-3.5 stroke-[2.2]" />
              </button>

              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3].map((slotIdx) => {
                  const isCurrentSlot = currentTourIndex % 4 === slotIdx;
                  const targetSpot = orderedTourStops[slotIdx % orderedTourStops.length];
                  return (
                    <button
                      key={`step-pill-slot-${slotIdx}`}
                      type="button"
                      onClick={() =>
                        targetSpot && focusHotspot(targetSpot, DEFAULT_WORLD_ZOOM, true)
                      }
                      aria-label={`Move to stop ${slotIdx + 1}`}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        isCurrentSlot
                          ? 'w-4 bg-neutral-900'
                          : 'w-1.5 bg-neutral-400 hover:bg-neutral-500'
                      }`}
                    />
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => stepAlongWorld(1)}
                className="p-0.5 hover:text-neutral-950 transition-colors cursor-pointer"
                aria-label="Move along to next island"
              >
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
              </button>
            </div>

            {/* Bottom Two Pill Action Buttons: Share (Blue-Periwinkle Gradient) & Explore (Outlined White + Black Globe) */}
            <div className="w-full px-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  onOpenShareModal(displayedHotspot.cardData);
                }}
                className="flex-1 h-11 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1d7bf6] via-[#4c8df6] to-[#8ea4f8] hover:brightness-105 text-white font-bold text-[13.5px] shadow-xs transition-all cursor-pointer"
              >
                <span>Share</span>
                <Share className="w-3.5 h-3.5 stroke-[2.2]" />
              </button>

              <button
                type="button"
                data-testid="explore-minimize-btn"
                onClick={() => {
                  sound.playPop();
                  setIsInsightMinimized(true);
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
        ) : (
          /* ================= DESKTOP VERSION: HORIZONTAL INSIGHT CUE CARD (WITH MINIMISE OPTION) ================= */
          <div
            data-testid="world-insight-popup"
            className="relative z-30 shrink-0 bg-slate-950 border-t border-slate-800 px-3 py-2 gap-2 flex flex-col"
          >
            {/* Top Row of Bottom Bar: Interactive Move-Along Route Stepper + Minimise Button */}
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => stepAlongWorld(-1)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 text-[11px] font-bold transition-colors cursor-pointer shrink-0"
                aria-label="Move to previous island"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-amber-400" />
                <span>Prev Stop</span>
              </button>

              {/* 10-Stop Interactive Route Progress Pills */}
              <div className="flex-1 flex items-center justify-center gap-1 overflow-x-auto py-0.5">
                {orderedTourStops.map((spot, idx) => {
                  const isCurrent = displayedHotspot?.id === spot.id;
                  return (
                    <button
                      key={`step-pill-${spot.id}`}
                      type="button"
                      onClick={() => focusHotspot(spot, DEFAULT_WORLD_ZOOM, true)}
                      aria-label={`Move to stop ${idx + 1}: ${spot.label}`}
                      title={`${idx + 1}. ${spot.emoji} ${spot.fullTitle}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        isCurrent
                          ? 'w-6 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                          : 'w-2 bg-slate-700 hover:bg-slate-500'
                      }`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => stepAlongWorld(1)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-extrabold transition-colors cursor-pointer shrink-0"
                  aria-label="Move along to next island"
                >
                  <span>Next Stop</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  data-testid="minimize-insight-btn"
                  onClick={() => {
                    sound.playPop();
                    setIsInsightMinimized(true);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-bold transition-colors cursor-pointer shrink-0"
                  title="Minimise insight card to view full world"
                >
                  <span>Minimise</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Desktop Horizontal Insight Cue Card */}
            <div
              data-testid="world-insight-cue-card"
              data-bubble-hovered={isBubbleRevealVisible ? 'true' : 'false'}
              onMouseEnter={() => setIsCueCardHovered(true)}
              onMouseLeave={() => setIsCueCardHovered(false)}
              className={`group relative w-full rounded-2xl bg-white text-neutral-900 px-3 py-2 shadow-lg border-2 transition-all duration-200 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 ${
                isBubbleRevealVisible
                  ? 'border-blue-600 shadow-[0_0_24px_rgba(37,99,235,0.35)]'
                  : 'border-neutral-200 hover:border-blue-500'
              }`}
            >
              {/* Floating Curiosity Bubble Identity Popover shown when mouse hovers over the Insight Cue Card */}
              <div
                data-testid="cue-card-bubble-reveal"
                className={`pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-950 text-white border-2 border-amber-400 shadow-xl transition-all duration-200 max-w-[92%] ${
                  isBubbleRevealVisible
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-1.5 scale-95 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100'
                }`}
              >
                <span
                  style={{ backgroundColor: displayedHotspot.bgColor }}
                  className="w-2.5 h-2.5 rounded-full border border-white shrink-0"
                />
                <span className="text-[11px] font-extrabold tracking-tight text-amber-300 truncate">
                  {bubbleHoverLabel}
                </span>
              </div>

              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {displayedHotspot.dioramaImage && (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-neutral-900/15 shadow-sm shrink-0 bg-slate-100">
                    <img
                      src={displayedHotspot.dioramaImage}
                      alt={displayedHotspot.fullTitle}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain p-0.5"
                    />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 text-white font-mono font-bold text-[9px] uppercase shrink-0">
                      Stop {currentTourIndex + 1}/{orderedTourStops.length}
                    </span>
                    {/* Inline Bubble Identity Badge that highlights & expands on hover */}
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold transition-all ${
                        isBubbleRevealVisible
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      <span>{displayedHotspot.emoji}</span>
                      <span>
                        {isBubbleRevealVisible
                          ? displayedHotspot.bubbleIndex
                            ? `Bubble #${displayedHotspot.bubbleIndex}: ${displayedHotspot.fullTitle}`
                            : displayedHotspot.fullTitle
                          : 'Hover card for Bubble'}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-28 sm:w-36 shrink-0 -ml-0.5">
                      <BubbleText3D
                        text={displayedHotspot.bubbleTitle}
                        palette={displayedHotspot.palette}
                        singleLine
                        className="w-full h-7 sm:h-8"
                      />
                    </div>
                    <p className="text-[11px] text-neutral-700 leading-tight line-clamp-2 flex-1">
                      {displayedHotspot.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Search Anthem & Share Actions */}
              <div className="flex items-center gap-2 shrink-0 ml-auto">
                <div className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-700 max-w-[220px] truncate">
                  <Search className="w-2.5 h-2.5 text-blue-600 shrink-0" />
                  <span className="truncate">&ldquo;{displayedHotspot.anthemQuery}&rdquo;</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    onOpenShareModal(displayedHotspot.cardData);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition-all cursor-pointer"
                >
                  <Share2 className="w-3 h-3" />
                  <span>Share</span>
                </button>
                <GoogleLogo className="w-4 h-4 shrink-0" />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
