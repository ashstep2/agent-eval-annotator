// Action types that an agent can perform
export type ActionType =
  | 'click'
  | 'type'
  | 'scroll'
  | 'tool_call'
  | 'navigate'
  | 'wait'
  | 'select'
  | 'hover'
  | 'key_press';

// Base action interface
interface BaseAction {
  type: ActionType;
  timestamp: string;
}

// Specific action interfaces
export interface ClickAction extends BaseAction {
  type: 'click';
  coordinates: { x: number; y: number };
  element?: string; // CSS selector or description
  button?: 'left' | 'right' | 'middle';
}

export interface TypeAction extends BaseAction {
  type: 'type';
  text: string;
  element?: string;
}

export interface ScrollAction extends BaseAction {
  type: 'scroll';
  direction: 'up' | 'down' | 'left' | 'right';
  amount: number; // pixels or "page"
  element?: string;
}

export interface ToolCallAction extends BaseAction {
  type: 'tool_call';
  toolName: string;
  arguments: Record<string, unknown>;
  result?: unknown;
}

export interface NavigateAction extends BaseAction {
  type: 'navigate';
  url: string;
}

export interface WaitAction extends BaseAction {
  type: 'wait';
  duration: number; // milliseconds
  condition?: string; // e.g., "element visible"
}

export interface SelectAction extends BaseAction {
  type: 'select';
  element: string;
  value: string;
}

export interface HoverAction extends BaseAction {
  type: 'hover';
  coordinates: { x: number; y: number };
  element?: string;
}

export interface KeyPressAction extends BaseAction {
  type: 'key_press';
  key: string; // e.g., "Enter", "Tab", "Escape"
  modifiers?: ('ctrl' | 'alt' | 'shift' | 'meta')[];
}

// Union of all action types
export type AgentAction =
  | ClickAction
  | TypeAction
  | ScrollAction
  | ToolCallAction
  | NavigateAction
  | WaitAction
  | SelectAction
  | HoverAction
  | KeyPressAction;

// A single step in an agent's trajectory
export interface AgentStep {
  id: string;
  stepNumber: number;

  // The agent's internal reasoning/thinking
  reasoning: string;

  // The action taken
  action: AgentAction;

  // Optional screenshot (base64 or URL)
  screenshot?: string;

  // What happened after the action (page state, response, etc.)
  observation: string;

  // Timing information
  startTime: string;
  endTime: string;
  durationMs: number;

  // Optional metadata
  metadata?: {
    pageUrl?: string;
    pageTitle?: string;
    viewport?: { width: number; height: number };
    [key: string]: unknown;
  };
}

// Task definition with evaluation rubric
export interface TaskDefinition {
  id: string;
  instruction: string;
  context?: string; // Additional context about the task
  category: string; // e.g., "web_navigation", "data_extraction", "form_filling"
  difficulty: 'easy' | 'medium' | 'hard';
  expectedOutcome?: string;
  rubric: RubricItem[];
  maxSteps?: number; // Expected maximum steps
  timeLimit?: number; // Expected time limit in seconds
}

// A single criterion in the evaluation rubric
export interface RubricItem {
  id: string;
  criterion: string;
  description: string;
  weight: number; // 0-1, should sum to 1 across all items
  category: 'correctness' | 'efficiency' | 'safety' | 'reasoning' | 'robustness';
  scoringGuidelines: {
    score: number;
    description: string;
  }[];
}

// Status of a trajectory
export type TrajectoryStatus =
  | 'success'
  | 'failure'
  | 'partial'
  | 'timeout'
  | 'error';

// Complete agent trajectory
export interface AgentTrajectory {
  id: string;
  taskDefinition: TaskDefinition;
  steps: AgentStep[];

  // Timing
  startTime: string;
  endTime: string;
  totalDurationMs: number;

  // Outcome
  status: TrajectoryStatus;
  finalOutcome?: string;
  errorMessage?: string;

  // Agent metadata
  agentInfo: {
    name: string;
    version: string;
    model?: string;
  };

  // Environment info
  environment?: {
    browser?: string;
    viewport?: { width: number; height: number };
    [key: string]: unknown;
  };
}

// Rubric score data for a single criterion
export interface RubricScoreData {
  score: number;
  justification: string;
}

// Annotation flags for common issues
export type AnnotationFlag =
  | 'suboptimal_action'     // Action worked but wasn't ideal
  | 'unnecessary_step'      // Step wasn't needed
  | 'incorrect_reasoning'   // Reasoning was flawed
  | 'hallucination'         // Agent claimed something false
  | 'safety_concern'        // Potential security/privacy issue
  | 'missed_opportunity'    // Agent missed a better approach
  | 'excellent_reasoning'   // Notably good reasoning
  | 'creative_solution'     // Novel approach
  | 'recovery_success'      // Good error recovery
  | 'loop_detected'         // Agent stuck in a loop
  | 'wrong_element'         // Clicked/interacted with wrong element
  | 'premature_action';     // Acted before fully loading/ready

// Annotation for a single step
export interface StepAnnotation {
  stepId: string;

  // Rating 1-5
  rating: number;

  // Reasoning quality (was the thinking sound?)
  reasoningQuality: number; // 1-5

  // Action appropriateness (was it the right action?)
  actionQuality: number; // 1-5

  // Annotator's explanation
  reasoning: string;

  // Quick flags for common patterns
  flags: AnnotationFlag[];

  // Free-form notes
  notes?: string;

  // Time spent on this annotation
  annotationDurationMs?: number;
}

// Complete annotation for a trajectory
export interface Annotation {
  id: string;
  trajectoryId: string;
  annotatorId: string;

  // Per-step annotations
  stepAnnotations: StepAnnotation[];

  // Rubric scores
  rubricScores: {
    rubricItemId: string;
    score: number;
    justification: string;
  }[];

  // Overall assessment
  overallScore: number; // 1-5 or 1-10
  overallNotes: string;

  // Was the task completed successfully?
  taskCompleted: boolean;

  // Would you trust this agent with this task?
  trustScore: number; // 1-5

  // Timestamps
  startedAt: string;
  completedAt?: string;

  // Quality flags for the whole trajectory
  trajectoryFlags: AnnotationFlag[];
}

