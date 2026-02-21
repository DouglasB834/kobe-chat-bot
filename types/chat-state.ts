import type { Message, Product } from "./message";

export type ChatState = {
  messages: Message[];
  isTyping: boolean;
};

export type ChatAction =
  | { type: "ADD_USER_MESSAGE"; payload: { text: string } }
  | { type: "SET_TYPING"; payload: boolean }
  | { type: "ADD_BOT_MESSAGE"; payload: { text: string; products?: Product[] } }
  | { type: "RESET_CHAT" };


export const ChatActionType = {
  ADD_USER_MESSAGE: "ADD_USER_MESSAGE",
  SET_TYPING: "SET_TYPING",
  ADD_BOT_MESSAGE: "ADD_BOT_MESSAGE",
  RESET_CHAT: "RESET_CHAT"
} as const