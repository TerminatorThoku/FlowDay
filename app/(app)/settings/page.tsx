"use client";

import { useState, useEffect } from "react";
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
  BarChart3,
  Bell,
  BellOff,
  Music,
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import CalendarSync from "@/components/shared/CalendarSync";

export default function SettingsPage() {
  const [name, setName] = useState("Abdul Wahid");
  const [intakeCode, setIntakeCode] = useState("UCDF2505ICT(DI)");
  const [sleepStart, setSleepStart] = useState("23");
  const [sleepEnd, setSleepEnd] = useState("6");
  const [syncing, setSyncing] = useState(false);
  const [studyPlaylist, setStudyPlaylist] = useState("");
  const [gymPlaylist, setGymPlaylist] = useState("");

  // Notification settings
  const { permission, requestPermission } = useNotifications();
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [classReminder, setClassReminder] = useState("15");
  const [taskReminder, setTaskReminder] = useState("10");
  const [gymReminder, setGymReminder] = useState("30");
  const [streakWarning, setStreakWarning] = useState(true);

  useEffect(() => {
    setNotifEnabled(permission === "granted");
  }, [permission]);

  const handleSync = async () => {
    setSyncing(true);
    // Placeholder: will connect to APU API
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSyncing(false);
  };

  const handleToggleNotifications = async () => {
    if (permission === "granted") {
      // Already granted; toggling off is just UI-level
      setNotifEnabled(!notifEnabled);
      return;
    }
    // Request permission
    const result = await requestPermission();
    setNotifEnabled(result === "granted");
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

        <Link href="/report">
          <Card className="border-zinc-800 bg-zinc-900/50 transition-colors hover:border-zinc-700 hover:bg-zinc-900">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                  <BarChart3 className="h-5 w-5 text-violet-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200">
                    Weekly Report
                  </p>
                  <p className="text-xs text-zinc-500">
                    Study, coding, fitness, and streak stats
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-600" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Notifications Section */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-zinc-300">
            <Bell className="h-4 w-4" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {notifEnabled ? (
                <Bell className="h-4 w-4 text-orange-500" />
              ) : (
                <BellOff className="h-4 w-4 text-zinc-500" />
              )}
              <span className="text-sm text-zinc-300">
                {notifEnabled ? "Notifications enabled" : "Notifications off"}
              </span>
            </div>
            <button
              onClick={handleToggleNotifications}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                notifEnabled ? "bg-orange-500" : "bg-zinc-700"
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  notifEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {permission === "denied" && (
            <p className="text-xs text-red-400">
              Notifications are blocked in your browser. Please enable them in
              site settings.
            </p>
          )}

          {notifEnabled && (
            <>
              <div className="h-px bg-zinc-800" />

              {/* Class reminders */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">
                  Class reminders
                </span>
                <Select value={classReminder} onValueChange={setClassReminder}>
                  <SelectTrigger className="w-32 border-zinc-700 bg-zinc-800 text-zinc-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-700 bg-zinc-800">
                    <SelectItem value="5">5 min before</SelectItem>
                    <SelectItem value="10">10 min before</SelectItem>
                    <SelectItem value="15">15 min before</SelectItem>
                    <SelectItem value="30">30 min before</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Task reminders */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">
                  Task reminders
                </span>
                <Select value={taskReminder} onValueChange={setTaskReminder}>
                  <SelectTrigger className="w-32 border-zinc-700 bg-zinc-800 text-zinc-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-700 bg-zinc-800">
                    <SelectItem value="5">5 min before</SelectItem>
                    <SelectItem value="10">10 min before</SelectItem>
                    <SelectItem value="15">15 min before</SelectItem>
                    <SelectItem value="30">30 min before</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Gym reminders */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">
                  Gym reminders
                </span>
                <Select value={gymReminder} onValueChange={setGymReminder}>
                  <SelectTrigger className="w-32 border-zinc-700 bg-zinc-800 text-zinc-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-700 bg-zinc-800">
                    <SelectItem value="15">15 min before</SelectItem>
                    <SelectItem value="30">30 min before</SelectItem>
                    <SelectItem value="45">45 min before</SelectItem>
                    <SelectItem value="60">60 min before</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Streak warnings */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-zinc-400">
                    Streak warnings
                  </span>
                  <p className="text-xs text-zinc-600">Daily at 9 PM</p>
                </div>
                <button
                  onClick={() => setStreakWarning(!streakWarning)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    streakWarning ? "bg-orange-500" : "bg-zinc-700"
                  }`}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                      streakWarning ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Appearance */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-base">{"\uD83C\uDFA8"}</span>
            <div>
              <p className="text-sm font-medium text-white/90">Appearance</p>
              <p className="text-xs text-white/40">Choose your preferred theme</p>
            </div>
          </div>
          <div className="flex items-center gap-0.5 bg-white/[0.04] rounded-full p-0.5">
            <button className="px-3 py-1.5 rounded-full text-xs bg-white/[0.1] text-white font-medium transition-all">
              Dark
            </button>
            <button className="px-3 py-1.5 rounded-full text-xs text-white/30 hover:text-white/50 cursor-not-allowed transition-all"
              title="Coming soon">
              Light
            </button>
          </div>
        </div>
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

      {/* Spotify Playlists */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-zinc-300">
            <Music className="h-4 w-4 text-[#1DB954]" />
            Spotify Playlists
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Study Playlist URL
            </label>
            <Input
              value={studyPlaylist}
              onChange={(e) => setStudyPlaylist(e.target.value)}
              placeholder="https://open.spotify.com/playlist/... or leave empty for default"
              className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-600"
            />
            <p className="mt-1 text-[10px] text-zinc-600">
              Default: LoFi Beats playlist
            </p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Gym Playlist URL
            </label>
            <Input
              value={gymPlaylist}
              onChange={(e) => setGymPlaylist(e.target.value)}
              placeholder="https://open.spotify.com/playlist/... or leave empty for default"
              className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-600"
            />
            <p className="mt-1 text-[10px] text-zinc-600">
              Default: Beast Mode playlist
            </p>
          </div>
          <p className="text-xs text-zinc-500">
            Paste your Spotify playlist link. Supports both web URLs and
            spotify: URIs. Leave empty to use the default playlists.
          </p>
        </CardContent>
      </Card>

      {/* Google Calendar Sync */}
      <CalendarSync intakeCode={intakeCode} />

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
