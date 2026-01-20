/**
 * Rubric categories
 */
export const RUBRIC_CATEGORIES = [
  'correctness',
  'efficiency',
  'reasoning',
  'robustness',
  'safety',
] as const;

export type RubricCategory = typeof RUBRIC_CATEGORIES[number];
