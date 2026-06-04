"use client";

import { useState, useCallback } from "react";
import { Upload } from "lucide-react";

function getDocument() {
  if (typeof window === "undefined") return null;
  return window.document;
}

export function FileUpload({
  onTextExtracted,
}: {
  onTextExtracted: (text: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFile = useCallback(
    async (file: File) => {
      setError("");
      setLoading(true);
      setFileName(file.name);

      try {
        const pdfjsLib = await import("pdfjs-dist");
        const pdfjsWorker = await import(
          "pdfjs-dist/build/pdf.worker.mjs"
        );

        pdfjsLib.GlobalWorkerOptions.workerSrc =
          pdfjsWorker.default;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text +=
            content.items.map((item: { str: string }) => item.str).join(" ") + "\n";
        }

        if (text.trim().length < 50) {
          setError(
            "Could not extract enough text from this PDF. Try pasting instead."
          );
          return;
        }

        onTextExtracted(text);
      } catch {
        setError(
          "Failed to parse PDF. Try pasting the text directly."
        );
      } finally {
        setLoading(false);
      }
    },
    [onTextExtracted]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type === "application/pdf") {
        handleFile(file);
      } else {
        setError("Please drop a PDF file");
      }
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:border-primary/50"
      onClick={() => getDocument()?.getElementById("pdf-upload")?.click()}
    >
      <input
        id="pdf-upload"
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleChange}
      />
      {loading ? (
        <div className="text-center">
          <div className="mx-auto mb-2 size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">
            Extracting text...
          </p>
        </div>
      ) : (
        <>
          <Upload className="mb-2 size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {fileName
              ? `Loaded: ${fileName}`
              : "Drop PDF here or click to browse"}
          </p>
        </>
      )}
      {error && (
        <p className="mt-2 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
