export interface WorldWaypoint {
  id: string;
  islandX: number;
  islandY: number;
  label: string;
}

/**
 * Ordered loop connecting all 10 Curiosity Bubble stops across the upper and lower rows
 * of /assets/aistudio/img_7_ea56e1e8.png (1334x784)
 */
export const ORDERED_TOUR_STOP_IDS: readonly string[] = [
  'spot-trendsetter',
  'spot-jetsetter',
  'spot-ai-whiz',
  'spot-superfan',
  'spot-foodie',
  'spot-curious-mind',
];

export const DEFAULT_WORLD_ZOOM = 2.25;
export const MIN_WORLD_ZOOM = 1.0;
export const MAX_WORLD_ZOOM = 3.0;

/**
 * Formats the Curiosity Bubble identity label shown when hovering over an Insight Cue Card.
 */
export function formatBubbleHoverIdentity(
  bubbleIndex: number | undefined,
  emoji: string,
  bubbleName: string,
  dioramaLabel?: string
): string {
  const prefix = bubbleIndex ? `Curiosity Bubble #${bubbleIndex}` : 'Special Trend Bubble';
  const base = `${prefix}: ${emoji} ${bubbleName}`;
  return dioramaLabel ? `${base} (${dioramaLabel})` : base;
}

/**
 * Clamps a world focus coordinate (in 0..100% space) for a given zoom level
 * so the camera centers closely on outer islands while keeping the world framed.
 */
export function clampFocusCoord(
  coordPercent: number,
  zoom: number,
  _axis: 'x' | 'y'
): number {
  if (zoom <= 1.02) {
    return 50;
  }
  // Exact edge-to-edge bound so the scaled image always fills 100% of the stage without dark margins
  const maxReach = ((zoom - 1) / (2 * zoom)) * 100;
  const minVal = 50 - maxReach;
  const maxVal = 50 + maxReach;
  return Math.max(minVal, Math.min(maxVal, coordPercent));
}

/**
 * Computes percentage translate3d(tx%, ty%, 0) values to pair with scale(zoom)
 * around transform-origin: 50% 50% so (focusX%, focusY%) is centered in the viewport.
 */
export function computeCameraTranslationPercent(
  focusX: number,
  focusY: number,
  zoom: number
): { txPercent: number; tyPercent: number } {
  if (zoom <= 1.02) {
    return { txPercent: 0, tyPercent: 0 };
  }
  const clampedX = clampFocusCoord(focusX, zoom, 'x');
  const clampedY = clampFocusCoord(focusY, zoom, 'y');
  return {
    txPercent: Number((50 - clampedX).toFixed(3)),
    tyPercent: Number((50 - clampedY).toFixed(3)),
  };
}

/**
 * Given a normalized route progress value (0..waypoints.length, wrapping around),
 * interpolates the exact (x, y) position along the walkway tour and identifies
 * the nearest active stop index.
 */
export function interpolateTourPosition(
  waypoints: readonly WorldWaypoint[],
  routeProgress: number
): {
  focusX: number;
  focusY: number;
  currentStopIndex: number;
  nextStopIndex: number;
  segmentFraction: number;
} {
  const count = waypoints.length;
  if (count === 0) {
    return {
      focusX: 50,
      focusY: 50,
      currentStopIndex: 0,
      nextStopIndex: 0,
      segmentFraction: 0,
    };
  }

  const normalized = ((routeProgress % count) + count) % count;
  const currentStopIndex = Math.floor(normalized) % count;
  const nextStopIndex = (currentStopIndex + 1) % count;
  const rawFraction = normalized - Math.floor(normalized);

  // Smoothstep easing so the camera pauses briefly at each island diorama
  // and glides smoothly along the walkway between stops
  const pauseWindow = 0.25;
  let t = 0;
  if (rawFraction > pauseWindow) {
    const moveT = (rawFraction - pauseWindow) / (1 - pauseWindow);
    t = moveT * moveT * (3 - 2 * moveT);
  }

  const curr = waypoints[currentStopIndex];
  const next = waypoints[nextStopIndex];

  const focusX = curr.islandX + (next.islandX - curr.islandX) * t;
  const focusY = curr.islandY + (next.islandY - curr.islandY) * t;
  const nearestStopIndex = rawFraction < 0.62 ? currentStopIndex : nextStopIndex;

  return {
    focusX: Number(focusX.toFixed(2)),
    focusY: Number(focusY.toFixed(2)),
    currentStopIndex: nearestStopIndex,
    nextStopIndex,
    segmentFraction: Number(t.toFixed(3)),
  };
}
