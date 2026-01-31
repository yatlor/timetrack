"use client";

interface TimeEntry {
  id: string;
  clockIn: string;
  clockOut: string | null;
  description?: string | null;
  isBillable: boolean;
  project?: {
    id: string;
    name: string;
    code?: string | null;
    customer?: {
      id: string;
      name: string;
    } | null;
  } | null;
}

interface TimeEntryListProps {
  entries: TimeEntry[];
}

function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function calculateDuration(clockIn: string, clockOut: string | null): string {
  const start = new Date(clockIn).getTime();
  const end = clockOut ? new Date(clockOut).getTime() : Date.now();
  const diff = end - start;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function TimeEntryList({ entries }: TimeEntryListProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--muted-foreground)]">
        No time entries yet. Clock in to start tracking!
      </div>
    );
  }

  // Group entries by date
  const groupedEntries = entries.reduce<Record<string, TimeEntry[]>>((acc, entry) => {
    const date = formatDate(entry.clockIn);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(groupedEntries).map(([date, dateEntries]) => (
        <div key={date}>
          <h3 className="text-sm font-medium text-[var(--muted-foreground)] mb-2">
            {date}
          </h3>
          <div className="space-y-2">
            {dateEntries.map((entry) => (
              <div
                key={entry.id}
                className="border rounded-lg p-4 bg-[var(--background)]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {entry.project ? (
                        <span className="font-medium">
                          {entry.project.code && (
                            <span className="text-[var(--muted-foreground)] mr-1">
                              [{entry.project.code}]
                            </span>
                          )}
                          {entry.project.name}
                        </span>
                      ) : (
                        <span className="text-[var(--muted-foreground)]">
                          No project
                        </span>
                      )}
                      {entry.isBillable && (
                        <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                          Billable
                        </span>
                      )}
                    </div>
                    {entry.project?.customer && (
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {entry.project.customer.name}
                      </p>
                    )}
                    {entry.description && (
                      <p className="text-sm text-[var(--muted-foreground)] mt-1">
                        {entry.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-medium">
                      {calculateDuration(entry.clockIn, entry.clockOut)}
                    </p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {formatTime(entry.clockIn)} -{" "}
                      {entry.clockOut ? formatTime(entry.clockOut) : "now"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
