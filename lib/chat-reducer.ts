import { type ChatState, type ChatAction, ChatActionType } from "@/types/chat-state";
import type { Message } from "@/types/message";

export const initialChatState: ChatState = {
  messages: [],
  isTyping: false,
};

export function chatReducer(state: ChatState, action: ChatAction): ChatState {

  switch (action.type) {
    case ChatActionType.ADD_USER_MESSAGE: {
      const message: Message = {
        id: crypto.randomUUID(),
        role: "user",
        text: action.payload.text.trim(),
        createdAt: new Date(),
      };
      return {
        ...state,
        messages: [...state.messages, message],
      };
    }
    case ChatActionType.SET_TYPING :
      return {
        ...state,
        isTyping: action.payload,
      };
    case ChatActionType.ADD_BOT_MESSAGE: {
      const message: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: action.payload.text,
        products: action.payload.products,
        createdAt: new Date(),
      };
      return {
        ...state,
        messages: [...state.messages, message],
      };
    }
    case ChatActionType.RESET_CHAT:
      return { ...initialChatState };
    default:
      return state;
  }
}
