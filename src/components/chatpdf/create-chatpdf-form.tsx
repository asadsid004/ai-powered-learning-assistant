"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function CreateChatPDFForm({ userId }: { userId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.id) {
        router.push(`/chatpdf/${data.id}`);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-96 p-4">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Upload a PDF</h2>
          <Input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
          />
          <Button
            onClick={handleUpload}
            className="mt-4 w-full"
            disabled={loading}
          >
            {loading ? "Processing..." : "Upload"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
