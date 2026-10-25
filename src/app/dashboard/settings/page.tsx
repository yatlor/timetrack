"use client";

import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-[var(--background)] border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--muted-foreground)]">
                Name
              </label>
              <p className="mt-1">{session?.user?.name || "Not set"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--muted-foreground)]">
                Email
              </label>
              <p className="mt-1">{session?.user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--muted-foreground)]">
                Role
              </label>
              <p className="mt-1 capitalize">{session?.user?.role?.toLowerCase()}</p>
            </div>
          </div>
        </div>

        {/* Company Section */}
        <div className="bg-[var(--background)] border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Company</h2>
          <p className="text-[var(--muted-foreground)]">
            Company settings and team management coming soon.
          </p>
        </div>

        {/* Preferences Section */}
        <div className="bg-[var(--background)] border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Preferences</h2>
          <p className="text-[var(--muted-foreground)]">
            User preferences and notification settings coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
