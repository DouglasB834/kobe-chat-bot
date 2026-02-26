import type { Product } from "./message";

export type ChatAIRequest = {
  userMessage: string;
  history?: { role: "user" | "assistant"; text: string }[];
};

export type ChatAIResponse = {
  text: string;
  products?: Product[];
};

export type ChatAIProvider = {
  name: string;
  sendMessage(request: ChatAIRequest): Promise<ChatAIResponse>;
};
