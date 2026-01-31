"use client";

import { useState, useEffect, useCallback } from "react";

interface TimeEntry {
  id: string;
  clockIn: string;
  clockOut: string | null;
  isBillable: boolean;
  project?: {
    id: string;
    name: string;
    code?: string | null;
    hourlyRate?: string | null;
    customer?: {
      id: string;
      name: string;
    } | null;
  } | null;
}

interface ReportData {
  totalHours: number;
  billableHours: number;
  projectBreakdown: {
    projectId: string | null;
    projectName: string;
    customerName: string | null;
    hours: number;
    billableHours: number;
    hourlyRate: number | null;
    estimatedRevenue: number;
  }[];
}

function calculateHours(clockIn: string, clockOut: string | null): number {
  const start = new Date(clockIn).getTime();
  const end = clockOut ? new Date(clockOut).getTime() : Date.now();
  return (end - start) / (1000 * 60 * 60);
}

export default function ReportsPage() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });

      const response = await fetch(`/api/time-entries?${params}`);
      const data = await response.json();
      setEntries(data);

      // Calculate report data
      const totalHours = data.reduce((acc: number, entry: TimeEntry) => {
        return acc + calculateHours(entry.clockIn, entry.clockOut);
      }, 0);

      const billableHours = data
        .filter((entry: TimeEntry) => entry.isBillable)
        .reduce((acc: number, entry: TimeEntry) => {
          return acc + calculateHours(entry.clockIn, entry.clockOut);
        }, 0);

      // Group by project
      const projectMap = new Map<string | null, {
        projectName: string;
        customerName: string | null;
        hours: number;
        billableHours: number;
        hourlyRate: number | null;
      }>();

      data.forEach((entry: TimeEntry) => {
        const projectId = entry.project?.id || null;
        const hours = calculateHours(entry.clockIn, entry.clockOut);

        if (!projectMap.has(projectId)) {
          projectMap.set(projectId, {
            projectName: entry.project?.name || "No Project",
            customerName: entry.project?.customer?.name || null,
            hours: 0,
            billableHours: 0,
            hourlyRate: entry.project?.hourlyRate ? parseFloat(entry.project.hourlyRate) : null,
          });
        }

        const project = projectMap.get(projectId)!;
        project.hours += hours;
        if (entry.isBillable) {
          project.billableHours += hours;
        }
      });

      const projectBreakdown = Array.from(projectMap.entries()).map(([projectId, data]) => ({
        projectId,
        ...data,
        estimatedRevenue: data.hourlyRate ? data.billableHours * data.hourlyRate : 0,
      }));

      setReportData({
        totalHours,
        billableHours,
        projectBreakdown,
      });
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function formatHours(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  }

  if (loading && !reportData) {
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
      <h1 className="text-3xl font-bold mb-8">Reports</h1>

      {/* Date Range Filter */}
      <div className="bg-[var(--background)] border rounded-lg p-4 mb-6">
        <div className="flex items-end gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="px-3 py-2 border rounded-md bg-[var(--background)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="px-3 py-2 border rounded-md bg-[var(--background)]"
            />
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Update Report"}
          </button>
        </div>
      </div>

      {reportData && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[var(--background)] border rounded-lg p-6">
              <p className="text-sm text-[var(--muted-foreground)]">Total Hours</p>
              <p className="text-3xl font-bold">{formatHours(reportData.totalHours)}</p>
            </div>
            <div className="bg-[var(--background)] border rounded-lg p-6">
              <p className="text-sm text-[var(--muted-foreground)]">Billable Hours</p>
              <p className="text-3xl font-bold text-green-500">
                {formatHours(reportData.billableHours)}
              </p>
            </div>
            <div className="bg-[var(--background)] border rounded-lg p-6">
              <p className="text-sm text-[var(--muted-foreground)]">Time Entries</p>
              <p className="text-3xl font-bold">{entries.length}</p>
            </div>
          </div>

          {/* Project Breakdown */}
          <div className="bg-[var(--background)] border rounded-lg">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Project Breakdown</h2>
            </div>
            {reportData.projectBreakdown.length === 0 ? (
              <div className="p-8 text-center text-[var(--muted-foreground)]">
                No time entries found for this date range.
              </div>
            ) : (
              <div className="divide-y">
                {reportData.projectBreakdown.map((project) => (
                  <div key={project.projectId || "none"} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{project.projectName}</p>
                        {project.customerName && (
                          <p className="text-sm text-[var(--muted-foreground)]">
                            {project.customerName}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatHours(project.hours)}</p>
                        <p className="text-sm text-[var(--muted-foreground)]">
                          {formatHours(project.billableHours)} billable
                        </p>
                        {project.estimatedRevenue > 0 && (
                          <p className="text-sm text-green-500">
                            ${project.estimatedRevenue.toFixed(2)} est.
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 bg-[var(--secondary)] rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-[var(--primary)]"
                        style={{
                          width: `${(project.hours / reportData.totalHours) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
