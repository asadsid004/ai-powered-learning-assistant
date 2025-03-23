// components/NoteDetail.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  deleteNote,
  generateNoteSummary,
  updateNote,
} from "@/app/actions/notes";
import { Loader2, Save, Trash, FileText, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface NoteDetailProps {
  note: Note;
}

export default function NoteDetail({ note }: NoteDetailProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isLoading, setIsLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const result = await updateNote(note.id, { title, content });
      if (result.success) {
        toast.success("Note updated successfully");
        setIsEditing(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update note");
      }
    } catch (error) {
      toast.error("An error occurred while updating the note");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deleteNote(note.id);
      if (result.success) {
        toast.success("Note deleted successfully");
        router.push("/notes");
      } else {
        toast.error(result.error || "Failed to delete note");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the note");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    setIsSummarizing(true);
    try {
      const result = await generateNoteSummary(note.id, {
        title: note.title,
        content: note.content,
      });
      if (result.success) {
        toast.success("Summary generated successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to generate summary");
      }
    } catch (error) {
      toast.error("An error occurred while generating summary");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleCancel = () => {
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(false);
  };

  return (
    <div className="container max-w-4xl py-4">
      <Button
        variant="ghost"
        onClick={() => router.push("/notes")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Notes
      </Button>
      <div className="text-sm text-muted-foreground mb-4">
        Last updated:{" "}
        {new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(new Date(note.updatedAt!))}
      </div>
      <Card className="mb-6">
        <div className="flex justify-between gap-2 px-6">
          <div>
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="mr-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Save
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={handleEdit} variant="outline">
                Edit Note
              </Button>
            )}
          </div>

          <div>
            <Button
              onClick={handleGenerateSummary}
              disabled={isSummarizing || isEditing}
              variant="outline"
              className="mr-2"
            >
              {isSummarizing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating
                </>
              ) : (
                <>Generate Summary</>
              )}
            </Button>

            <Button
              onClick={handleDelete}
              variant="destructive"
              disabled={isLoading || isEditing}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </>
              )}
            </Button>
          </div>
        </div>
        <CardHeader>
          {isEditing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-bold"
              placeholder="Note Title"
            />
          ) : (
            <CardTitle className="text-2xl">{note.title}</CardTitle>
          )}
        </CardHeader>

        {note.summary && (
          <CardContent className="pt-0">
            <Alert className="bg-muted">
              <FileText className="h-4 w-4" />
              <AlertDescription className="ml-2">
                <strong>Summary:</strong> {note.summary}
              </AlertDescription>
            </Alert>
          </CardContent>
        )}

        <CardContent>
          {isEditing ? (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px]"
              placeholder="Note Content"
            />
          ) : (
            <div className="whitespace-pre-wrap">{note.content}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
