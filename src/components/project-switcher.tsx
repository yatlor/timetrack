"use client";

import { useState } from "react";

interface Project {
  id: string;
  name: string;
  code?: string | null;
  customer?: {
    id: string;
    name: string;
  } | null;
}

interface ProjectSwitcherProps {
  projects: Project[];
  currentProjectId?: string | null;
  onSwitch: (projectId: string | null) => Promise<void>;
  disabled?: boolean;
}

export function ProjectSwitcher({
  projects,
  currentProjectId,
  onSwitch,
  disabled,
}: ProjectSwitcherProps) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const currentProject = projects.find((p) => p.id === currentProjectId);

  async function handleSelect(projectId: string | null) {
    if (projectId === currentProjectId) {
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      await onSwitch(projectId);
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || loading}
        className="w-full px-4 py-3 text-left border rounded-lg bg-[var(--background)] hover:bg-[var(--secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-[var(--muted-foreground)]">Current Project</span>
            <p className="font-medium">
              {currentProject ? (
                <>
                  {currentProject.code && (
                    <span className="text-[var(--muted-foreground)] mr-2">
                      [{currentProject.code}]
                    </span>
                  )}
                  {currentProject.name}
                  {currentProject.customer && (
                    <span className="text-sm text-[var(--muted-foreground)] ml-2">
                      - {currentProject.customer.name}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-[var(--muted-foreground)]">No project selected</span>
              )}
            </p>
          </div>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 border rounded-lg bg-[var(--background)] shadow-lg max-h-60 overflow-auto">
          <button
            onClick={() => handleSelect(null)}
            className={`w-full px-4 py-3 text-left hover:bg-[var(--secondary)] ${
              !currentProjectId ? "bg-[var(--secondary)]" : ""
            }`}
          >
            <span className="text-[var(--muted-foreground)]">No project</span>
          </button>
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => handleSelect(project.id)}
              className={`w-full px-4 py-3 text-left hover:bg-[var(--secondary)] ${
                project.id === currentProjectId ? "bg-[var(--secondary)]" : ""
              }`}
            >
              <div>
                {project.code && (
                  <span className="text-[var(--muted-foreground)] mr-2">
                    [{project.code}]
                  </span>
                )}
                {project.name}
                {project.customer && (
                  <span className="text-sm text-[var(--muted-foreground)] ml-2">
                    - {project.customer.name}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
