"use client";

import { useState, useEffect, useCallback } from "react";
import { ClockButton } from "@/components/clock-button";
import { ProjectSwitcher } from "@/components/project-switcher";
import { TimeDisplay } from "@/components/time-display";
import { TimeEntryList } from "@/components/time-entry-list";

interface Project {
  id: string;
  name: string;
  code?: string | null;
  customer?: {
    id: string;
    name: string;
  } | null;
}

interface TimeEntry {
  id: string;
  clockIn: string;
  clockOut: string | null;
  description?: string | null;
  isBillable: boolean;
  project?: Project | null;
}

export default function DashboardPage() {
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [activeRes, entriesRes, projectsRes] = await Promise.all([
        fetch("/api/time-entries/active"),
        fetch("/api/time-entries"),
        fetch("/api/projects"),
      ]);

      const [activeData, entriesData, projectsData] = await Promise.all([
        activeRes.json(),
        entriesRes.json(),
        projectsRes.json(),
      ]);

      setActiveEntry(activeData);
      setEntries(entriesData);
      setProjects(projectsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleClockIn() {
    const response = await fetch("/api/time-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    if (response.ok) {
      await fetchData();
    }
  }

  async function handleClockOut() {
    const response = await fetch("/api/time-entries/clock-out", {
      method: "POST",
    });

    if (response.ok) {
      await fetchData();
    }
  }

  async function handleSwitchProject(projectId: string | null) {
    const response = await fetch("/api/time-entries/switch-project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId }),
    });

    if (response.ok) {
      await fetchData();
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <svg className="animate-spin h-8 w-8 text-[var(--primary)]" viewBox="0 0 24 24">
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
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Time Clock</h1>

      <div className="grid gap-6">
        {/* Clock In/Out Card */}
        <div className="bg-[var(--background)] border rounded-lg p-8">
          <div className="text-center">
            <TimeDisplay
              startTime={activeEntry?.clockIn}
              className={activeEntry ? "text-green-500" : "text-[var(--muted-foreground)]"}
            />
            <p className="text-[var(--muted-foreground)] mt-2 mb-6">
              {activeEntry ? "Currently clocked in" : "Not clocked in"}
            </p>
            <ClockButton
              isClockedIn={!!activeEntry}
              onClockIn={handleClockIn}
              onClockOut={handleClockOut}
            />
          </div>
        </div>

        {/* Project Switcher */}
        {activeEntry && projects.length > 0 && (
          <div className="bg-[var(--background)] border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Switch Project</h2>
            <ProjectSwitcher
              projects={projects}
              currentProjectId={activeEntry.project?.id}
              onSwitch={handleSwitchProject}
            />
          </div>
        )}

        {/* Recent Time Entries */}
        <div className="bg-[var(--background)] border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Time Entries</h2>
          <TimeEntryList entries={entries.slice(0, 10)} />
        </div>
      </div>
    </div>
  );
}
