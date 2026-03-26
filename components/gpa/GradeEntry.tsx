"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { useGradeStore, SUBJECTS } from "@/stores/gradeStore";

export default function GradeEntry() {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [assessment, setAssessment] = useState("");
  const [grade, setGrade] = useState("");
  const [weight, setWeight] = useState("");

  const addGrade = useGradeStore((s) => s.addGrade);

  const handleSave = () => {
    if (!subject || !assessment || !grade || !weight) return;

    const gradeNum = parseFloat(grade);
    const weightNum = parseFloat(weight);

    if (isNaN(gradeNum) || isNaN(weightNum)) return;
    if (gradeNum < 0 || gradeNum > 100) return;
    if (weightNum < 0 || weightNum > 100) return;

    addGrade({
      subject,
      assessment,
      grade: gradeNum,
      weight: weightNum,
    });

    // Reset form
    setSubject("");
    setAssessment("");
    setGrade("");
    setWeight("");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="w-full bg-orange-500 text-white hover:bg-orange-600">
          <Plus className="mr-2 h-4 w-4" />
          Add Grade
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="border-zinc-800 bg-zinc-950"
      >
        <SheetHeader>
          <SheetTitle className="text-zinc-100">Add Grade</SheetTitle>
          <SheetDescription className="text-zinc-500">
            Enter your assessment details below
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {/* Subject */}
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Subject
            </label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="border-zinc-700 bg-zinc-800 text-zinc-100">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent className="border-zinc-700 bg-zinc-800">
                {SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assessment */}
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Assessment Name
            </label>
            <Input
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              placeholder="e.g., Quiz 1, Midterm, Assignment 1"
              className="border-zinc-700 bg-zinc-800 text-zinc-100"
            />
          </div>

          {/* Grade and Weight */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Grade (0-100)
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="85"
                className="border-zinc-700 bg-zinc-800 text-zinc-100"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Weight (%)
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="20"
                className="border-zinc-700 bg-zinc-800 text-zinc-100"
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={!subject || !assessment || !grade || !weight}
            className="w-full bg-orange-500 text-white hover:bg-orange-600"
          >
            Save Grade
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
