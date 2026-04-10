"use client";

import { useRef, useState } from "react";

import { FileText, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onUpload: (content: string, fileName: string) => void;
}

export function UploadZone({ onUpload }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    // Check file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    if (!validTypes.includes(file.type) && !file.name.endsWith(".docx") && !file.name.endsWith(".doc")) {
      toast.error("Please upload a .doc or .docx file");
      return;
    }

    setIsLoading(true);
    try {
      const mammoth = await import("mammoth");
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });

      if (result.messages.length > 0) {
        console.warn("Mammoth messages:", result.messages);
      }

      onUpload(result.value, file.name);
      toast.success("Document uploaded and extracted successfully!");
    } catch (error) {
      console.error("Extraction error:", error);
      toast.error("Failed to extract document contents.");
    } finally {
      setIsLoading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <Card
      className={cn(
        "relative flex flex-col items-center justify-center border-2 border-dashed p-12 transition-all duration-300",
        isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-muted-foreground/20",
        isLoading && "pointer-events-none opacity-60",
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="bg-primary/10 ring-primary/5 rounded-full p-4 ring-8">
          {isLoading ? (
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          ) : (
            <Upload className="text-primary h-8 w-8" />
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight">
            {isLoading ? "Extracting Content..." : "Upload Your Document"}
          </h3>
          <p className="text-muted-foreground mx-auto max-w-xs text-sm">
            Drag and drop your .docx or .doc file here, or click to browse from your computer.
          </p>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            disabled={isLoading}
            onClick={() => fileInputRef.current?.click()}
            className="shadow-md transition-shadow hover:shadow-lg"
          >
            Select File
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
          />
        </div>

        <div className="text-muted-foreground/60 mt-6 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            <span>Microsoft Word Supported</span>
          </div>
          <div className="bg-muted-foreground/20 h-1 w-1 rounded-full" />
          <span>Max size 10MB</span>
        </div>
      </div>

      {isLoading && (
        <div className="bg-background/20 absolute inset-0 flex items-center justify-center rounded-xl backdrop-blur-[1px]">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-muted h-1.5 w-48 overflow-hidden rounded-full">
              <div className="bg-primary h-full w-1/3 animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
