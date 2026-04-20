// Server action: sends raw text to Gemini and returns structured clarity output

"use server";

import { GoogleGenerativeAI, GoogleGenerativeAIFetchError } from "@google/generative-ai";
import type { ClarityOutput, ActionResult } from "@/lib/types";

// Primary model with a stable fallback in case of overload
const MODELS = ["gemini-flash-latest", "gemini-flash-lite-latest"];

const SYSTEM_PROMPT =
  "You are a world-class meeting analyst and thought partner. Your job is to take any messy, unstructured input and extract maximum signal from it. Be ruthlessly concise. Return ONLY valid JSON with no markdown, no backticks, no explanation. Schema: { tldr: string, actionItems: string[], keyDecisions: string[], openQuestions: string[] }";

export type ClarifyResponse = ActionResult<ClarityOutput>;

// Re-export for consumers that imported directly from this module
export type { ClarityOutput };

async function callWithFallback(prompt: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  let lastError: unknown;

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      lastError = err;
      // Only fall through to next model on overload/unavailable (503/429)
      if (err instanceof GoogleGenerativeAIFetchError) {
        if (err.status === 503 || err.status === 429) {
          console.warn(`CLARIFY: ${modelName} returned ${err.status}, trying fallback…`);
          continue;
        }
      }
      throw err;
    }
  }

  throw lastError;
}

export async function clarifyText(rawText: string): Promise<ClarifyResponse> {
  console.log("GEMINI KEY EXISTS:", !!process.env.GEMINI_API_KEY);

  try {
    const trimmed = rawText.trim();

    if (!trimmed) {
      return { success: false, error: "Please paste some content first" };
    }

    if (trimmed.length < 10) {
      return { success: false, error: "Input is too short to analyze" };
    }

    if (trimmed.length > 10_000) {
      return {
        success: false,
        error: `Input is too long (${trimmed.length.toLocaleString()} chars). Please keep it under 10,000 characters.`,
      };
    }

    const prompt = `${SYSTEM_PROMPT}\n\nText to structure:\n${trimmed}`;
    const text = await callWithFallback(prompt);

    let parsed: unknown;
    try {
      const clean = text.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(clean);
    } catch {
      console.error("CLARIFY ERROR: JSON parse failed, raw response:", text);
      return { success: false, error: "Something went wrong. Please try again." };
    }

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof (parsed as Record<string, unknown>).tldr !== "string"
    ) {
      console.error("CLARIFY ERROR: Unexpected response shape:", parsed);
      return { success: false, error: "Something went wrong. Please try again." };
    }

    const raw = parsed as Record<string, unknown>;

    return {
      success: true,
      data: {
        tldr: typeof raw.tldr === "string" ? raw.tldr : "",
        actionItems: Array.isArray(raw.actionItems)
          ? (raw.actionItems as unknown[]).filter((x): x is string => typeof x === "string")
          : [],
        keyDecisions: Array.isArray(raw.keyDecisions)
          ? (raw.keyDecisions as unknown[]).filter((x): x is string => typeof x === "string")
          : [],
        openQuestions: Array.isArray(raw.openQuestions)
          ? (raw.openQuestions as unknown[]).filter((x): x is string => typeof x === "string")
          : [],
      },
    };
  } catch (err) {
    console.error("CLARIFY ERROR:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
