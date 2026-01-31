"use client";

import { useState } from "react";

interface ClockButtonProps {
  isClockedIn: boolean;
  onClockIn: () => Promise<void>;
  onClockOut: () => Promise<void>;
  disabled?: boolean;
}

export function ClockButton({
  isClockedIn,
  onClockIn,
  onClockOut,
  disabled,
}: ClockButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      if (isClockedIn) {
        await onClockOut();
      } else {
        await onClockIn();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        px-8 py-4 text-xl font-bold rounded-full transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          isClockedIn
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-green-500 hover:bg-green-600 text-white"
        }
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          {isClockedIn ? "Clocking Out..." : "Clocking In..."}
        </span>
      ) : isClockedIn ? (
        "Clock Out"
      ) : (
        "Clock In"
      )}
    </button>
  );
}
