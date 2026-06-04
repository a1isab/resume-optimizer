import { AlertTriangle } from "lucide-react";

interface CriticalNotesProps {
  notes: string[];
}

export function CriticalNotes({ notes }: CriticalNotesProps) {
  if (!notes || notes.length === 0) return null;

  return (
    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle className="size-4 text-amber-400" />
        <h3 className="text-sm font-semibold text-amber-400">
          Critical Notes
        </h3>
      </div>
      <ul className="space-y-2">
        {notes.map((note, i) => (
          <li key={i} className="flex gap-2 text-sm text-foreground/80">
            <span className="mt-0.5 shrink-0 text-amber-400/60 font-mono text-xs">
              {i + 1}.
            </span>
            <span>{note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
