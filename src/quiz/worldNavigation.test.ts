import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ORDERED_TOUR_STOP_IDS,
  DEFAULT_WORLD_ZOOM,
  computeCameraTranslationPercent,
  interpolateTourPosition,
  formatBubbleHoverIdentity,
  type WorldWaypoint,
} from './worldNavigation.ts';

const SAMPLE_WAYPOINTS: WorldWaypoint[] = [
  { id: 'spot-trendsetter', islandX: 17.5, islandY: 61.5, label: 'Trendsetter' },
  { id: 'spot-superfan', islandX: 43.5, islandY: 31.0, label: 'Superfan' },
  { id: 'spot-foodie', islandX: 59.5, islandY: 38.0, label: 'Foodie' },
];

test('ORDERED_TOUR_STOP_IDS includes all 6 Search Personality world stops in a continuous loop', () => {
  assert.equal(ORDERED_TOUR_STOP_IDS.length, 6);
  assert.equal(ORDERED_TOUR_STOP_IDS[0], 'spot-trendsetter');
  assert.ok(ORDERED_TOUR_STOP_IDS.includes('spot-ai-whiz'));
  assert.ok(ORDERED_TOUR_STOP_IDS.includes('spot-curious-mind'));
});

test('DEFAULT_WORLD_ZOOM starts zoomed in (> 2.0x)', () => {
  assert.ok(DEFAULT_WORLD_ZOOM >= 2.0);
});

test('computeCameraTranslationPercent shifts camera toward island when zoomed in without exceeding edge bounds', () => {
  const res = computeCameraTranslationPercent(19.5, 28.5, DEFAULT_WORLD_ZOOM);
  assert.ok(res.txPercent > 25);
  assert.ok(res.txPercent <= 27.8);
  assert.ok(res.tyPercent > 15);
});

test('interpolateTourPosition smoothly moves between consecutive islands and wraps around', () => {
  const atStart = interpolateTourPosition(SAMPLE_WAYPOINTS, 0.1);
  assert.equal(atStart.currentStopIndex, 0);
  assert.equal(atStart.focusX, 17.5);
  assert.equal(atStart.focusY, 61.5);

  const midMove = interpolateTourPosition(SAMPLE_WAYPOINTS, 0.65);
  assert.ok(midMove.focusX > 17.5 && midMove.focusX < 43.5);
  assert.ok(midMove.focusY < 61.5 && midMove.focusY > 31.0);

  const wrapped = interpolateTourPosition(SAMPLE_WAYPOINTS, 3.05);
  assert.equal(wrapped.currentStopIndex, 0);
  assert.equal(wrapped.focusX, 17.5);
});

test('formatBubbleHoverIdentity formats clear bubble number, emoji, and name for insight cue card hover', () => {
  const label = formatBubbleHoverIdentity(
    1,
    '🔥',
    'Trendsetter',
    'Viral Collectibles Sanctuary'
  );
  assert.equal(
    label,
    'Curiosity Bubble #1: 🔥 Trendsetter (Viral Collectibles Sanctuary)'
  );
});
