"use client";

import { useState, useEffect } from "react";

interface TimeDisplayProps {
  startTime?: Date | string | null;
  className?: string;
}

export function TimeDisplay({ startTime, className = "" }: TimeDisplayProps) {
  const [elapsed, setElapsed] = useState("00:00:00");

  useEffect(() => {
    if (!startTime) {
      setElapsed("00:00:00");
      return;
    }

    const start = new Date(startTime).getTime();

    function updateElapsed() {
      const now = Date.now();
      const diff = now - start;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setElapsed(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className={`font-mono text-4xl font-bold ${className}`}>
      {elapsed}
    </div>
  );
}
