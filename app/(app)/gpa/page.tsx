"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
  semester: string;
}

const gradePoints: Record<string, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "F": 0.0,
};

const initialCourses: Course[] = [
  { id: "1", name: "Object-Oriented Programming", credits: 4, grade: "A-", semester: "Spring 2026" },
  { id: "2", name: "Linear Algebra", credits: 3, grade: "B+", semester: "Spring 2026" },
  { id: "3", name: "Data Analytics", credits: 3, grade: "A", semester: "Spring 2026" },
  { id: "4", name: "System Analysis & Design", credits: 3, grade: "B", semester: "Spring 2026" },
  { id: "5", name: "Intro to Programming", credits: 4, grade: "A", semester: "Fall 2025" },
  { id: "6", name: "Calculus I", credits: 3, grade: "B+", semester: "Fall 2025" },
  { id: "7", name: "English Composition", credits: 3, grade: "A-", semester: "Fall 2025" },
  { id: "8", name: "Physics I", credits: 4, grade: "B", semester: "Fall 2025" },
];

const semesterGPAs = [
  { sem: "Fall 2024", gpa: 3.1 },
  { sem: "Spring 2025", gpa: 3.3 },
  { sem: "Fall 2025", gpa: 3.45 },
  { sem: "Spring 2026", gpa: 3.52 },
];

export default function GPAPage() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [selectedSemester, setSelectedSemester] = useState("All");

  const semesters = Array.from(new Set(courses.map(c => c.semester)));
  const filtered = selectedSemester === "All" ? courses : courses.filter(c => c.semester === selectedSemester);

  const calculateGPA = (courseList: Course[]) => {
    let totalPoints = 0, totalCredits = 0;
    courseList.forEach(c => {
      const points = gradePoints[c.grade] ?? 0;
      totalPoints += points * c.credits;
      totalCredits += c.credits;
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  };

  const overallGPA = calculateGPA(courses);
  const semesterGPA = selectedSemester !== "All" ? calculateGPA(filtered) : overallGPA;
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="font-serif text-2xl font-bold text-stone-900">GPA Tracker</h1>
      <p className="text-sm text-stone-400 mt-1">Track your academic performance</p>

      {/* GPA Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
          <p className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">Cumulative GPA</p>
          <p className="font-mono text-4xl font-bold text-stone-900 mt-2">{overallGPA}</p>
          <p className="text-xs text-stone-400 mt-1">{totalCredits} total credits</p>
          <div className="mt-3 h-[4px] bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(parseFloat(overallGPA) / 4) * 100}%` }} />
          </div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
          <p className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">Semester GPA</p>
          <p className="font-mono text-4xl font-bold text-stone-900 mt-2">{semesterGPA}</p>
          <p className="text-xs text-green-600 mt-1">{"\u2191"} +0.07 from last semester</p>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
          <p className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">GPA Trend</p>
          {/* Simple line chart using SVG */}
          <svg viewBox="0 0 200 60" className="w-full h-[60px] mt-2">
            {semesterGPAs.map((s, i) => {
              const x = (i / (semesterGPAs.length - 1)) * 180 + 10;
              const y = 55 - ((s.gpa - 2.5) / 1.5) * 50;
              return (
                <g key={s.sem}>
                  {i > 0 && (
                    <line
                      x1={(((i - 1) / (semesterGPAs.length - 1)) * 180 + 10)}
                      y1={55 - ((semesterGPAs[i - 1].gpa - 2.5) / 1.5) * 50}
                      x2={x} y2={y}
                      stroke="#4f46e5" strokeWidth="2"
                    />
                  )}
                  <circle cx={x} cy={y} r="3" fill="#4f46e5" />
                  <text x={x} y={y - 8} textAnchor="middle" fontSize="7" fill="#78716c" fontFamily="monospace">{s.gpa}</text>
                </g>
              );
            })}
          </svg>
          <div className="flex justify-between text-[9px] text-stone-400 font-mono mt-1">
            {semesterGPAs.map(s => <span key={s.sem}>{s.sem.split(" ")[0][0]}{s.sem.split(" ")[1].slice(-2)}</span>)}
          </div>
        </div>
      </div>

      {/* Semester filter */}
      <div className="flex items-center gap-2 mt-6">
        <button onClick={() => setSelectedSemester("All")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedSemester === "All" ? "bg-indigo-600 text-white" : "bg-stone-100 text-stone-500 hover:bg-stone-200"}`}>
          All Semesters
        </button>
        {semesters.map(sem => (
          <button key={sem} onClick={() => setSelectedSemester(sem)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedSemester === sem ? "bg-indigo-600 text-white" : "bg-stone-100 text-stone-500 hover:bg-stone-200"}`}>
            {sem}
          </button>
        ))}
      </div>

      {/* Course Table */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-sm mt-4 overflow-hidden">
        <div className="grid grid-cols-[1fr_80px_60px_100px] gap-2 px-5 py-3 border-b border-stone-100 text-[11px] uppercase tracking-wider text-stone-400 font-medium">
          <span>Course</span><span>Credits</span><span>Grade</span><span>Points</span>
        </div>
        {filtered.map((course, i) => (
          <motion.div key={course.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="grid grid-cols-[1fr_80px_60px_100px] gap-2 px-5 py-3 border-b border-stone-50 hover:bg-stone-50 transition-colors items-center">
            <div>
              <p className="text-sm font-medium text-stone-800">{course.name}</p>
              <p className="text-[11px] text-stone-400">{course.semester}</p>
            </div>
            <span className="text-sm text-stone-600 font-mono">{course.credits}</span>
            <span className={`text-sm font-mono font-bold ${
              (gradePoints[course.grade] ?? 0) >= 3.7 ? "text-green-600" :
              (gradePoints[course.grade] ?? 0) >= 3.0 ? "text-blue-600" :
              (gradePoints[course.grade] ?? 0) >= 2.0 ? "text-amber-600" : "text-red-600"
            }`}>{course.grade}</span>
            <span className="text-sm text-stone-500 font-mono">{((gradePoints[course.grade] ?? 0) * course.credits).toFixed(1)}</span>
          </motion.div>
        ))}
      </div>

      {/* GPA Projection */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-sm mt-4 p-5">
        <h3 className="text-sm font-semibold text-stone-900">GPA Projection</h3>
        <p className="text-xs text-stone-400 mt-1">If you maintain current grades:</p>
        <div className="grid grid-cols-3 gap-3 mt-3">
          {[
            { label: "Best Case (all A)", gpa: "3.85" },
            { label: "Current Pace", gpa: overallGPA },
            { label: "Worst Case (all C)", gpa: "2.45" },
          ].map(p => (
            <div key={p.label} className="bg-stone-50 rounded-lg p-3 text-center">
              <p className="font-mono text-lg font-bold text-stone-900">{p.gpa}</p>
              <p className="text-[10px] text-stone-400 mt-0.5">{p.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
