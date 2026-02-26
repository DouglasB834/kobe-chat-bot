import { NextRequest, NextResponse } from "next/server";
import type { ChatAIRequest, ChatAIResponse } from "@/types/chat-ai";
import {
  getAllProducts,
  isShowAllProductsIntent,
  searchProducts,
} from "@/lib/mock-products";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT =
  "Você é um assistente de uma loja. Responda de forma breve e amigável. Se o usuário pedir produtos ou sugestões, seja prestativo.";

function buildMessages(request: ChatAIRequest): { role: "system" | "user" | "assistant"; content: string }[] {
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  if (request.history?.length) {
    for (const msg of request.history) {
      messages.push({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.text,
      });
    }
  }

  messages.push({ role: "user", content: request.userMessage });
  return messages;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured" },
      { status: 503 }
    );
  }

  let body: ChatAIRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const userMessage = body.userMessage?.trim();
  if (!userMessage) {
    return NextResponse.json(
      { error: "userMessage is required" },
      { status: 400 }
    );
  }

  const messages = buildMessages(body);

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", //"model": "llama-3.3-70b-versatile",
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Groq API error:", res.status, errText);
      return NextResponse.json(
        { error: "Groq API request failed" },
        { status: 502 }
      );
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const textPart = data.choices?.[0]?.message?.content;
    const text = typeof textPart === "string" ? textPart.trim() : "Desculpe, não consegui processar.";

    const showAll = isShowAllProductsIntent(userMessage);
    const products = showAll ? getAllProducts() : searchProducts(userMessage);

    const response: ChatAIResponse = {
      text,
      products: products.length > 0 ? products : undefined,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("Groq route error:", err);
    return NextResponse.json(
      { error: "Internal error calling Groq" },
      { status: 502 }
    );
  }
}
