'use client';

import { useState, useEffect } from 'react';
import { AgentStep, StepAnnotation, AnnotationFlag } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatActionDetails } from '@/lib/action-utils';
import {
  Brain,
  Zap,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Star,
} from 'lucide-react';

interface StepDetailProps {
  step: AgentStep;
  annotation: StepAnnotation | undefined;
  onAnnotationChange: (annotation: StepAnnotation) => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  stepIndex: number;
  totalSteps: number;
}

const issueFlags: { value: AnnotationFlag; label: string }[] = [
  { value: 'suboptimal_action', label: 'Suboptimal' },
  { value: 'unnecessary_step', label: 'Unnecessary' },
  { value: 'incorrect_reasoning', label: 'Bad Reasoning' },
  { value: 'hallucination', label: 'Hallucination' },
  { value: 'wrong_element', label: 'Wrong Element' },
  { value: 'safety_concern', label: 'Safety Issue' },
];

const positiveFlags: { value: AnnotationFlag; label: string }[] = [
  { value: 'excellent_reasoning', label: 'Great Reasoning' },
  { value: 'creative_solution', label: 'Creative' },
  { value: 'recovery_success', label: 'Good Recovery' },
];

export function StepDetail({
  step,
  annotation,
  onAnnotationChange,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  stepIndex,
  totalSteps,
}: StepDetailProps) {
  const [localAnnotation, setLocalAnnotation] = useState<StepAnnotation>(
    annotation || {
      stepId: step.id,
      rating: 0,
      reasoningQuality: 0,
      actionQuality: 0,
      reasoning: '',
      flags: [],
    }
  );
  const [showObservation, setShowObservation] = useState(false);

  useEffect(() => {
    setLocalAnnotation(
      annotation || {
        stepId: step.id,
        rating: 0,
        reasoningQuality: 0,
        actionQuality: 0,
        reasoning: '',
        flags: [],
      }
    );
  }, [step.id, annotation]);

  const updateAnnotation = (updates: Partial<StepAnnotation>) => {
    const updated = { ...localAnnotation, ...updates, stepId: step.id };
    setLocalAnnotation(updated);
    onAnnotationChange(updated);
  };

  const toggleFlag = (flag: AnnotationFlag) => {
    const flags = localAnnotation.flags.includes(flag)
      ? localAnnotation.flags.filter((f) => f !== flag)
      : [...localAnnotation.flags, flag];
    updateAnnotation({ flags });
  };

  const RatingStars = ({
    value,
    onChange,
    label,
  }: {
    value: number;
    onChange: (v: number) => void;
    label: string;
  }) => (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className="p-0.5 rounded transition-colors hover:bg-accent"
          >
            <Star
              className={cn(
                'h-4 w-4 transition-colors',
                star <= value
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-muted-foreground/30'
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Navigation header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-white">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            disabled={!hasPrevious}
            className="h-7 px-2"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs font-medium">
            Step {stepIndex + 1}/{totalSteps}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onNext}
            disabled={!hasNext}
            className="h-7 px-2"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {/* Reasoning + Action side by side */}
          <div className="grid grid-cols-2 gap-3">
            {/* Reasoning */}
            <div className="bg-white rounded-lg border border-border/30 overflow-hidden">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50/50 border-b border-border/30">
                <Brain className="h-3.5 w-3.5 text-purple-600" />
                <span className="text-xs font-medium text-purple-900">Reasoning</span>
              </div>
              <p className="p-3 text-xs text-foreground leading-relaxed">
                {step.reasoning}
              </p>
            </div>

            {/* Action */}
            <div className="bg-white rounded-lg border border-border/30 overflow-hidden">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50/50 border-b border-border/30">
                <Zap className="h-3.5 w-3.5 text-amber-600" />
                <span className="text-xs font-medium text-amber-900">Action</span>
              </div>
              <code className="block p-3 text-xs bg-muted/20 font-mono text-foreground">
                {formatActionDetails(step.action)}
              </code>
            </div>
          </div>

          {/* Observation - collapsible */}
          <div className="bg-white rounded-lg border border-border/30 overflow-hidden">
            <button
              onClick={() => setShowObservation(!showObservation)}
              className="w-full flex items-center justify-between px-3 py-1.5 bg-blue-50/50 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-xs font-medium text-blue-900">Observation</span>
                <span className="text-[10px] text-blue-600">(result of action)</span>
              </div>
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 text-blue-600 transition-transform',
                  showObservation && 'rotate-180'
                )}
              />
            </button>
            {showObservation && (
              <pre className="p-3 text-[11px] text-foreground leading-relaxed border-t border-border/30 font-mono whitespace-pre-wrap overflow-x-auto bg-slate-50/50">
                {step.observation}
              </pre>
            )}
          </div>

          {/* Annotation Section */}
          <div className="bg-white rounded-lg border border-border/30 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 bg-primary/5 border-b border-border/30">
              <div className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-foreground">Your Rating</span>
              </div>
              {localAnnotation.rating > 0 && (
                <span className="text-[10px] text-primary font-medium flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Saved
                </span>
              )}
            </div>

            <div className="p-3 space-y-3">
              {/* Ratings */}
              <div className="space-y-2">
                <RatingStars
                  label="Overall"
                  value={localAnnotation.rating}
                  onChange={(v) => updateAnnotation({ rating: v })}
                />
                <RatingStars
                  label="Reasoning"
                  value={localAnnotation.reasoningQuality}
                  onChange={(v) => updateAnnotation({ reasoningQuality: v })}
                />
                <RatingStars
                  label="Action"
                  value={localAnnotation.actionQuality}
                  onChange={(v) => updateAnnotation({ actionQuality: v })}
                />
              </div>

              {/* Flags */}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {issueFlags.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => toggleFlag(value)}
                      className={cn(
                        'px-2 py-1 text-[10px] font-medium rounded-full transition-all border',
                        localAnnotation.flags.includes(value)
                          ? 'bg-rose-500 text-white border-rose-500'
                          : 'bg-white text-muted-foreground border-border hover:border-rose-300'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {positiveFlags.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => toggleFlag(value)}
                      className={cn(
                        'px-2 py-1 text-[10px] font-medium rounded-full transition-all border',
                        localAnnotation.flags.includes(value)
                          ? 'bg-emerald-500 text-white border-emerald-500'
                          : 'bg-white text-muted-foreground border-border hover:border-emerald-300'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <Textarea
                placeholder="Add notes about this step..."
                value={localAnnotation.reasoning}
                onChange={(e) => updateAnnotation({ reasoning: e.target.value })}
                className="min-h-[50px] text-xs resize-none"
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
