"use client";

import { useState, useEffect, useCallback } from "react";

interface Customer {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
  description?: string | null;
  code?: string | null;
  hourlyRate?: string | null;
  isBillable: boolean;
  isActive: boolean;
  customer?: Customer | null;
  _count: {
    timeEntries: number;
  };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [projectsRes, customersRes] = await Promise.all([
        fetch("/api/projects?active=false"),
        fetch("/api/customers"),
      ]);

      const [projectsData, customersData] = await Promise.all([
        projectsRes.json(),
        customersRes.json(),
      ]);

      setProjects(projectsData);
      setCustomers(customersData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFormLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      code: formData.get("code") as string || undefined,
      description: formData.get("description") as string || undefined,
      customerId: formData.get("customerId") as string || undefined,
      hourlyRate: formData.get("hourlyRate") ? Number(formData.get("hourlyRate")) : undefined,
      isBillable: formData.get("isBillable") === "on",
    };

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to create project");
      }

      setShowForm(false);
      (e.target as HTMLFormElement).reset();
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setFormLoading(false);
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:opacity-90"
        >
          {showForm ? "Cancel" : "Add Project"}
        </button>
      </div>

      {showForm && (
        <div className="bg-[var(--background)] border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">New Project</h2>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Project Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-md bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                />
              </div>
              <div>
                <label htmlFor="code" className="block text-sm font-medium mb-1">
                  Project Code
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  placeholder="e.g., PROJ-001"
                  className="w-full px-3 py-2 border rounded-md bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={2}
                className="w-full px-3 py-2 border rounded-md bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="customerId" className="block text-sm font-medium mb-1">
                  Customer
                </label>
                <select
                  id="customerId"
                  name="customerId"
                  className="w-full px-3 py-2 border rounded-md bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                >
                  <option value="">No customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="hourlyRate" className="block text-sm font-medium mb-1">
                  Hourly Rate
                </label>
                <input
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border rounded-md bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="isBillable"
                name="isBillable"
                type="checkbox"
                defaultChecked
                className="rounded"
              />
              <label htmlFor="isBillable" className="text-sm">
                Billable project
              </label>
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:opacity-90 disabled:opacity-50"
            >
              {formLoading ? "Creating..." : "Create Project"}
            </button>
          </form>
        </div>
      )}

      <div className="bg-[var(--background)] border rounded-lg">
        {projects.length === 0 ? (
          <div className="p-8 text-center text-[var(--muted-foreground)]">
            No projects yet. Create your first project to start tracking time!
          </div>
        ) : (
          <div className="divide-y">
            {projects.map((project) => (
              <div key={project.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {project.code && (
                        <span className="text-[var(--muted-foreground)] mr-2">
                          [{project.code}]
                        </span>
                      )}
                      {project.name}
                    </span>
                    {!project.isActive && (
                      <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded">
                        Inactive
                      </span>
                    )}
                    {project.isBillable && (
                      <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                        Billable
                      </span>
                    )}
                  </div>
                  {project.customer && (
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Customer: {project.customer.name}
                    </p>
                  )}
                  {project.description && (
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {project.description}
                    </p>
                  )}
                </div>
                <div className="text-right text-sm text-[var(--muted-foreground)]">
                  {project._count.timeEntries} time entries
                  {project.hourlyRate && (
                    <p>${project.hourlyRate}/hr</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
