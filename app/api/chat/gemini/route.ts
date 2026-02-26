import { NextRequest, NextResponse } from "next/server";
import type { ChatAIRequest, ChatAIResponse } from "@/types/chat-ai";
import {
  getAllProducts,
  isShowAllProductsIntent,
  searchProducts,
} from "@/lib/mock-products";

const GEMINI_URL ="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

function buildContents(request: ChatAIRequest): { role: string; parts: { text: string }[] }[] {
  const contents: { role: string; parts: { text: string }[] }[] = [];

  if (request.history?.length) {
    for (const msg of request.history) {
      contents.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      });
    }
  }

  contents.push({
    role: "user",
    parts: [{ text: request.userMessage }],
  });

  return contents;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured" },
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

  const contents = buildContents(body);
  const url = `${GEMINI_URL}?key=${encodeURIComponent(apiKey)}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: "Você é um assistente de uma loja. Responda de forma breve e amigável. Se o usuário pedir produtos ou sugestões, seja prestativo.mostre o produto por ususario pode trazer img  e nome produto ",
            },
          ],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini API error:", res.status, errText);
      return NextResponse.json(
        { error: "Gemini API request failed" },
        { status: 502 }
      );
    }

    const data = (await res.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };

    const textPart = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const text = typeof textPart === "string" ? textPart.trim() : "Desculpe, não consegui processar.";

    const showAll = isShowAllProductsIntent(userMessage);
    const products = showAll ? getAllProducts() : searchProducts(userMessage);

    const response: ChatAIResponse = {
      text,
      products: products.length > 0 ? products : undefined,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("Gemini route error:", err);
    return NextResponse.json(
      { error: "Internal error calling Gemini" },
      { status: 502 }
    );
  }
}
