"use client";

import WeeklyReport from "@/components/report/WeeklyReport";
import { generateMockReportData } from "@/lib/reports/generator";

const reportData = generateMockReportData();

export default function ReportPage() {
  return <WeeklyReport data={reportData} />;
}
