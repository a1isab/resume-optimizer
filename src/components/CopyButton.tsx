"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import type { WeakBullet } from "@/lib/types";

interface CopyButtonProps {
  bullets: WeakBullet[];
}

export function CopyButton({ bullets }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = bullets
      .map((b) => b.rewritten)
      .join("\n");

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (bullets.length === 0) return null;

  return (
    <Button
      variant="outline"
      onClick={handleCopy}
      className="w-full"
    >
      {copied ? (
        <>
          <Check className="mr-2 size-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="mr-2 size-4" />
          Copy Improved Resume
        </>
      )}
    </Button>
  );
}
