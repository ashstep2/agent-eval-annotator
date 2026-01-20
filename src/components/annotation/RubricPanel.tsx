'use client';

import { RubricItem, RubricScoreData } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { RUBRIC_CATEGORIES, type RubricCategory } from '@/lib/constants';
import {
  CheckCircle2,
  Gauge,
  Shield,
  Brain,
  Repeat,
  Info,
  Trophy,
  Target,
} from 'lucide-react';

interface RubricPanelProps {
  rubric: RubricItem[];
  scores: Map<string, RubricScoreData>;
  onScoreChange: (
    rubricItemId: string,
    score: number,
    justification: string
  ) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  correctness: <CheckCircle2 className="h-3.5 w-3.5" />,
  efficiency: <Gauge className="h-3.5 w-3.5" />,
  safety: <Shield className="h-3.5 w-3.5" />,
  reasoning: <Brain className="h-3.5 w-3.5" />,
  robustness: <Repeat className="h-3.5 w-3.5" />,
};

const categoryColors: Record<string, { bg: string; text: string; icon: string }> = {
  correctness: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'text-emerald-500' },
  efficiency: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-500' },
  safety: { bg: 'bg-rose-50', text: 'text-rose-700', icon: 'text-rose-500' },
  reasoning: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'text-purple-500' },
  robustness: { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'text-amber-500' },
};

export function RubricPanel({
  rubric,
  scores,
  onScoreChange,
}: RubricPanelProps) {
  const totalWeight = rubric.reduce((sum, item) => sum + item.weight, 0);
  const weightedScore =
    rubric.reduce((sum, item) => {
      const score = scores.get(item.id)?.score || 0;
      return sum + (score * item.weight) / totalWeight;
    }, 0) || 0;

  const scoredItems = rubric.filter((item) => scores.has(item.id)).length;
  const progressPercent = (scoredItems / rubric.length) * 100;

  // Calculate score color
  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-emerald-600';
    if (score >= 3) return 'text-amber-600';
    if (score >= 2) return 'text-orange-600';
    return 'text-rose-600';
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-full flex-col bg-white">
        {/* Header with overall score */}
        <div className="px-3 py-2 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-primary" />
              <h2 className="text-xs font-semibold text-foreground">Rubric</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                'text-sm font-bold',
                weightedScore > 0 ? getScoreColor(weightedScore) : 'text-muted-foreground'
              )}>
                {weightedScore > 0 ? weightedScore.toFixed(1) : '-'}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {scoredItems}/{rubric.length}
              </span>
            </div>
          </div>
        </div>

        {/* Rubric Items */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1.5">
            {rubric.map((item) => {
              const scoreData = scores.get(item.id);
              const currentScore = scoreData?.score || 0;
              const colors = categoryColors[item.category];

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border border-border/30 overflow-hidden"
                >
                  <div className="px-2.5 py-2">
                    {/* Criterion name with icon */}
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className={colors.icon}>
                        {categoryIcons[item.category]}
                      </span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <h4 className="text-xs font-medium text-foreground cursor-help">
                            {item.criterion}
                          </h4>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-[200px]">
                          <p className="text-xs">{item.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    {/* Score buttons */}
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((score) => {
                        const guideline = item.scoringGuidelines.find(
                          (g) => g.score === score
                        );
                        const isSelected = currentScore === score;

                        return (
                          <Tooltip key={score}>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() =>
                                  onScoreChange(
                                    item.id,
                                    score,
                                    guideline?.description || ''
                                  )
                                }
                                className={cn(
                                  'flex-1 h-6 rounded text-[11px] font-medium transition-all',
                                  'focus:outline-none focus:ring-2 focus:ring-primary/20',
                                  isSelected
                                    ? 'bg-primary text-white'
                                    : 'bg-muted/40 text-muted-foreground hover:bg-muted'
                                )}
                              >
                                {score}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-[180px]">
                              <p className="text-xs">
                                <span className="font-semibold">Score {score}:</span>{' '}
                                {guideline?.description || 'No description'}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Footer with category breakdown */}
        <div className="px-2 py-1.5 border-t border-border/30 bg-muted/10">
          <div className="grid grid-cols-5 gap-1">
            {RUBRIC_CATEGORIES.map(
              (category) => {
                const categoryItems = rubric.filter(
                  (item) => item.category === category
                );
                const categoryScore =
                  categoryItems.reduce((sum, item) => {
                    const score = scores.get(item.id)?.score || 0;
                    return sum + score;
                  }, 0) / categoryItems.length || 0;

                const colors = categoryColors[category];

                return (
                  <Tooltip key={category}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          'flex flex-col items-center p-1 rounded',
                          colors.bg
                        )}
                      >
                        <span className={colors.icon}>
                          {categoryIcons[category]}
                        </span>
                        <span
                          className={cn('text-[9px] font-semibold', colors.text)}
                        >
                          {categoryScore > 0 ? categoryScore.toFixed(1) : '-'}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs capitalize">{category}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
