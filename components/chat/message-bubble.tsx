"use client";

import { Message } from "@/types/message";
import React from "react";
import { motion } from "motion/react";
import { ProductCard } from "./product-card";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = React.memo(function MessageBubble({
  message,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <motion.div
        layout
        initial={{ opacity: 0, y: 50, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{
          duration: 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`max-w-[290px] sm:max-w-[97%] px-2 py-2 rounded-md shadow-sm text-sm ${isUser ? "sm:max-w-[481px] my-4 bg-bubble-assistant text-secondary-foreground dark:text-primary-foreground" : "bg-transparent"}`}
      >
        <p className="leading-relaxed whitespace-pre-wrap">{message.text}</p>

        {message.products && message.products.length > 0 && (
          <div className="mt-3 md:flex w-full flex-wrap gap-2 ">
            {message.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
});
