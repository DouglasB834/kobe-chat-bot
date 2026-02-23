
import type { ChatAIProvider, ChatAIRequest, ChatAIResponse } from "@/types/chat-ai";

export const groqChatAIProvider: ChatAIProvider = {
  name: "groq",

  async sendMessage(request: ChatAIRequest): Promise<ChatAIResponse> {
    const res = await fetch("/api/chat/groq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { error?: string };
      throw new Error(err.error ?? `API error: ${res.status}`);
    }

    return res.json() as Promise<ChatAIResponse>;
  },
};
