"use client";

import { useChat } from "@/hooks/useChat";
import { useEffect, useRef } from "react";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";
import { AnimatePresence } from "motion/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";

export const ChatContainer = () => {
  const { messages, isTyping, sendMessage, resetChat } = useChat();

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className=" flex justify-center w-full max-w-6xl mx-auto flex-col h-[700px] bg-black text-white px-2">
        {/* <div className="flex items-end justify-end bg-red-200"> */}
            <Badge variant={"ghost"} className="flex mt-2 self-end">
                <X size={24} className=""/>
            </Badge>
        {/* </div> */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-6 py-6 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && (
              <MessageBubble
                message={{
                  id: "typing",
                  role: "assistant",
                  text: "Digitando...",
                  createdAt: new Date(),
                }}
              />
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <ChatInput onSend={sendMessage} isLoading={isTyping} />
    </div>
  );
};
