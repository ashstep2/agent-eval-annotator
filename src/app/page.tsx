'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { StepTimeline, StepDetail, RubricPanel } from '@/components/annotation';
import { WelcomeModal, CompletionModal } from '@/components/onboarding';
import { RUBRIC_CATEGORIES } from '@/lib/constants';
import { sampleTrajectory, sampleAnnotation } from '@/lib/mock-data';
import { StepAnnotation, RubricScoreData } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { MercorLogoMark } from '@/components/brand/MercorLogo';
import { Info, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function AnnotationPage() {
  const trajectory = sampleTrajectory;
  const [currentStepId, setCurrentStepId] = useState(trajectory.steps[0].id);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const [hasShownCompletion, setHasShownCompletion] = useState(false);
  const [showSubmitNotification, setShowSubmitNotification] = useState(false);

  // Initialize step annotations from sample data
  const [stepAnnotations, setStepAnnotations] = useState<Map<string, StepAnnotation>>(
    () => {
      const map = new Map<string, StepAnnotation>();
      sampleAnnotation.stepAnnotations.forEach((annotation) => {
        map.set(annotation.stepId, annotation);
      });
      return map;
    }
  );

  // Initialize rubric scores from sample data
  const [rubricScores, setRubricScores] = useState<Map<string, RubricScoreData>>(
    () => {
      const map = new Map<string, RubricScoreData>();
    sampleAnnotation.rubricScores.forEach((score) => {
      map.set(score.rubricItemId, {
        score: score.score,
        justification: score.justification,
      });
    });
    return map;
  });

  // Track if user has made changes (for unsaved warning)
  const hasUnsavedChanges = useMemo(() => {
    // Check if any annotations differ from initial sample data
    const initialAnnotationCount = sampleAnnotation.stepAnnotations.length;
    const currentAnnotationCount = stepAnnotations.size;

    // If counts differ, there are changes
    if (currentAnnotationCount !== initialAnnotationCount) return true;

    return false;
  }, [stepAnnotations]);

  // Check if annotation is complete
  const isAnnotationComplete = useMemo(() => {
    // All steps must have a rating > 0
    const allStepsAnnotated = trajectory.steps.every((step) => {
      const annotation = stepAnnotations.get(step.id);
      return annotation && annotation.rating > 0;
    });

    // All rubric categories must have a score > 0
    const allRubricScored = RUBRIC_CATEGORIES.every((category) => {
      const score = rubricScores.get(category);
      return score && score.score > 0;
    });

    return allStepsAnnotated && allRubricScored;
  }, [trajectory.steps, stepAnnotations, rubricScores]);

  // Show completion modal when annotation is complete (only once)
  useEffect(() => {
    if (isAnnotationComplete && !hasShownCompletion && !showWelcome) {
      setShowCompletion(true);
      setHasShownCompletion(true);
    }
  }, [isAnnotationComplete, hasShownCompletion, showWelcome]);

  // Warn user before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const currentStep = trajectory.steps.find((s) => s.id === currentStepId);
  const currentStepIndex = trajectory.steps.findIndex((s) => s.id === currentStepId);

  const handleStepSelect = useCallback((stepId: string) => {
    setCurrentStepId(stepId);
  }, []);

  const handleAnnotationChange = useCallback((annotation: StepAnnotation) => {
    setStepAnnotations((prev) => {
      const next = new Map(prev);
      next.set(annotation.stepId, annotation);
      return next;
    });
  }, []);

  const handleRubricScoreChange = useCallback(
    (rubricItemId: string, score: number, justification: string) => {
      setRubricScores((prev) => {
        const next = new Map(prev);
        next.set(rubricItemId, { score, justification });
        return next;
      });
    },
    []
  );

  const goToPreviousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepId(trajectory.steps[currentStepIndex - 1].id);
    }
  }, [currentStepIndex, trajectory.steps]);

  const goToNextStep = useCallback(() => {
    if (currentStepIndex < trajectory.steps.length - 1) {
      setCurrentStepId(trajectory.steps[currentStepIndex + 1].id);
    }
  }, [currentStepIndex, trajectory.steps]);

  const handleSubmit = useCallback(() => {
    setShowSubmitNotification(true);
    setTimeout(() => setShowSubmitNotification(false), 3000);
  }, []);

  if (!currentStep) {
    return <div>Step not found</div>;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-screen flex-col overflow-hidden bg-background p-3">
        {/* Welcome Modal */}
        {showWelcome && (
          <WelcomeModal onClose={() => setShowWelcome(false)} />
        )}

        {/* Completion Modal */}
        {showCompletion && (
          <CompletionModal
            onClose={() => setShowCompletion(false)}
            stepAnnotations={stepAnnotations}
            rubricScores={rubricScores}
            totalSteps={trajectory.steps.length}
          />
        )}

        {/* Submit Notification Toast */}
        {showSubmitNotification && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg shadow-lg">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">Annotation submitted successfully!</span>
            </div>
          </div>
        )}

        {/* Main container with rounded corners */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border/30 bg-white shadow-sm">
          {/* Compact Header */}
          <header className="border-b border-border/30 px-4 py-2">
            <div className="flex items-center justify-between">
              {/* Left: Logo + Task */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Logo */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <MercorLogoMark size={24} />
                  <span className="text-sm font-semibold text-foreground hidden sm:inline">
                    Mercor
                  </span>
                  <span className="text-sm text-muted-foreground font-light hidden sm:inline">|</span>
                  <span className="text-sm font-medium text-primary hidden sm:inline">
                    AgentEval
                  </span>
                </div>

                <div className="w-px h-6 bg-border/50 hidden md:block" />

                {/* Task instruction */}
                <p className="text-sm text-foreground truncate">
                  {trajectory.taskDefinition.instruction}
                </p>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setShowWelcome(true)}
                    >
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>About this demo</TooltipContent>
                </Tooltip>

                <Button
                  size="sm"
                  className="h-7 mercor-gradient border-0 text-xs"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </div>
            </div>
          </header>

          {/* Main content - 3 panel layout */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left sidebar - Step Timeline */}
            <aside className="w-[260px] border-r border-border/30 overflow-hidden flex-shrink-0">
              <StepTimeline
                steps={trajectory.steps}
                currentStepId={currentStepId}
                onStepSelect={handleStepSelect}
                stepAnnotations={stepAnnotations}
              />
            </aside>

            {/* Main area - Step Detail + Annotation */}
            <main className="flex-1 overflow-hidden min-w-0">
              <StepDetail
                step={currentStep}
                annotation={stepAnnotations.get(currentStepId)}
                onAnnotationChange={handleAnnotationChange}
                onPrevious={goToPreviousStep}
                onNext={goToNextStep}
                hasPrevious={currentStepIndex > 0}
                hasNext={currentStepIndex < trajectory.steps.length - 1}
                stepIndex={currentStepIndex}
                totalSteps={trajectory.steps.length}
              />
            </main>

            {/* Right sidebar - Rubric */}
            <aside className="w-[300px] border-l border-border/30 overflow-hidden flex-shrink-0">
              <RubricPanel
                rubric={trajectory.taskDefinition.rubric}
                scores={rubricScores}
                onScoreChange={handleRubricScoreChange}
              />
            </aside>
          </div>
        </div>

        {/* Attribution footer - moved outside main container */}
        <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-muted-foreground">
          <a
            href="https://github.com/ashkastephen/agent-eval-annotator"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </a>
          <span className="text-border/50">|</span>
          <a
            href="https://mercor.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            Built for Mercor
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </div>
      </div>
    </TooltipProvider>
  );
}
