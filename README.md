# AgentEval: Multi-Turn Agent Trajectory Annotation System

> **TL;DR:** An annotation interface that helps human experts evaluate AI agent decision-making step-by-step, with a streamlined UI optimized for annotation quality and efficiency.

> **For Mercor:** This demo directly addresses the PM scope of *"building interfaces that reduce AHT for thousands of experts"* and *"scaling production of frontier data types."*

---

## What This Is

**AgentEval** is a specialized annotation tool for evaluating AI agent trajectories—the multi-step reasoning and action sequences that AI agents produce when completing tasks like browsing the web, using tools, or executing workflows.

**In 30 seconds:** Watch an AI agent try to book a flight, rate each decision it makes, flag when it makes mistakes, and score its overall performance against a rubric.

---

## Why This Matters Now

### The Training Data Bottleneck

AI labs are racing to build agents that can reason and act autonomously. But there's a critical bottleneck: **we can't just evaluate final outputs anymore**—we need to evaluate every decision an agent makes along the way.

| Old Paradigm | New Paradigm |
|-------------|--------------|
| "Is this answer correct?" | "Was each reasoning step sound?" |
| Single-turn evaluation | Multi-turn trajectory analysis |
| Output quality | Process quality |
| LLM-as-judge works well | Human expertise required |

### Why Human Experts Matter

LLM-as-judge approaches fail for agent trajectories because:

1. **Reasoning subtlety** — A step can be *technically correct* but *strategically suboptimal*
2. **Real-world context** — Humans know "that button doesn't actually work" or "this site has a faster path"
3. **Safety nuance** — Distinguishing clever from dangerous requires judgment
4. **Error propagation** — One bad step cascades; humans catch root causes

**Expert network is the moat.** The annotation tooling is the leverage.

---

## What This Demo Shows

### The Interface

A clean 3-panel layout optimized for annotation speed:

| Panel | Purpose |
|-------|---------|
| **Left: Timeline** | Navigate steps, see annotation status, Step 6 highlighted as demo focus |
| **Center: Step Detail** | Reasoning + Action side-by-side, collapsible Observation, annotation controls |
| **Right: Rubric** | Score against evaluation criteria with weighted metrics |

### Annotation Workflow

The welcome modal guides users through the 3-step workflow:

1. **Select step** — Click through the timeline to review each agent decision
2. **Rate & flag** — Provide overall, reasoning, and action ratings; flag issues or positives
3. **Score rubric** — Evaluate the full trajectory against weighted criteria

### Key Demo Feature: Step 6

The demo includes an **intentionally suboptimal decision** at Step 6:
- The agent scrolled past the correct option
- Had to scroll back up to find it
- This is exactly the kind of subtle inefficiency that humans catch and LLMs miss

**Step 6 is visually highlighted** in the timeline with an amber "Demo" badge so you can find it immediately.

### UI Design Principles

- **Reasoning + Action together** — The two most important pieces of context are always visible side-by-side
- **Observation on demand** — Collapsible to reduce cognitive load when not needed
- **Minimal chrome** — Clean borders, subtle shadows, focus on content
- **Clear visual hierarchy** — Status indicators, color-coded sections, progress tracking

---
## Product Vision: Full Implementation Roadmap

### Phase 1: Core Annotation Platform (This Demo)
- [x] Step-by-step trajectory viewer
- [x] Rating and flag-based annotation
- [x] Rubric-based scoring with weighted criteria
- [x] Clean 3-panel responsive layout
- [x] Welcome modal with workflow guidance
- [x] Demo highlighting (Step 6 visual cue)
- [ ] Screenshot/recording viewer for browser agents

### Phase 2: Quality & Scale Infrastructure
- [ ] **Calibration tasks** — Gold-standard trajectories for annotator training
- [ ] **Dispute resolution workflow** — Handle edge cases systematically
- [ ] **Quality scoring per annotator** — Track reliability over time

### Phase 3: Intelligence Layer
- [ ] **Pre-annotation with LLM** — Auto-flag obvious issues, let humans verify
- [ ] **Suggested annotations** — Learn from expert patterns
- [ ] **Anomaly detection** — Surface trajectories that need extra attention
- [ ] **Expertise matching** — Route tasks to annotators with relevant domain knowledge

### Phase 4: Lab Integration
- [ ] **Trajectory ingestion API** — Accept trajectories from any agent framework
- [ ] **Feedback loops** — Push annotations back to training pipelines
- [ ] **Custom rubric builder** — Labs define their own evaluation criteria

### Key Metrics to Track

| Metric | Why It Matters |
|--------|---------------|
| **AHT (Average Handling Time)** | Directly impacts cost and throughput |
| **Annotations per hour** | Productivity across the network |
| **Inter-annotator agreement** | Quality signal reliability |
| **Time-to-first-annotation** | Onboarding effectiveness |
| **Annotator retention** | Network health |
| **Quality score distribution** | Catch training issues early |

Every 5 seconds saved per annotation × 30,000 experts × thousands of annotations = massive leverage.

---

### Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Project Structure

```
src/
├── app/                        # Next.js app router
│   ├── layout.tsx              # Root layout with fonts
│   ├── page.tsx                # Main annotation page
│   └── globals.css             # Tailwind + Mercor brand colors
├── components/
│   ├── annotation/             # Core annotation UI
│   │   ├── StepTimeline.tsx    # Left panel - step navigation with demo highlight
│   │   ├── StepDetail.tsx      # Center panel - reasoning/action + annotation
│   │   ├── RubricPanel.tsx     # Right panel - rubric scoring
│   │   └── index.ts            # Barrel export
│   ├── brand/
│   │   └── MercorLogo.tsx      # Mercor logo component
│   ├── onboarding/
│   │   ├── WelcomeModal.tsx    # Single-screen welcome with workflow guide
│   │   └── index.ts            # Barrel export
│   └── ui/                     # shadcn/ui components
│       ├── button.tsx
│       ├── scroll-area.tsx
│       ├── textarea.tsx
│       ├── tooltip.tsx
│       └── ...
├── lib/
│   ├── action-utils.tsx        # Action icon/label helpers
│   ├── constants.ts            # App constants (rubric categories, etc.)
│   ├── mock-data.ts            # Sample trajectory + annotations
│   └── utils.ts                # Utility functions (cn, formatTime)
└── types/
    └── index.ts                # TypeScript interfaces
```

### Data Model

```typescript
interface AgentTrajectory {
  id: string;
  taskDefinition: TaskDefinition;
  steps: AgentStep[];          // The trajectory
  status: 'success' | 'failure' | 'partial';
  agentInfo: { name: string; version: string };
}

interface AgentStep {
  id: string;
  stepNumber: number;
  reasoning: string;           // Agent's chain-of-thought
  action: Action;              // What the agent did
  observation: string;         // What happened next
  timestamp: number;
}

interface StepAnnotation {
  stepId: string;
  rating: number;              // 1-5 overall
  reasoningQuality: number;    // 1-5 for reasoning
  actionQuality: number;       // 1-5 for action choice
  flags: AnnotationFlag[];     // Issues or positives
  reasoning: string;           // Annotator notes
}

interface RubricScoreData {
  score: number;               // 1-5
  justification: string;       // Auto-filled from guidelines
}
```

### Annotation Flags

**Issue Flags:**
- `suboptimal_action` — Action works but isn't the best choice
- `unnecessary_step` — Step could be skipped
- `incorrect_reasoning` — Flawed logic in reasoning
- `hallucination` — Agent references non-existent elements
- `wrong_element` — Interacted with wrong UI element
- `safety_concern` — Potentially dangerous action

**Positive Flags:**
- `excellent_reasoning` — Particularly clear/thorough reasoning
- `creative_solution` — Novel approach to the problem
- `recovery_success` — Good recovery from previous error

