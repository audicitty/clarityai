# ClarityAI

Turn chaos into clarity. Paste meeting notes, brain dumps, or raw thoughts — get a structured TL;DR, action items, key decisions, and open questions in seconds. Then chat with your content to go deeper.

Built as part of my application for the **Eka Care Product Manager Internship**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + custom design tokens |
| Animations | Framer Motion |
| AI | Google Gemini API (`gemini-flash-latest`) |
| Font | Geist (local, via `next/font`) |

---

## Local Setup

**1. Clone and install**
```bash
git clone <repo-url>
cd clarityai
npm install
```

**2. Add your Gemini API key**

Create `.env.local` in the project root:
```
GEMINI_API_KEY=your_key_here
```

Get a free key at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) — no billing required for `gemini-flash-latest`.

**3. Run the dev server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Features

- **Clarify** — Paste any unstructured text and get 4 structured outputs instantly
- **TL;DR** — 2-3 sentence summary of the core content
- **Action Items** — Concrete tasks with ownership when mentioned
- **Key Decisions** — Things that were agreed upon or decided
- **Open Questions** — Unresolved items needing follow-up
- **Chat** — Ask follow-up questions about the content in context
- **Copy** — Copy individual cards or all results with one click
- **Keyboard shortcut** — `Cmd/Ctrl + Enter` to submit
- **Mobile** — Bottom sheet for output on small screens

---

## Deployment

Deploy to Vercel in one click. Add `GEMINI_API_KEY` as an environment variable in your Vercel project settings.

```bash
npx vercel
```

---

## Project Context

This project was built to demonstrate product thinking and technical execution for the **Eka Care PM Internship** application. ClarityAI solves a real problem: information overload in async work environments — turning messy inputs into structured, actionable outputs.
