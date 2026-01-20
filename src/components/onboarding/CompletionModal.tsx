'use client';

import { Button } from '@/components/ui/button';
import { MercorLogoMark } from '@/components/brand/MercorLogo';
import {
  CheckCircle2,
  Star,
  Flag,
  Clock,
  BarChart3,
  ArrowRight,
  Sparkles,
  X,
} from 'lucide-react';
import { StepAnnotation, RubricScoreData } from '@/types';

interface CompletionModalProps {
  onClose: () => void;
  stepAnnotations: Map<string, StepAnnotation>;
  rubricScores: Map<string, RubricScoreData>;
  totalSteps: number;
}

export function CompletionModal({
  onClose,
  stepAnnotations,
  rubricScores,
  totalSteps,
}: CompletionModalProps) {
  // Calculate stats
  const annotations = Array.from(stepAnnotations.values());

  const avgRating = annotations.length > 0
    ? (annotations.reduce((sum, a) => sum + a.rating, 0) / annotations.length).toFixed(1)
    : '0';

  const totalFlags = annotations.reduce((sum, a) => sum + a.flags.length, 0);

  const issueFlags = ['suboptimal_action', 'unnecessary_step', 'incorrect_reasoning', 'hallucination', 'wrong_element', 'safety_concern'];
  const issuesFound = annotations.reduce(
    (sum, a) => sum + a.flags.filter(f => issueFlags.includes(f)).length,
    0
  );

  const rubricScoresArray = Array.from(rubricScores.values());
  const avgRubricScore = rubricScoresArray.length > 0
    ? (rubricScoresArray.reduce((sum, r) => sum + r.score, 0) / rubricScoresArray.length).toFixed(1)
    : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors z-10"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Celebration header */}
        <div className="bg-gradient-to-br from-primary via-primary to-[#4838c8] p-6 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/20 mb-3">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white mb-1">
            Annotation Complete!
          </h1>
          <p className="text-sm text-white/80">
            You've reviewed all {totalSteps} steps
          </p>
        </div>

        <div className="p-5">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Star className="h-4 w-4 text-amber-500" />
                <span className="text-lg font-bold text-foreground">{avgRating}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Avg Step Rating</p>
            </div>

            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span className="text-lg font-bold text-foreground">{avgRubricScore}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Avg Rubric Score</p>
            </div>

            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Flag className="h-4 w-4 text-rose-500" />
                <span className="text-lg font-bold text-foreground">{issuesFound}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Issues Flagged</p>
            </div>

            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Sparkles className="h-4 w-4 text-emerald-500" />
                <span className="text-lg font-bold text-foreground">{totalFlags - issuesFound}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Positives Noted</p>
            </div>
          </div>

          {/* Summary message */}
          <div className="bg-primary/5 rounded-lg p-3 mb-5">
            <div className="flex items-start gap-2">
              <MercorLogoMark size={20} />
              <div>
                <p className="text-xs text-foreground font-medium mb-0.5">
                  Quality annotation completed
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Your expert evaluation helps train better AI agents. This is the kind of nuanced feedback that LLMs can't provide on their own.
                </p>
              </div>
            </div>
          </div>

          {/* Action button */}
          <Button onClick={onClose} className="w-full mercor-gradient border-0 h-9">
            Review Annotations
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
