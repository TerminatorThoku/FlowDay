"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import TaskForm from "@/components/tasks/TaskForm";

export default function QuickActions() {
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    // Placeholder: will connect to store later
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 shadow-lg shadow-orange-500/25 transition-transform active:scale-95"
      >
        <Plus className="h-6 w-6 text-white" />
      </button>

      <TaskForm open={open} onClose={() => setOpen(false)} onSave={handleSave} />
    </>
  );
}
