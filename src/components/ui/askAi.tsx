"use client";

import { useState } from "react";
import { useChat, type UseChatOptions } from "@ai-sdk/react";

import { cn } from "@/lib/utils";
import { Chat } from "@/components/ui/chat";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ChatDemoProps = {
  initialMessages?: UseChatOptions["initialMessages"];
};

export function AskAI(props: ChatDemoProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    stop,
    isLoading,
    setMessages,
  } = useChat({
    ...props,
    api: "/api/chat",
    body: {
      model: "google-2.0-flash",
    },
  });

  return (
    <div className={cn("flex", "min-h-[90vh]", "flex-col", "w-full")}>
      <Chat
        className="grow"
        messages={messages}
        handleSubmit={handleSubmit}
        input={input}
        handleInputChange={handleInputChange}
        isGenerating={isLoading}
        stop={stop}
        append={append}
        setMessages={setMessages}
        suggestions={[
          "What is Artificial Intelligence? State five applications.",
          "Explain step-by-step how to solve this math problem: If x² + 6x + 9 = 25, what is x?",
          "Design a simple algorithm to find the longest palindrome in a string.",
        ]}
      />
    </div>
  );
}
