export type CategoryId =
  | 'trendsetter'
  | 'superfan'
  | 'ai_whiz'
  | 'curious_mind'
  | 'foodie'
  | 'jetsetter';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  emoji: string;
  badgeColor: string;
  bgGradient: string;
  bubbleColor: string;
  borderColor: string;
  textColor: string;
  shortDesc: string;
  isometricConcept: string;
}

export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D';
  query: string; // The exact text to show to the user (DO NOT SHOW CATEGORY TAGS)
  category: CategoryId;
}

export interface Question {
  id: number;
  prompt: string;
  options: QuestionOption[];
}

export type UserAnswers = Record<number, 'A' | 'B' | 'C' | 'D'>;

export interface InsightCardData {
  cardNumber: 1 | 2 | 3;
  cardRole: 'THE PRIMARY HEADSPACE' | 'THE CO-PILOT' | 'THE WILDCARD';
  cardRoleEmoji: string;
  category: CategoryInfo;
  score: number;
  diagnosis: string;
  anthemQuery: string;
  isometricConcept: string;
}

export interface WrappedResults {
  userName: string;
  topCards: [InsightCardData, InsightCardData, InsightCardData];
  loadScreen: {
    leadIn: string;
    illustrationConcept: string;
  };
  allScores: Record<CategoryId, number>;
  markdownOutput: string;
}
