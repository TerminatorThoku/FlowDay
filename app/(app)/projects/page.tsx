"use client";

import { redirect } from "next/navigation";

// Projects are integrated into the Tasks page
export default function ProjectsPage() {
  redirect("/tasks");
}
