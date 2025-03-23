"use client";

import { useChat, type UseChatOptions } from "@ai-sdk/react";
import { cn } from "@/lib/utils";
import { Chat } from "@/components/ui/chat";
import { Button } from "@/components/ui/button";
import { saveChatAsNote } from "@/app/actions/notes";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { Loader2 } from "lucide-react";

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
  });

  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    try {
      setIsSaving(true);
      toast.loading("Saving conversation to notes...");

      await saveChatAsNote(messages);

      toast.dismiss();
      toast.success("Conversation saved to notes");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to save conversation");
      console.error("Error saving chat:", error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className={cn("flex", "flex-col", "h-[80vh]", "w-full")}>
      <div className="flex justify-end p-2">
        <Button
          onClick={handleSave}
          disabled={isSaving || messages.length === 0}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
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
