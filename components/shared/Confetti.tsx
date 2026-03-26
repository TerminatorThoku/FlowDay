"use client";

import confetti from "canvas-confetti";

export function fireConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#f97316", "#22c55e", "#3b82f6", "#8b5cf6", "#eab308"],
  });
}

export function fireStreakConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#f97316", "#eab308"],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#f97316", "#eab308"],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}
