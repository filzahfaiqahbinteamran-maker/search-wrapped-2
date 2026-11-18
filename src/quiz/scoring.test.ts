import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateWrappedResults } from './scoring.ts';
import { QUIZ_QUESTIONS, CATEGORIES } from './data.ts';
import type { UserAnswers } from './types.ts';

test('10 questions and 6 personalities are properly defined with 4 distinct options each', () => {
  assert.equal(Object.keys(CATEGORIES).length, 6);
  assert.equal(QUIZ_QUESTIONS.length, 10);
  for (const q of QUIZ_QUESTIONS) {
    assert.equal(q.options.length, 4);
    const keys = q.options.map((o) => o.key);
    assert.deepEqual(keys, ['A', 'B', 'C', 'D']);
    for (const opt of q.options) {
      assert.ok(opt.query.length > 0, `Question ${q.id} option ${opt.key} has empty query`);
      assert.ok(CATEGORIES[opt.category], `Invalid category ${opt.category}`);
      assert.ok(opt.category.length > 0);
    }
  }
});

test('scoring correctly calculates top 3 Insight Cards for user answers', () => {
  const answers: UserAnswers = {};
  for (let i = 1; i <= 10; i++) {
    answers[i] = 'A';
  }

  const results = calculateWrappedResults(answers, 'Filzah');
  assert.equal(results.userName, 'Filzah');
  assert.equal(results.topCards.length, 3);
  assert.equal(results.topCards[0].cardRole, 'THE PRIMARY HEADSPACE');
  assert.equal(results.topCards[1].cardRole, 'THE CO-PILOT');
  assert.equal(results.topCards[2].cardRole, 'THE WILDCARD');

  assert.ok(results.topCards[0].anthemQuery.length > 0);
  assert.ok(results.topCards[0].isometricConcept.length > 0);
  assert.ok(results.loadScreen.illustrationConcept.length > 0);
});

test('tie breaking respects questions 10, 6, and 3', () => {
  const answers1: UserAnswers = {
    1: 'A', // trendsetter
    2: 'B', // foodie
    3: 'B', // trendsetter
    4: 'A', // foodie
    5: 'D', // foodie
    6: 'A', // trendsetter
    7: 'B', // ai_whiz
    8: 'A', // ai_whiz
    9: 'A', // curious_mind
    10: 'B', // foodie (Q10 tie break gives priority to foodie over trendsetter when tied at 3 vs 4, or let's make both 3)
  };
  //Wait: let's make trendsetter and foodie both have 3 points, with Q10 picking foodie!
  const tiedAnswers: UserAnswers = {
    1: 'A', // trendsetter (1)
    2: 'A', // superfan (1)
    3: 'B', // trendsetter (2)
    4: 'A', // foodie (1)
    5: 'D', // foodie (2)
    6: 'A', // trendsetter (3)
    7: 'B', // ai_whiz (1)
    8: 'A', // ai_whiz (2)
    9: 'A', // curious_mind (1)
    10: 'B', // foodie (3) - Q10 bonus +4 wins tie break over trendsetter!
  };

  const res1 = calculateWrappedResults(tiedAnswers, 'Alex');
  assert.equal(res1.allScores['trendsetter'], 3);
  assert.equal(res1.allScores['foodie'], 3);
  assert.equal(res1.topCards[0].category.id, 'foodie');
});

test('markdown output conforms to required Interactive Load Screen and 3D WebGL spec template', () => {
  const answers: UserAnswers = {
    1: 'A', 2: 'A', 3: 'A', 4: 'A', 5: 'A',
    6: 'A', 7: 'A', 8: 'A', 9: 'A', 10: 'A',
  };
  const results = calculateWrappedResults(answers, 'Filzah');
  const md = results.markdownOutput;

  assert.ok(md.includes('# 🔍 GOOGLE SEARCH WRAPPED'));
  assert.ok(md.includes('## 🗺️ INTERACTIVE LOAD SCREEN:'));
  assert.ok(md.includes('### YOUR WORLD OF SEARCH'));
  assert.ok(md.includes("Filzah, you've gone down every rabbit hole imaginable — So we built your World of Search. Click, drag, and toss the bubbles below to explore it!"));
  assert.ok(md.includes('*🎮 [INTERACTIVE 3D WEBGL COMPONENT SPECIFICATION]:*'));
  assert.ok(md.includes('// Render a transparent, glass-textured container sphere on canvas using Three.js and Matter.js.'));
  assert.ok(md.includes('// 1. Mesh #1 (Giant - Blue):'));
  assert.ok(md.includes('// 2. Mesh #2 (Medium - Red):'));
  assert.ok(md.includes('// 3. Mesh #3 (Small - Yellow):'));
  assert.ok(md.includes('## 🗂️ SWIPEABLE INSIGHT CARDS'));
  assert.ok(md.includes('### 📱 CARD #1: THE PRIMARY HEADSPACE'));
  assert.ok(md.includes('### 📱 CARD #2: THE CO-PILOT'));
  assert.ok(md.includes('### 📱 CARD #3: THE WILDCARD'));
  assert.ok(md.includes('*(Share your bubbles with #GoogleSearchWrapped • g.co/searchwrapped)*'));
});
