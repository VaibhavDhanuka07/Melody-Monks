"use client";

import { useMemo, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const quickPrompts = [
  "Create a 20-minute practice plan",
  "How to improve sur accuracy",
  "Suggest a raag practice routine",
  "Tips for stage confidence",
];

const generateReply = (message: string) => {
  const prompt = message.toLowerCase();
  if (prompt.includes("practice plan")) {
    return "Try 5 min warmups, 8 min technique, 5 min repertoire, 2 min review. Keep a steady tempo and record a short clip.";
  }
  if (prompt.includes("sur") || prompt.includes("pitch")) {
    return "Use tanpura support, sing slow sargam, and hold each note for 4 beats. Record your take and compare daily.";
  }
  if (prompt.includes("raag")) {
    return "Choose one raag, practice aroh-avaroh, then sing 3 pakad phrases slowly before adding taans.";
  }
  if (prompt.includes("stage") || prompt.includes("confidence")) {
    return "Simulate performance, practice with a mic, and rehearse the opening 30 seconds until it feels natural.";
  }
  return "Focus on short, consistent practice blocks. Use a metronome and track progress daily.";
};

export default function AIChatCoach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      role: "assistant",
      content:
        "Hi! I am your AI music coach. Ask for a practice plan or technique tips.",
    },
  ]);
  const [input, setInput] = useState("");

  const canSend = useMemo(() => input.trim().length > 0, [input]);

  const handleSend = (text: string) => {
    const content = text.trim();
    if (!content) return;
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
    };
    const reply: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: generateReply(content),
    };
    setMessages((prev) => [...prev, userMessage, reply]);
    setInput("");
  };

  return (
    <div className="card-strong p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-gold">AI Music Coach</p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">
            Practice guidance chat
          </h3>
          <p className="mt-2 text-sm text-ink-muted">
            Ask the coach for routines, tips, and daily focus ideas.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-ink-muted">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => handleSend(prompt)}
            className="rounded-full border border-white/10 px-3 py-1 hover:border-brand-gold/40"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="mt-6 max-h-72 space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-black/50 p-4 text-sm">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-2xl px-4 py-3 ${
              message.role === "assistant"
                ? "bg-white/5 text-ink"
                : "bg-brand-gold/10 text-ink"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
              {message.role === "assistant" ? "Coach" : "You"}
            </p>
            <p className="mt-2">{message.content}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask for a practice tip..."
          className="flex-1 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
        />
        <button
          type="button"
          onClick={() => handleSend(input)}
          className="btn-primary"
          disabled={!canSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
