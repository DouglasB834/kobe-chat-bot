"use client";

import { chatReducer, initialChatState } from "@/lib/chat-reducer";
import { ChatActionType } from "@/types/chat-state";
import { chatAIProvider } from "@/lib/chat-ai";
import { useReducer, useCallback } from "react";

export const useChat = () => {
  const [state, dispatch] = useReducer(chatReducer, initialChatState);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();

    if (!trimmed) return;

    dispatch({
      type: ChatActionType.ADD_USER_MESSAGE,
      payload: { text: trimmed },
    });

    dispatch({
      type: ChatActionType.SET_TYPING,
      payload: true,
    });

    try {
      const response = await chatAIProvider.sendMessage({
        userMessage: trimmed,
        history: state.messages.map((m) => ({ role: m.role, text: m.text })),
      });
      dispatch({
        type: ChatActionType.ADD_BOT_MESSAGE,
        payload: {
          text: response.text,
          products: response.products,
        },
      });
    } catch {
      dispatch({
        type: ChatActionType.ADD_BOT_MESSAGE,
        payload: {
          text: "Desculpe, ocorreu um erro. Tente novamente.",
        },
      });
    } finally {
      dispatch({
        type: ChatActionType.SET_TYPING,
        payload: false,
      });
    }
  }, [state.messages]);

  const resetChat = useCallback(() => {
    dispatch({
      type: ChatActionType.RESET_CHAT,
    });
  }, []);

  const data = {
    messages: state.messages,
    isTyping: state.isTyping,
    sendMessage,
    resetChat,
  };

  return data;
};
