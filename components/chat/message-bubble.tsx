"use client";

import { Message } from "@/types/message";
import React from "react";
import { motion } from "motion/react";
import { ProductCard } from "./product-card";
import { TypingAnimation } from "@/components/ui/typing-animation";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = React.memo(function MessageBubble({message }: MessageBubbleProps) {

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
        {isUser ? (
          <p className="leading-relaxed whitespace-pre-wrap">{message.text}</p>
        ) : (
          <TypingAnimation
            words={[message.text]}
            typeSpeed={15}
            loop={false}
            startOnView={false}
            showCursor={false}
            className="leading-relaxed text-inherit"
          />
        )}

        {message.products && message.products.length > 0 && (
          <motion.div
            key={message.id + "-products"}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.6,
                },
              },
            }}
            className="mt-3 flex w-full flex-wrap gap-2 space-y-1 "
          >
            {message.products.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, x: -40 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="border border-white/10 md:bg-card-product md:hover:bg-zinc-800/500"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
});
