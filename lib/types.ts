// Shared TypeScript interfaces used across the ClarityAI application

/** Structured output produced by the Anthropic clarify action */
export interface ClarityOutput {
  tldr: string;
  actionItems: string[];
  keyDecisions: string[];
  openQuestions: string[];
}

/** Discriminated union returned by server actions */
export interface ActionSuccess<T> {
  success: true;
  data: T;
}

export interface ActionError {
  success: false;
  error: string;
}

export type ActionResult<T> = ActionSuccess<T> | ActionError;
