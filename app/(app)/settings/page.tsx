"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RefreshCw,
  User,
  Clock,
  Info,
  GraduationCap,
  Dumbbell,
  ChevronRight,
} from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("Abdul Wahid");
  const [intakeCode, setIntakeCode] = useState("UCDF2505ICT(DI)");
  const [sleepStart, setSleepStart] = useState("23");
  const [sleepEnd, setSleepEnd] = useState("6");
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    // Placeholder: will connect to APU API
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSyncing(false);
  };

  const hours = Array.from({ length: 24 }, (_, i) => ({
    value: String(i),
    label: `${i === 0 ? 12 : i > 12 ? i - 12 : i}:00 ${i >= 12 ? "PM" : "AM"}`,
  }));

  return (
    <div className="space-y-6 px-4 py-4">
      <h1 className="text-xl font-bold text-zinc-100">Settings</h1>

      {/* Quick Links */}
      <div className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Tools
        </h2>
        <Link href="/gpa">
          <Card className="border-zinc-800 bg-zinc-900/50 transition-colors hover:border-zinc-700 hover:bg-zinc-900">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
                  <GraduationCap className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200">
                    GPA Calculator
                  </p>
                  <p className="text-xs text-zinc-500">
                    Track grades and calculate GPA
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-600" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/lifestyle">
          <Card className="border-zinc-800 bg-zinc-900/50 transition-colors hover:border-zinc-700 hover:bg-zinc-900">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                  <Dumbbell className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200">
                    Gym & Swim Log
                  </p>
                  <p className="text-xs text-zinc-500">
                    Track workouts, swimming, and sleep
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-600" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Profile section */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-zinc-300">
            <User className="h-4 w-4" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Full Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-zinc-700 bg-zinc-800 text-zinc-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Intake Code
            </label>
            <Input
              value={intakeCode}
              onChange={(e) => setIntakeCode(e.target.value)}
              placeholder="e.g., UCDF2505ICT(DI)"
              className="border-zinc-700 bg-zinc-800 text-zinc-100"
            />
          </div>
        </CardContent>
      </Card>

      {/* Schedule section */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-zinc-300">
            <Clock className="h-4 w-4" />
            Schedule Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Sleep Start
            </label>
            <Select value={sleepStart} onValueChange={setSleepStart}>
              <SelectTrigger className="border-zinc-700 bg-zinc-800 text-zinc-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-zinc-700 bg-zinc-800">
                {hours.map((h) => (
                  <SelectItem key={`start-${h.value}`} value={h.value}>
                    {h.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Wake Up Time
            </label>
            <Select value={sleepEnd} onValueChange={setSleepEnd}>
              <SelectTrigger className="border-zinc-700 bg-zinc-800 text-zinc-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-zinc-700 bg-zinc-800">
                {hours.map((h) => (
                  <SelectItem key={`end-${h.value}`} value={h.value}>
                    {h.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sync section */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardContent className="p-4">
          <Button
            onClick={handleSync}
            disabled={syncing}
            className="w-full bg-orange-500 text-white hover:bg-orange-600"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${syncing ? "animate-spin" : ""}`}
            />
            {syncing ? "Refreshing..." : "Refresh Timetable"}
          </Button>
          <p className="mt-2 text-center text-xs text-zinc-500">
            Re-fetch your class schedule from the APU API
          </p>
        </CardContent>
      </Card>

      {/* About section */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-zinc-300">
            <Info className="h-4 w-4" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-400">FlowDay v1.0</p>
          <p className="mt-1 text-xs text-zinc-500">
            Built for APU students
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
