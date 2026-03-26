"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell, Waves, Moon } from "lucide-react";
import GymLog from "@/components/lifestyle/GymLog";
import GymStats from "@/components/lifestyle/GymStats";
import SwimLog from "@/components/lifestyle/SwimLog";
import SwimStats from "@/components/lifestyle/SwimStats";
import SleepLog from "@/components/lifestyle/SleepLog";
import SleepStats from "@/components/lifestyle/SleepStats";

export default function LifestylePage() {
  return (
    <div className="space-y-6 px-4 py-4">
      <h1 className="text-xl font-bold text-zinc-100">Lifestyle Tracking</h1>

      <Tabs defaultValue="gym" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-zinc-900">
          <TabsTrigger
            value="gym"
            className="flex items-center gap-1.5 data-[state=active]:bg-zinc-800 data-[state=active]:text-green-400"
          >
            <Dumbbell className="h-3.5 w-3.5" />
            Gym
          </TabsTrigger>
          <TabsTrigger
            value="swim"
            className="flex items-center gap-1.5 data-[state=active]:bg-zinc-800 data-[state=active]:text-cyan-400"
          >
            <Waves className="h-3.5 w-3.5" />
            Swim
          </TabsTrigger>
          <TabsTrigger
            value="sleep"
            className="flex items-center gap-1.5 data-[state=active]:bg-zinc-800 data-[state=active]:text-indigo-400"
          >
            <Moon className="h-3.5 w-3.5" />
            Sleep
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gym" className="mt-4 space-y-6">
          <GymLog />
          <GymStats />
        </TabsContent>

        <TabsContent value="swim" className="mt-4 space-y-6">
          <SwimLog />
          <SwimStats />
        </TabsContent>

        <TabsContent value="sleep" className="mt-4 space-y-6">
          <SleepLog />
          <SleepStats />
        </TabsContent>
      </Tabs>
    </div>
  );
}
