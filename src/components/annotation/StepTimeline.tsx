'use client';

import { AgentStep, StepAnnotation } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { getActionIcon, getActionLabel } from '@/lib/action-utils';
import {
  Check,
  AlertTriangle,
  Circle,
  Sparkles,
} from 'lucide-react';

interface StepTimelineProps {
  steps: AgentStep[];
  currentStepId: string;
  onStepSelect: (stepId: string) => void;
  stepAnnotations: Map<string, StepAnnotation>;
}

const ISSUE_FLAGS = ['suboptimal_action', 'unnecessary_step', 'incorrect_reasoning', 'hallucination', 'wrong_element', 'safety_concern'];
const POSITIVE_FLAGS = ['excellent_reasoning', 'creative_solution', 'recovery_success'];

function getAnnotationStatus(annotation?: StepAnnotation) {
  if (!annotation) return 'pending';

  const hasIssueFlag = annotation.flags.some(f => ISSUE_FLAGS.includes(f));
  const hasPositiveFlag = annotation.flags.some(f => POSITIVE_FLAGS.includes(f));

  // Issue flags take priority
  if (hasIssueFlag) return 'issue';

  // Positive flags indicate good
  if (hasPositiveFlag) return 'good';

  // Otherwise use rating
  if (annotation.rating >= 4) return 'good';
  if (annotation.rating >= 3) return 'okay';
  if (annotation.rating > 0) return 'okay'; // Rated but low

  return 'pending'; // No rating yet
}

export function StepTimeline({
  steps,
  currentStepId,
  onStepSelect,
  stepAnnotations,
}: StepTimelineProps) {
  const completedSteps = stepAnnotations.size;
  const progressPercent = (completedSteps / steps.length) * 100;

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="px-3 py-2 border-b border-border/30">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-foreground">Steps</h2>
          <span className="text-[10px] text-muted-foreground">
            {completedSteps}/{steps.length}
          </span>
        </div>
        <div className="mt-1.5 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Steps list */}
      <ScrollArea className="flex-1">
        <div className="p-1.5">
          {steps.map((step, index) => {
            const isSelected = step.id === currentStepId;
            const annotation = stepAnnotations.get(step.id);
            const status = getAnnotationStatus(annotation);
            const isLast = index === steps.length - 1;
            const isDemoHighlight = step.stepNumber === 6;

            return (
              <div key={step.id} className="relative">
                {/* Connector line */}
                {!isLast && (
                  <div
                    className={cn(
                      'absolute left-[14px] top-[28px] w-[1.5px] h-[calc(100%-16px)]',
                      status === 'pending' ? 'bg-border' : 'bg-primary/30'
                    )}
                  />
                )}

                <button
                  onClick={() => onStepSelect(step.id)}
                  className={cn(
                    'w-full text-left px-2 py-1.5 rounded-md mb-0.5 transition-all duration-150',
                    'hover:bg-accent/50',
                    isSelected && 'bg-accent shadow-sm ring-1 ring-primary/20',
                    isDemoHighlight && !isSelected && 'bg-amber-50/50 ring-1 ring-amber-200/50'
                  )}
                >
                  <div className="flex items-start gap-2">
                    {/* Status indicator */}
                    <div
                      className={cn(
                        'flex h-5 w-5 items-center justify-center rounded-full flex-shrink-0 transition-colors mt-0.5',
                        status === 'pending' && !isDemoHighlight && 'bg-muted border border-border',
                        status === 'pending' && isDemoHighlight && 'bg-amber-100 border border-amber-300',
                        status === 'good' && 'bg-emerald-500 text-white',
                        status === 'okay' && 'bg-amber-500 text-white',
                        status === 'issue' && 'bg-rose-500 text-white'
                      )}
                    >
                      {status === 'pending' ? (
                        <span className={cn(
                          'text-[9px] font-semibold',
                          isDemoHighlight ? 'text-amber-700' : 'text-muted-foreground'
                        )}>
                          {step.stepNumber}
                        </span>
                      ) : status === 'good' ? (
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      ) : status === 'issue' ? (
                        <AlertTriangle className="h-2.5 w-2.5" strokeWidth={2.5} />
                      ) : (
                        <Circle className="h-2 w-2 fill-current" />
                      )}
                    </div>

                    {/* Step content */}
                    <div className="flex-1 min-w-0">
                      {/* Action type badge + demo indicator */}
                      <div className="flex items-center gap-1.5">
                        <div
                          className={cn(
                            'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium',
                            isSelected
                              ? 'bg-primary/10 text-primary'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {getActionIcon(step.action.type, 'sm')}
                          <span>{getActionLabel(step.action.type)}</span>
                        </div>
                        {isDemoHighlight && (
                          <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded bg-amber-100 text-amber-700 text-[9px] font-medium">
                            <Sparkles className="h-2.5 w-2.5" />
                            Demo
                          </span>
                        )}
                      </div>

                      {/* Annotation flags - single line */}
                      {annotation && annotation.flags.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <span
                            className={cn(
                              'inline-flex items-center px-1 py-0.5 rounded text-[9px] font-medium',
                              ISSUE_FLAGS.includes(annotation.flags[0])
                                ? 'bg-rose-50 text-rose-600'
                                : 'bg-emerald-50 text-emerald-600'
                            )}
                          >
                            {annotation.flags[0].replace(/_/g, ' ')}
                          </span>
                          {annotation.flags.length > 1 && (
                            <span className="text-[9px] text-muted-foreground">
                              +{annotation.flags.length - 1}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
