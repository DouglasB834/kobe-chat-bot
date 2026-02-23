"use client";

import { useChat } from "@/hooks/useChat";
import { useEffect, useRef } from "react";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";
import { AnimatePresence } from "motion/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { LoadingDots } from "./typin-bubble";

export const ChatContainer = () => {
  const { messages, isTyping, sendMessage, resetChat } = useChat();

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="rounded-2xl flex justify-center w-full max-w-6xl mx-auto flex-col h-[700px] bg-black text-white px-2">
      <Button
        variant={"ghost"}
        size={"icon"}
        className="flex mt-2 self-end  cursor-pointer hover:bg-bubble-assistant/20"
        onClick={resetChat}
      >
        <X size={24} className="text-bubble-assistant" />
      </Button>
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-6 py-6 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && <LoadingDots key="typing" />}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <ChatInput onSend={sendMessage} isLoading={isTyping} />
    </div>
  );
};
