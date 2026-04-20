// Server action: handles follow-up chat messages about the clarified content

"use server";

import { GoogleGenerativeAI, GoogleGenerativeAIFetchError } from "@google/generative-ai";
import type { ClarityOutput } from "@/lib/types";

const MODELS = ["gemini-flash-latest", "gemini-flash-lite-latest"];

function buildSystemInstruction(originalText: string, clarity: ClarityOutput): string {
  const context = [
    originalText,
    "",
    "STRUCTURED SUMMARY:",
    `TL;DR: ${clarity.tldr}`,
    `Action Items: ${clarity.actionItems.join("; ") || "None"}`,
    `Key Decisions: ${clarity.keyDecisions.join("; ") || "None"}`,
    `Open Questions: ${clarity.openQuestions.join("; ") || "None"}`,
  ].join("\n");

  return `You are a helpful assistant. The user has pasted the following content into ClarityAI:\n\n${context}\n\nAnswer their questions about this content only. Be concise and direct. If asked something unrelated to the content, politely redirect.`;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResult {
  success: true;
  message: string;
}

export interface ChatError {
  success: false;
  error: string;
}

export type ChatResponse = ChatResult | ChatError;

export async function sendChatMessage(
  userMessage: string,
  history: ChatMessage[],
  clarityContext: ClarityOutput,
  originalText: string
): Promise<ChatResponse> {
  if (!userMessage.trim()) {
    return { success: false, error: "Message cannot be empty." };
  }

  const systemInstruction = buildSystemInstruction(originalText, clarityContext);
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  let lastError: unknown;

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName, systemInstruction });

      const chat = model.startChat({
        history: history.map((msg) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        })),
      });

      const result = await chat.sendMessage(userMessage);
      return { success: true, message: result.response.text() };
    } catch (err) {
      lastError = err;
      if (err instanceof GoogleGenerativeAIFetchError) {
        if (err.status === 503 || err.status === 429) {
          console.warn(`CHAT: ${modelName} returned ${err.status}, trying fallback…`);
          continue;
        }
      }
      console.error("CHAT ERROR:", err);
      return { success: false, error: "Something went wrong. Please try again." };
    }
  }

  console.error("CHAT ERROR (all models failed):", lastError);
  return { success: false, error: "Something went wrong. Please try again." };
}
