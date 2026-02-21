"use client";

import { chatReducer, initialChatState } from "@/lib/chat-reducer";
import { ChatActionType } from "@/types/chat-state";
import { useReducer, useCallback } from "react";

export const useChat = () => {
  const [state, dispatch] = useReducer(chatReducer, initialChatState);

  const sendMessage = useCallback((text: string) => {
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
    //TODO add timeout simular resposta ou api
    dispatch({
      type: ChatActionType.ADD_BOT_MESSAGE,
      payload: {
        text: "Claro aqui esta algumas sugestões...",
        products: [],
      },
    });

    dispatch({
      type: ChatActionType.SET_TYPING,
      payload: false,
    });
  }, []);

  const resetChat = useCallback(() => {
    dispatch({
      type: ChatActionType.RESET_CHAT,
    });
  }, []);

  const data = {
    message: state.messages,
    isTyping: state.isTyping,
    sendMessage,
    resetChat,
  };

  return data;
};
