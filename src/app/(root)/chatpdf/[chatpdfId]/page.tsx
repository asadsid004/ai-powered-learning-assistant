"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { prisma } from "@/lib/prisma";
import { getChatPdfName, getUserName } from "@/app/actions/chatPdf";
import { DeleteChatPdfButton } from "@/components/chatpdf/chat-pdf-delete-button";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
};

export default function ChatPage() {
  const { chatpdfId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [UserName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      try {
        setInitialLoading(true);
        const res = await fetch(`/api/chat/${chatpdfId}`);

        if (!res.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await res.json();
        setMessages(data.messages || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        // Even on error, we should exit the loading state
      } finally {
        // Ensure loading state is always turned off after attempt
        setInitialLoading(false);
      }
    }

    if (chatpdfId) {
      fetchMessages();
    } else {
      // If there's no ID, we shouldn't be in a loading state
      setInitialLoading(false);
    }
  }, [chatpdfId]);

  useEffect(() => {
    async function fetchName() {
      setInitialLoading(true);
      const name = (await getChatPdfName(chatpdfId as string)) as string;
      setName(name);
      setInitialLoading(false);
    }
    // If there's no ID, we shouldn't be in a loading state
    setInitialLoading(false);
    fetchName();
  }, [chatpdfId]);

  useEffect(() => {
    async function fetchUserName() {
      setInitialLoading(true);
      const name = await getUserName();
      setUserName(name!);
      setInitialLoading(false);
    }
    // If there's no ID, we shouldn't be in a loading state
    setInitialLoading(false);
    fetchUserName();
  }, [chatpdfId]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    setLoading(true);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    // Update UI immediately with user message
    setMessages((prev) => [...prev, userMessage]);
    setInput(""); // Clear input right away for better UX

    try {
      const res = await fetch(`/api/chat/${chatpdfId}`, {
        method: "POST",
        body: JSON.stringify({ message: input }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const data = await res.json();

      // Add assistant response once received
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: data.response,
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally display an error message to the user
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/chatpdf">Chat PDF</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <p>{UserName}</p>
          <LogoutLink className={buttonVariants()}>Logout</LogoutLink>
        </div>
      </header>
      <div className="max-w-2xl mx-auto mt-4 px-4">
        <Card className="border-none shadow-none">
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold ">Chat with PDF: {name}</h2>
              <DeleteChatPdfButton chatPdfId={chatpdfId as string} />
            </div>

            <div className="h-[70vh] overflow-y-auto space-y-4 p-4 border rounded-md mb-4">
              {initialLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  No messages yet. Start by asking a question.
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={
                      msg.id || `${msg.role}-${msg.content.substring(0, 10)}`
                    }
                    className={`p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-primary text-white ml-10"
                        : "bg-gray-100 text-gray-800 mr-10"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                ))
              )}
              {loading && (
                <div className="bg-gray-100 p-3 rounded-lg mr-10 animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about your PDF..."
                disabled={loading} // Only disable during actual message sending
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
                className="min-w-[80px]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Send"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
