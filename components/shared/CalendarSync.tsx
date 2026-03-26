"use client";

import { useState, useCallback } from "react";
import {
  Calendar,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Dumbbell,
  Code2,
  Moon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface CalendarSyncProps {
  intakeCode?: string;
}

export default function CalendarSync({
  intakeCode = "UCDF2505ICT(DI)",
}: CalendarSyncProps) {
  const [copied, setCopied] = useState(false);

  const feedUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/gcal?intake=${encodeURIComponent(intakeCode)}`
      : `/api/gcal?intake=${encodeURIComponent(intakeCode)}`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(feedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = feedUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [feedUrl]);

  const syncPreview = [
    { icon: BookOpen, label: "Classes", color: "#3B82F6", desc: "APU timetable" },
    { icon: Dumbbell, label: "Gym & Swim", color: "#22C55E", desc: "Workout sessions" },
    { icon: BookOpen, label: "Study", color: "#8B5CF6", desc: "Study blocks" },
    { icon: Code2, label: "Projects", color: "#F97316", desc: "Project work time" },
    { icon: Moon, label: "Sleep", color: "#52525B", desc: "Sleep schedule" },
  ];

  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm text-zinc-300">
          <Calendar className="h-4 w-4 text-orange-500" />
          Sync with Google Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Feed URL */}
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-400">
            Calendar Feed URL
          </label>
          <div className="flex gap-2">
            <Input
              readOnly
              value={feedUrl}
              className="border-zinc-700 bg-zinc-800 text-xs text-zinc-300"
            />
            <Button
              onClick={handleCopy}
              size="sm"
              variant="outline"
              className="flex-shrink-0 border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="rounded-xl border border-zinc-800/50 bg-zinc-950/50 p-3">
          <p className="mb-2 text-xs font-medium text-zinc-300">
            How to subscribe:
          </p>
          <ol className="space-y-1.5 text-xs text-zinc-500">
            <li className="flex gap-2">
              <span className="font-semibold text-orange-500">1.</span>
              Open Google Calendar Settings
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-orange-500">2.</span>
              Add calendar &rarr; From URL
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-orange-500">3.</span>
              Paste the URL above
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-orange-500">4.</span>
              Click &quot;Add calendar&quot;
            </li>
          </ol>
        </div>

        {/* Preview of what gets synced */}
        <div>
          <p className="mb-2 text-xs font-medium text-zinc-400">
            What gets synced:
          </p>
          <div className="flex flex-wrap gap-2">
            {syncPreview.map((item) => (
              <Badge
                key={item.label}
                variant="outline"
                className="gap-1.5 border-zinc-700/50 bg-zinc-800/50 text-zinc-300"
              >
                <item.icon className="h-3 w-3" style={{ color: item.color }} />
                {item.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Direct download link */}
        <a
          href={feedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
        >
          <ExternalLink className="h-3 w-3" />
          Download ICS file
        </a>
      </CardContent>
    </Card>
  );
}
