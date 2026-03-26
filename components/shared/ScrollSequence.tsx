"use client";
import { useRef, useEffect, useState } from "react";
import { useScroll } from "framer-motion";

interface ScrollSequenceProps {
  frames: string[];
  className?: string;
}

export function ScrollSequence({ frames, className }: ScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    frames.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedImages[index] = img;
        loadedCount++;
        if (loadedCount === frames.length) {
          setImages(loadedImages);
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx && loadedImages[0]) {
              canvas.width = loadedImages[0].naturalWidth;
              canvas.height = loadedImages[0].naturalHeight;
              ctx.drawImage(loadedImages[0], 0, 0);
            }
          }
        }
      };
    });
  }, [frames]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    if (images.length === 0) return;

    const unsubscribe = scrollYProgress.on("change", (progress) => {
      const frameIndex = Math.min(
        Math.floor(progress * images.length),
        images.length - 1
      );
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx && images[frameIndex]) {
        ctx.clearRect(0, 0, canvas!.width, canvas!.height);
        ctx.drawImage(images[frameIndex], 0, 0);
      }
    });
    return () => unsubscribe();
  }, [images, scrollYProgress]);

  const scrollHeight = frames.length * 12;

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${scrollHeight}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className={`max-w-full max-h-[80vh] object-contain ${className}`}
        />
      </div>
    </div>
  );
}
