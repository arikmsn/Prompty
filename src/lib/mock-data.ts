export type PromptCategory = "visual" | "cinematic" | "logic" | "autonomous";

export interface MockPrompt {
  id: string;
  title: string;
  category: PromptCategory;
  slug: string;
}

export const MOCK_PROMPTS: MockPrompt[] = [
  {
    id: "1",
    title: "Cinematic fire sequence for Kling",
    category: "cinematic",
    slug: "cinematic-fire-sequence-kling",
  },
  {
    id: "2",
    title: "Midjourney v6 architectural visualization",
    category: "visual",
    slug: "midjourney-arch-viz",
  },
  {
    id: "3",
    title: "Claude code review and refactor workflow",
    category: "logic",
    slug: "claude-code-review-refactor",
  },
  {
    id: "4",
    title: "Autonomous research brief with citations",
    category: "autonomous",
    slug: "autonomous-research-brief",
  },
  {
    id: "5",
    title: "Runway Gen-3 character consistency pass",
    category: "visual",
    slug: "runway-gen3-character-consistency",
  },
  {
    id: "6",
    title: "Multi-step data extraction pipeline",
    category: "logic",
    slug: "multi-step-data-extraction",
  },
];
