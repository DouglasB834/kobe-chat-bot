import type { ChatAIProvider } from "@/types/chat-ai";
import { mockChatAIProvider } from "./mock";
import { geminiChatAIProvider } from "./gemini";
import { groqChatAIProvider } from "./groq";

const PROVIDER_ENV = process.env.NEXT_PUBLIC_CHAT_AI_PROVIDER ?? "mock";


function getChatAIProvider(): ChatAIProvider {
  switch (PROVIDER_ENV) {
    case "mock":
      return mockChatAIProvider;
    case "gemini":
      return geminiChatAIProvider;
    case "groq":
      return groqChatAIProvider;
    default:
      return mockChatAIProvider;
  }
}

export const chatAIProvider = getChatAIProvider();
export type { ChatAIProvider, ChatAIRequest, ChatAIResponse } from "@/types/chat-ai";
