import { NextRequest, NextResponse } from "next/server";
import { clarifyText } from "@/actions/clarify";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = typeof body?.text === "string" ? body.text : "";

    if (!text.trim()) {
      return NextResponse.json({ error: "Please paste some content first" }, { status: 400 });
    }

    const result = await clarifyText(text);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 422 });
    }

    const { tldr, actionItems, keyDecisions, openQuestions } = result.data;
    return NextResponse.json({
      tldr,
      actions: actionItems,
      decisions: keyDecisions,
      questions: openQuestions,
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
