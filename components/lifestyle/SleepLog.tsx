"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Moon, Star, Trash2 } from "lucide-react";
import { useLifestyleStore } from "@/stores/lifestyleStore";

export default function SleepLog() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [date, setDate] = useState(today);
  const [hours, setHours] = useState("");
  const [quality, setQuality] = useState(0);
  const [notes, setNotes] = useState("");

  const addSleepEntry = useLifestyleStore((s) => s.addSleepEntry);
  const deleteSleepEntry = useLifestyleStore((s) => s.deleteSleepEntry);
  const sleepLogs = useLifestyleStore((s) => s.sleepLogs);

  // Get logs for selected date
  const dateLogs = sleepLogs.filter((l) => l.date === date);

  const handleSave = () => {
    if (!hours || quality === 0) return;

    addSleepEntry({
      date,
      hours: parseFloat(hours),
      quality,
      notes,
    });

    // Reset
    setHours("");
    setQuality(0);
    setNotes("");
  };

  return (
    <div className="space-y-4">
      {/* Date */}
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-400">
          Date
        </label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border-zinc-700 bg-zinc-800 text-zinc-100"
        />
      </div>

      {/* Hours */}
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-400">
          Hours Slept
        </label>
        <Input
          type="number"
          min="0"
          max="24"
          step="0.5"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder="7.5"
          className="border-zinc-700 bg-zinc-800 text-zinc-100"
        />
      </div>

      {/* Quality Rating */}
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-400">
          Sleep Quality
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setQuality(star)}
              className="rounded p-1 transition-colors hover:bg-zinc-800"
            >
              <Star
                className={`h-6 w-6 ${
                  star <= quality
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-zinc-600"
                }`}
              />
            </button>
          ))}
          {quality > 0 && (
            <span className="ml-2 text-xs text-zinc-500">
              {quality}/5
            </span>
          )}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-400">
          Notes
        </label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did you sleep?"
          className="border-zinc-700 bg-zinc-800 text-zinc-100"
          rows={3}
        />
      </div>

      {/* Save */}
      <Button
        onClick={handleSave}
        disabled={!hours || quality === 0}
        className="w-full bg-orange-500 text-white hover:bg-orange-600"
      >
        <Save className="mr-2 h-4 w-4" />
        Save
      </Button>

      {/* Date's logs */}
      {dateLogs.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Sleep log for {date === today ? "Today" : date}
          </h3>
          {dateLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <Moon className="h-3 w-3 text-indigo-400" />
                <div>
                  <p className="text-xs font-medium text-zinc-300">
                    {log.hours}h slept
                  </p>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-2.5 w-2.5 ${
                          s <= log.quality
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-zinc-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-zinc-600 hover:text-red-400"
                onClick={() => deleteSleepEntry(log.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
