'use client';

import { Button } from '@/components/ui/button';
import { MercorLogoMark } from '@/components/brand/MercorLogo';
import {
  Bot,
  ArrowRight,
  AlertTriangle,
  X,
  MousePointer2,
  Star,
  Target,
} from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
}

export function WelcomeModal({ onClose }: WelcomeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors z-10"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>

        <div className="p-5">
          {/* Header */}
          <div className="flex items-center gap-2.5 mb-4">
            <MercorLogoMark size={32} />
            <div>
              <h1 className="text-base font-bold text-foreground">
                Mercor AgentEval
              </h1>
              <p className="text-xs text-muted-foreground">
                AI Agent Trajectory Annotation Tool
              </p>
            </div>
          </div>

          {/* Demo scenario callout */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <Bot className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-foreground font-medium mb-1">
                  Demo: &ldquo;Find the cheapest flight from SFO to JFK&rdquo;
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  An AI agent completed this task. Your job: evaluate each step it took.
                </p>
              </div>
            </div>
          </div>

          {/* Step 6 highlight */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-amber-900 font-medium mb-0.5">
                  Look for Step 6
                </p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  The agent made a suboptimal decision here. This is what annotators catch.
                </p>
              </div>
            </div>
          </div>

          {/* Workflow guide */}
          <div className="mb-4">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Workflow
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center text-center p-2 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold mb-1">
                  1
                </div>
                <MousePointer2 className="h-3.5 w-3.5 text-muted-foreground mb-0.5" />
                <p className="text-[10px] font-medium text-foreground">Select step</p>
              </div>
              <div className="flex flex-col items-center text-center p-2 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold mb-1">
                  2
                </div>
                <Star className="h-3.5 w-3.5 text-muted-foreground mb-0.5" />
                <p className="text-[10px] font-medium text-foreground">Rate & flag</p>
              </div>
              <div className="flex flex-col items-center text-center p-2 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold mb-1">
                  3
                </div>
                <Target className="h-3.5 w-3.5 text-muted-foreground mb-0.5" />
                <p className="text-[10px] font-medium text-foreground">Score rubric</p>
              </div>
            </div>
          </div>

          <Button onClick={onClose} className="w-full mercor-gradient border-0 h-9">
            Start Annotating
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
