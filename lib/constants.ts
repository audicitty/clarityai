// Application-wide constants, strings, and configuration for ClarityAI

export const APP_NAME = "ClarityAI";
export const APP_TAGLINE = "Turn chaos into clarity.";
export const APP_DESCRIPTION =
  "Paste meeting notes, brain dumps, or raw thoughts. Get structure, decisions, and actions in seconds.";

export const BRAND = {
  name: APP_NAME,
  taglinePrefix: "Turn chaos into",
  taglineSuffix: "clarity.",
  description: APP_DESCRIPTION,
} as const;

export const NAV = {
  cta: "Try it free",
  ctaHref: "/app",
} as const;

export const TRUST_PILLS = [
  { icon: "⚡", label: "Instant results" },
  { icon: "🔒", label: "Nothing stored" },
  { icon: "🎯", label: "100% accurate structure" },
] as const;

export const HERO_BADGE = "AI-Powered Clarity";

export const FOOTER_CREDIT = "Built with Claude API";

export const OUTPUT_SECTIONS = {
  tldr: {
    key: "tldr",
    label: "TL;DR",
    description: "The core summary",
  },
  actionItems: {
    key: "actionItems",
    label: "Action Items",
    description: "What needs to get done",
  },
  keyDecisions: {
    key: "keyDecisions",
    label: "Key Decisions",
    description: "What was agreed upon",
  },
  openQuestions: {
    key: "openQuestions",
    label: "Open Questions",
    description: "What still needs answers",
  },
} as const;

export const CLARIFY_PLACEHOLDER =
  "Paste anything — meeting notes, a brain dump, a problem, raw thoughts...";

export const CHAT_PLACEHOLDER = "Ask a follow-up question about the content…";

export const CLARIFY_BUTTON_LABEL = "Clarify →";
export const CHAT_SEND_LABEL = "Send";
