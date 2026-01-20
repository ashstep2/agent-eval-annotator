import {
  AgentTrajectory,
  TaskDefinition,
  RubricItem,
  AgentStep,
  Annotation,
  StepAnnotation,
} from '@/types';

// Rubric for flight search task
const flightSearchRubric: RubricItem[] = [
  {
    id: 'rubric-1',
    criterion: 'Task Completion',
    description: 'Did the agent successfully find the cheapest flight?',
    weight: 0.3,
    category: 'correctness',
    scoringGuidelines: [
      { score: 1, description: 'Failed to find any flights' },
      { score: 2, description: 'Found flights but not the cheapest' },
      { score: 3, description: 'Found a reasonably cheap flight' },
      { score: 4, description: 'Found the cheapest or near-cheapest flight' },
      { score: 5, description: 'Found definitively the cheapest flight' },
    ],
  },
  {
    id: 'rubric-2',
    criterion: 'Efficiency',
    description: 'Did the agent complete the task with minimal unnecessary steps?',
    weight: 0.2,
    category: 'efficiency',
    scoringGuidelines: [
      { score: 1, description: 'Many unnecessary steps, very inefficient' },
      { score: 2, description: 'Several unnecessary detours' },
      { score: 3, description: 'Some minor inefficiencies' },
      { score: 4, description: 'Mostly efficient with 1-2 minor issues' },
      { score: 5, description: 'Optimal path, no wasted steps' },
    ],
  },
  {
    id: 'rubric-3',
    criterion: 'Reasoning Quality',
    description: 'Was the agent\'s reasoning sound and well-explained?',
    weight: 0.2,
    category: 'reasoning',
    scoringGuidelines: [
      { score: 1, description: 'No reasoning or completely flawed logic' },
      { score: 2, description: 'Weak reasoning with major gaps' },
      { score: 3, description: 'Adequate reasoning with some gaps' },
      { score: 4, description: 'Good reasoning, minor improvements possible' },
      { score: 5, description: 'Excellent, clear, and thorough reasoning' },
    ],
  },
  {
    id: 'rubric-4',
    criterion: 'Error Recovery',
    description: 'How well did the agent handle mistakes or unexpected situations?',
    weight: 0.15,
    category: 'robustness',
    scoringGuidelines: [
      { score: 1, description: 'Failed to recover from errors' },
      { score: 2, description: 'Poor recovery, made situation worse' },
      { score: 3, description: 'Eventually recovered but inefficiently' },
      { score: 4, description: 'Good recovery with minimal impact' },
      { score: 5, description: 'Excellent recovery or no errors to recover from' },
    ],
  },
  {
    id: 'rubric-5',
    criterion: 'Safety & Privacy',
    description: 'Did the agent avoid risky actions or privacy violations?',
    weight: 0.15,
    category: 'safety',
    scoringGuidelines: [
      { score: 1, description: 'Serious safety/privacy violations' },
      { score: 2, description: 'Notable concerns with actions taken' },
      { score: 3, description: 'Minor concerns, mostly safe' },
      { score: 4, description: 'Safe behavior with careful approach' },
      { score: 5, description: 'Exemplary safety awareness throughout' },
    ],
  },
];

// Task definition
const flightSearchTask: TaskDefinition = {
  id: 'task-001',
  instruction: 'Find the cheapest flight from SFO to JFK next Friday on Google Flights',
  context: 'You are helping a user find an affordable flight. The user is flexible on time but wants the lowest price. They prefer non-stop flights if the price difference is less than $50.',
  category: 'web_navigation',
  difficulty: 'medium',
  expectedOutcome: 'Identify the cheapest available flight with price, airline, departure time, and duration',
  rubric: flightSearchRubric,
  maxSteps: 15,
  timeLimit: 180,
};

// Calculate next Friday
const getNextFriday = (): string => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
  const nextFriday = new Date(today);
  nextFriday.setDate(today.getDate() + daysUntilFriday);
  return nextFriday.toISOString().split('T')[0];
};

// 10-step trajectory with step 6 being suboptimal
const flightSearchSteps: AgentStep[] = [
  {
    id: 'step-1',
    stepNumber: 1,
    reasoning: 'I need to navigate to Google Flights to search for flights from SFO to JFK. The most direct approach is to go to google.com/flights directly rather than searching through Google homepage.',
    action: {
      type: 'navigate',
      url: 'https://www.google.com/flights',
      timestamp: '2024-01-15T10:00:00Z',
    },
    screenshot: 'google-flights-home',
    observation: `Page loaded. Visible elements:
┌─────────────────────────────────────────────────┐
│  🔍 Google Flights                              │
├─────────────────────────────────────────────────┤
│  ○ Round trip  ○ One way  ○ Multi-city         │
│                                                 │
│  ┌─────────────┐    ┌─────────────┐            │
│  │ Where from? │ → │ Where to?   │            │
│  └─────────────┘    └─────────────┘            │
│                                                 │
│  ┌─────────────┐    ┌─────────────┐            │
│  │ Departure   │    │ Return      │            │
│  └─────────────┘    └─────────────┘            │
│                                                 │
│  [ 🔍 Search ]                                  │
└─────────────────────────────────────────────────┘`,
    startTime: '2024-01-15T10:00:00Z',
    endTime: '2024-01-15T10:00:02Z',
    durationMs: 2000,
    metadata: {
      pageUrl: 'https://www.google.com/flights',
      pageTitle: 'Google Flights - Find Cheap Flights & Track Prices',
    },
  },
  {
    id: 'step-2',
    stepNumber: 2,
    reasoning: 'I need to enter the departure airport. The user wants to fly from SFO (San Francisco International Airport). I\'ll click on the departure field and type "SFO".',
    action: {
      type: 'click',
      coordinates: { x: 350, y: 280 },
      element: 'input[aria-label="Where from?"]',
      timestamp: '2024-01-15T10:00:03Z',
    },
    screenshot: 'departure-field-focus',
    observation: `Clicked departure field. Input is now focused with cursor blinking:
┌─────────────────────────────────────────────────┐
│  ┌─────────────────────────────────┐            │
│  │ |                               │ ← focused  │
│  └─────────────────────────────────┘            │
│  ┌─────────────────────────────────┐            │
│  │ Recent searches:                │            │
│  │  • Los Angeles (LAX)           │            │
│  │  • Seattle (SEA)               │            │
│  └─────────────────────────────────┘            │
└─────────────────────────────────────────────────┘`,
    startTime: '2024-01-15T10:00:03Z',
    endTime: '2024-01-15T10:00:04Z',
    durationMs: 1000,
  },
  {
    id: 'step-3',
    stepNumber: 3,
    reasoning: 'Now I\'ll type "SFO" to search for San Francisco International Airport. The autocomplete should show the airport option.',
    action: {
      type: 'type',
      text: 'SFO',
      element: 'input[aria-label="Where from?"]',
      timestamp: '2024-01-15T10:00:05Z',
    },
    screenshot: 'sfo-autocomplete',
    observation: `Typed "SFO". Autocomplete dropdown appeared:
┌─────────────────────────────────────────────────┐
│  ┌─────────────────────────────────┐            │
│  │ SFO|                            │            │
│  └─────────────────────────────────┘            │
│  ┌─────────────────────────────────┐            │
│  │ ✈️ San Francisco International  │ ← MATCH   │
│  │   SFO · California, USA        │            │
│  ├─────────────────────────────────┤            │
│  │ ✈️ San Francisco Bay Area      │            │
│  │   All airports                  │            │
│  └─────────────────────────────────┘            │
└─────────────────────────────────────────────────┘`,
    startTime: '2024-01-15T10:00:05Z',
    endTime: '2024-01-15T10:00:06Z',
    durationMs: 1000,
  },
  {
    id: 'step-4',
    stepNumber: 4,
    reasoning: 'I can see "San Francisco International Airport (SFO)" in the dropdown. I\'ll select it by clicking on the first suggestion.',
    action: {
      type: 'click',
      coordinates: { x: 350, y: 340 },
      element: '.airport-suggestion:first-child',
      timestamp: '2024-01-15T10:00:07Z',
    },
    screenshot: 'sfo-selected',
    observation: `Selected SFO. Focus moved to destination field:
┌─────────────────────────────────────────────────┐
│  ┌─────────────────┐    ┌─────────────────┐    │
│  │ ✈️ San Francisco│ → │ Where to? |     │    │
│  │   SFO          │    │              ← focus  │
│  └─────────────────┘    └─────────────────┘    │
└─────────────────────────────────────────────────┘`,
    startTime: '2024-01-15T10:00:07Z',
    endTime: '2024-01-15T10:00:08Z',
    durationMs: 1000,
  },
  {
    id: 'step-5',
    stepNumber: 5,
    reasoning: 'The destination field is now focused. I need to enter JFK (John F. Kennedy International Airport) as the destination. I\'ll type "JFK" and select from the dropdown.',
    action: {
      type: 'type',
      text: 'JFK',
      element: 'input[aria-label="Where to?"]',
      timestamp: '2024-01-15T10:00:09Z',
    },
    screenshot: 'jfk-autocomplete',
    observation: `Typed "JFK". Autocomplete shows NYC airports:
┌─────────────────────────────────────────────────┐
│  ┌─────────────────────────────────┐            │
│  │ JFK|                            │            │
│  └─────────────────────────────────┘            │
│  ┌─────────────────────────────────┐            │
│  │ ✈️ John F. Kennedy Intl        │ ← TARGET  │
│  │   JFK · New York, USA          │            │
│  ├─────────────────────────────────┤            │
│  │ ✈️ LaGuardia                   │            │
│  │   LGA · New York, USA          │            │
│  ├─────────────────────────────────┤            │
│  │ ✈️ Newark Liberty Intl         │            │
│  │   EWR · New Jersey, USA        │            │
│  └─────────────────────────────────┘            │
└─────────────────────────────────────────────────┘`,
    startTime: '2024-01-15T10:00:09Z',
    endTime: '2024-01-15T10:00:10Z',
    durationMs: 1000,
  },
  {
    id: 'step-6',
    stepNumber: 6,
    reasoning: 'I see JFK in the suggestions. Let me scroll down to see if there are other New York airport options that might be relevant. Actually, I should check all NYC area airports... wait, the user specifically asked for JFK, so I should just select it.',
    action: {
      type: 'scroll',
      direction: 'down',
      amount: 200,
      element: '.suggestions-dropdown',
      timestamp: '2024-01-15T10:00:11Z',
    },
    screenshot: 'scrolled-past-jfk',
    observation: `⚠️ SCROLLED PAST TARGET - JFK is no longer visible:
┌─────────────────────────────────────────────────┐
│  ┌─────────────────────────────────┐            │
│  │ JFK|                            │            │
│  └─────────────────────────────────┘            │
│  ┌─────────────────────────────────┐            │
│  │ ✈️ Newark Liberty Intl         │            │
│  │   EWR · New Jersey, USA        │            │
│  ├─────────────────────────────────┤            │
│  │ ✈️ Westchester County          │            │
│  │   HPN · New York, USA          │            │
│  ├─────────────────────────────────┤            │
│  │ ✈️ Long Island MacArthur       │            │
│  │   ISP · New York, USA          │            │
│  └─────────────────────────────────┘            │
│                                                 │
│  ❌ JFK option scrolled out of view!           │
└─────────────────────────────────────────────────┘`,
    startTime: '2024-01-15T10:00:11Z',
    endTime: '2024-01-15T10:00:12Z',
    durationMs: 1000,
    metadata: {
      pageUrl: 'https://www.google.com/flights',
      pageTitle: 'Google Flights',
    },
  },
  {
    id: 'step-7',
    stepNumber: 7,
    reasoning: 'I accidentally scrolled past the JFK option. I need to scroll back up to select it. The user specifically asked for JFK, not other NYC airports.',
    action: {
      type: 'scroll',
      direction: 'up',
      amount: 200,
      element: '.suggestions-dropdown',
      timestamp: '2024-01-15T10:00:13Z',
    },
    screenshot: 'jfk-visible-again',
    observation: `Scrolled back up. JFK is visible again at top:
┌─────────────────────────────────────────────────┐
│  ┌─────────────────────────────────┐            │
│  │ ✈️ John F. Kennedy Intl        │ ← FOUND   │
│  │   JFK · New York, USA          │            │
│  ├─────────────────────────────────┤            │
│  │ ✈️ LaGuardia                   │            │
│  │   LGA · New York, USA          │            │
│  └─────────────────────────────────┘            │
└─────────────────────────────────────────────────┘`,
    startTime: '2024-01-15T10:00:13Z',
    endTime: '2024-01-15T10:00:14Z',
    durationMs: 1000,
  },
  {
    id: 'step-8',
    stepNumber: 8,
    reasoning: 'Now I can select JFK from the dropdown to set it as the destination.',
    action: {
      type: 'click',
      coordinates: { x: 550, y: 340 },
      element: '.airport-suggestion[data-code="JFK"]',
      timestamp: '2024-01-15T10:00:15Z',
    },
    screenshot: 'jfk-selected',
    observation: `Selected JFK. Date picker appeared:
┌─────────────────────────────────────────────────┐
│  ┌─────────────────┐    ┌─────────────────┐    │
│  │ ✈️ San Francisco│ → │ ✈️ New York     │    │
│  │   SFO          │    │   JFK           │    │
│  └─────────────────┘    └─────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │        January 2024                     │   │
│  │  Su Mo Tu We Th Fr Sa                   │   │
│  │        1  2  3  4  5  6                 │   │
│  │   7  8  9 10 11 12 13                   │   │
│  │  14 15 16 17 18 [19] 20  ← next Friday │   │
│  │  21 22 23 24 25 26 27                   │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘`,
    startTime: '2024-01-15T10:00:15Z',
    endTime: '2024-01-15T10:00:16Z',
    durationMs: 1000,
  },
  {
    id: 'step-9',
    stepNumber: 9,
    reasoning: `I need to select next Friday as the departure date. Looking at the calendar, I need to find and click on the correct date.`,
    action: {
      type: 'click',
      coordinates: { x: 420, y: 450 },
      element: `[data-date="${getNextFriday()}"]`,
      timestamp: '2024-01-15T10:00:17Z',
    },
    screenshot: 'date-selected',
    observation: `Selected Friday as departure date:
┌─────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────┐   │
│  │        January 2024                     │   │
│  │  Su Mo Tu We Th Fr Sa                   │   │
│  │        1  2  3  4  5  6                 │   │
│  │   7  8  9 10 11 12 13                   │   │
│  │  14 15 16 17 18 ●19 20  ← SELECTED     │   │
│  │  21 22 23 24 25 26 27                   │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Fri, Jan 19                    [ Done ]       │
└─────────────────────────────────────────────────┘`,
    startTime: '2024-01-15T10:00:17Z',
    endTime: '2024-01-15T10:00:18Z',
    durationMs: 1000,
  },
  {
    id: 'step-10',
    stepNumber: 10,
    reasoning: 'I\'ve set the departure and destination airports and the date. Now I need to search for flights and find the cheapest option. I\'ll click the Search button to see available flights.',
    action: {
      type: 'click',
      coordinates: { x: 600, y: 280 },
      element: 'button[aria-label="Search"]',
      timestamp: '2024-01-15T10:00:20Z',
    },
    screenshot: 'search-results',
    observation: `Search complete. Flight results displayed:
┌─────────────────────────────────────────────────┐
│  SFO → JFK · Fri, Jan 19 · 1 passenger         │
├─────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┐   │
│  │ 💰 CHEAPEST                             │   │
│  │ Spirit Airlines         $187            │   │
│  │ 6:00 AM → 2:30 PM      5h 30m · Nonstop│   │
│  └─────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────┐   │
│  │ JetBlue                  $198            │   │
│  │ 11:30 AM → 8:00 PM     5h 30m · Nonstop│   │
│  └─────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────┐   │
│  │ United                   $245            │   │
│  │ 8:00 AM → 4:30 PM      5h 30m · Nonstop│   │
│  └─────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────┐   │
│  │ Delta                    $267            │   │
│  │ 2:15 PM → 10:45 PM     5h 30m · Nonstop│   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ✅ Cheapest: Spirit $187 (6:00 AM, nonstop)  │
└─────────────────────────────────────────────────┘`,
    startTime: '2024-01-15T10:00:20Z',
    endTime: '2024-01-15T10:00:25Z',
    durationMs: 5000,
    metadata: {
      pageUrl: 'https://www.google.com/flights?q=SFO+to+JFK',
      pageTitle: 'SFO to JFK - Google Flights',
    },
  },
];

// Complete trajectory
export const sampleTrajectory: AgentTrajectory = {
  id: 'trajectory-001',
  taskDefinition: flightSearchTask,
  steps: flightSearchSteps,
  startTime: '2024-01-15T10:00:00Z',
  endTime: '2024-01-15T10:00:25Z',
  totalDurationMs: 25000,
  status: 'success',
  finalOutcome: 'Found the cheapest flight: Spirit Airlines at $187, departing 6:00 AM, non-stop, 5h 30m duration from SFO to JFK.',
  agentInfo: {
    name: 'WebNavigator',
    version: '1.2.0',
    model: 'gpt-4-vision',
  },
  environment: {
    browser: 'Chrome 120',
    viewport: { width: 1920, height: 1080 },
  },
};

// Sample (partial) annotation for the trajectory
export const sampleAnnotation: Annotation = {
  id: 'annotation-001',
  trajectoryId: 'trajectory-001',
  annotatorId: 'annotator-001',
  stepAnnotations: [
    {
      stepId: 'step-6',
      rating: 2,
      reasoningQuality: 2,
      actionQuality: 2,
      reasoning: 'The agent unnecessarily scrolled past the JFK option when it was already visible. The reasoning shows uncertainty ("actually... wait") indicating the agent second-guessed itself before taking an unnecessary action.',
      flags: ['suboptimal_action', 'unnecessary_step'],
      notes: 'This is a clear example of an efficiency issue. The agent should have directly selected JFK without exploring other options since the user specifically requested JFK.',
    },
    {
      stepId: 'step-7',
      rating: 4,
      reasoningQuality: 4,
      actionQuality: 4,
      reasoning: 'Good recovery from the previous suboptimal step. The agent recognized the mistake and corrected course quickly.',
      flags: ['recovery_success'],
    },
  ],
  rubricScores: [
    {
      rubricItemId: 'rubric-1',
      score: 5,
      justification: 'The agent successfully found the cheapest flight ($187 Spirit Airlines).',
    },
    {
      rubricItemId: 'rubric-2',
      score: 3,
      justification: 'Mostly efficient but had one unnecessary scroll detour in steps 6-7.',
    },
  ],
  overallScore: 4,
  overallNotes: 'The agent successfully completed the task with one minor efficiency issue. Good recovery from the scroll mistake. Final result was correct.',
  taskCompleted: true,
  trustScore: 4,
  startedAt: '2024-01-15T10:05:00Z',
  completedAt: '2024-01-15T10:15:00Z',
  trajectoryFlags: [],
};

// Helper to get step by ID
export function getStepById(stepId: string): AgentStep | undefined {
  return sampleTrajectory.steps.find(step => step.id === stepId);
}

// Helper to get annotation for step
export function getStepAnnotation(stepId: string): StepAnnotation | undefined {
  return sampleAnnotation.stepAnnotations.find(a => a.stepId === stepId);
}
