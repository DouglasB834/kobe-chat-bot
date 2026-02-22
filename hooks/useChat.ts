"use client";

import { chatReducer, initialChatState } from "@/lib/chat-reducer";
import { ChatActionType } from "@/types/chat-state";
import { searchProducts, getAllProducts, isShowAllProductsIntent } from "@/lib/mock-products";
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

    setTimeout(() => {
      const showAll = isShowAllProductsIntent(trimmed);
      const products = showAll ? getAllProducts() : searchProducts(trimmed);
      const text =
        products.length > 0
          ? showAll
            ? "Aqui estão todos os nossos produtos!"
            : "Claro, aqui estão algumas sugestões..."
          : "Não encontrei produtos com esse termo. Que tal dar uma olhada em tudo? (digite sim ou 1)";

      dispatch({
        type: ChatActionType.ADD_BOT_MESSAGE,
        payload: {
          text,
          products: products.length > 0 ? products : undefined,
        },
      });
      dispatch({
        type: ChatActionType.SET_TYPING,
        payload: false,
      });
    }, 2000);
  }, []);

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
