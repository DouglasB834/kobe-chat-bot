import type { ChatAIProvider, ChatAIRequest, ChatAIResponse } from "@/types/chat-ai";
import { searchProducts, getAllProducts, isShowAllProductsIntent } from "@/lib/mock-products";

const MOCK_DELAY_MS = 2000;

export const mockChatAIProvider: ChatAIProvider = {
  name: "mock",

  async sendMessage({ userMessage }: ChatAIRequest): Promise<ChatAIResponse> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

    const showAll = isShowAllProductsIntent(userMessage);
    const products = showAll ? getAllProducts() : searchProducts(userMessage);

    const text =
      products.length > 0
        ? showAll
          ? "Aqui estão todos os nossos produtos!"
          : "Claro, aqui estão algumas sugestões..."
        : "Não encontrei produtos com esse termo. Que tal dar uma olhada em tudo? (digite sim ou 1)";

    return {
      text,
      products: products.length > 0 ? products : undefined,
    };
  },
};
