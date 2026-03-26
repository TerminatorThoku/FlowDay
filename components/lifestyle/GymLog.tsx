"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Save, Dumbbell } from "lucide-react";
import {
  useLifestyleStore,
  GYM_EXERCISES,
} from "@/stores/lifestyleStore";

interface ExerciseRow {
  tempId: string;
  exercise: string;
  sets: string;
  reps: string;
  weight_kg: string;
}

function createEmptyRow(): ExerciseRow {
  return {
    tempId: crypto.randomUUID(),
    exercise: "",
    sets: "",
    reps: "",
    weight_kg: "",
  };
}

export default function GymLog() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [date, setDate] = useState(today);
  const [rows, setRows] = useState<ExerciseRow[]>([createEmptyRow()]);

  const addGymEntry = useLifestyleStore((s) => s.addGymEntry);
  const gymLogs = useLifestyleStore((s) => s.gymLogs);
  const deleteGymEntry = useLifestyleStore((s) => s.deleteGymEntry);

  const todayLogs = useMemo(() => gymLogs.filter((e) => e.date === date), [gymLogs, date]);

  const updateRow = (tempId: string, field: keyof ExerciseRow, value: string) => {
    setRows((prev) =>
      prev.map((r) => (r.tempId === tempId ? { ...r, [field]: value } : r)),
    );
  };

  const addRow = () => {
    setRows((prev) => [...prev, createEmptyRow()]);
  };

  const removeRow = (tempId: string) => {
    setRows((prev) => prev.filter((r) => r.tempId !== tempId));
  };

  const saveWorkout = () => {
    const validRows = rows.filter(
      (r) =>
        r.exercise &&
        r.sets &&
        r.reps &&
        !isNaN(parseInt(r.sets)) &&
        !isNaN(parseInt(r.reps)),
    );

    validRows.forEach((r) => {
      addGymEntry({
        date,
        exercise: r.exercise,
        sets: parseInt(r.sets),
        reps: parseInt(r.reps),
        weight_kg: parseFloat(r.weight_kg) || 0,
      });
    });

    // Reset
    setRows([createEmptyRow()]);
  };

  return (
    <div className="space-y-4">
      {/* Date Picker */}
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

      {/* Exercise Rows */}
      <div className="space-y-3">
        {rows.map((row, idx) => (
          <Card key={row.tempId} className="border-zinc-800 bg-zinc-900/30">
            <CardContent className="space-y-3 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500">
                  Exercise {idx + 1}
                </span>
                {rows.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-zinc-600 hover:text-red-400"
                    onClick={() => removeRow(row.tempId)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>

              <Select
                value={row.exercise}
                onValueChange={(v) => updateRow(row.tempId, "exercise", v)}
              >
                <SelectTrigger className="border-zinc-700 bg-zinc-800 text-zinc-100">
                  <SelectValue placeholder="Select exercise" />
                </SelectTrigger>
                <SelectContent className="border-zinc-700 bg-zinc-800">
                  {GYM_EXERCISES.map((ex) => (
                    <SelectItem key={ex} value={ex}>
                      {ex}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="mb-1 block text-[10px] text-zinc-500">
                    Sets
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={row.sets}
                    onChange={(e) =>
                      updateRow(row.tempId, "sets", e.target.value)
                    }
                    placeholder="3"
                    className="border-zinc-700 bg-zinc-800 text-zinc-100"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-[10px] text-zinc-500">
                    Reps
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={row.reps}
                    onChange={(e) =>
                      updateRow(row.tempId, "reps", e.target.value)
                    }
                    placeholder="10"
                    className="border-zinc-700 bg-zinc-800 text-zinc-100"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-[10px] text-zinc-500">
                    Weight (kg)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    value={row.weight_kg}
                    onChange={(e) =>
                      updateRow(row.tempId, "weight_kg", e.target.value)
                    }
                    placeholder="60"
                    className="border-zinc-700 bg-zinc-800 text-zinc-100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={addRow}
          className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Exercise
        </Button>
        <Button
          onClick={saveWorkout}
          disabled={rows.every((r) => !r.exercise)}
          className="flex-1 bg-orange-500 text-white hover:bg-orange-600"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Workout
        </Button>
      </div>

      {/* Today's logged exercises */}
      {todayLogs.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Logged for {date === today ? "Today" : date}
          </h3>
          {todayLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <Dumbbell className="h-3 w-3 text-green-500" />
                <div>
                  <p className="text-xs font-medium text-zinc-300">
                    {log.exercise}
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    {log.sets}x{log.reps} @ {log.weight_kg}kg
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-zinc-600 hover:text-red-400"
                onClick={() => deleteGymEntry(log.id)}
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
