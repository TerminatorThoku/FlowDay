"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Waves, Trash2 } from "lucide-react";
import {
  useLifestyleStore,
  STROKE_TYPES,
} from "@/stores/lifestyleStore";

export default function SwimLog() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [date, setDate] = useState(today);
  const [laps, setLaps] = useState("");
  const [duration, setDuration] = useState("");
  const [strokeType, setStrokeType] = useState("");
  const [notes, setNotes] = useState("");

  const addSwimEntry = useLifestyleStore((s) => s.addSwimEntry);
  const deleteSwimEntry = useLifestyleStore((s) => s.deleteSwimEntry);
  const swimLogs = useLifestyleStore((s) => s.swimLogs);

  // Get today's swim logs
  const todayLogs = swimLogs.filter((l) => l.date === date);

  const handleSave = () => {
    if (!laps || !duration || !strokeType) return;

    addSwimEntry({
      date,
      laps: parseInt(laps),
      duration_minutes: parseInt(duration),
      stroke_type: strokeType,
      notes,
    });

    // Reset
    setLaps("");
    setDuration("");
    setStrokeType("");
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

      {/* Laps */}
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-400">
          Laps
        </label>
        <Input
          type="number"
          min="1"
          value={laps}
          onChange={(e) => setLaps(e.target.value)}
          placeholder="20"
          className="border-zinc-700 bg-zinc-800 text-zinc-100"
        />
      </div>

      {/* Duration */}
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-400">
          Duration (minutes)
        </label>
        <Input
          type="number"
          min="1"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="45"
          className="border-zinc-700 bg-zinc-800 text-zinc-100"
        />
      </div>

      {/* Stroke Type */}
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-400">
          Stroke Type
        </label>
        <Select value={strokeType} onValueChange={setStrokeType}>
          <SelectTrigger className="border-zinc-700 bg-zinc-800 text-zinc-100">
            <SelectValue placeholder="Select stroke" />
          </SelectTrigger>
          <SelectContent className="border-zinc-700 bg-zinc-800">
            {STROKE_TYPES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Notes */}
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-400">
          Notes
        </label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How was your session?"
          className="border-zinc-700 bg-zinc-800 text-zinc-100"
          rows={3}
        />
      </div>

      {/* Save */}
      <Button
        onClick={handleSave}
        disabled={!laps || !duration || !strokeType}
        className="w-full bg-orange-500 text-white hover:bg-orange-600"
      >
        <Save className="mr-2 h-4 w-4" />
        Save Session
      </Button>

      {/* Today's logs */}
      {todayLogs.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Sessions for {date === today ? "Today" : date}
          </h3>
          {todayLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <Waves className="h-3 w-3 text-cyan-500" />
                <div>
                  <p className="text-xs font-medium text-zinc-300">
                    {log.laps} laps - {log.stroke_type}
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    {log.duration_minutes} min
                    {log.notes ? ` | ${log.notes}` : ""}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-zinc-600 hover:text-red-400"
                onClick={() => deleteSwimEntry(log.id)}
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
