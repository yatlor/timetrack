import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[var(--primary)]">TimeTrack</h1>
          <nav className="flex gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium hover:text-[var(--primary)]"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:opacity-90"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Simple Time Tracking for Your Team
          </h2>
          <p className="text-xl text-[var(--muted-foreground)] mb-8 max-w-2xl mx-auto">
            Let employees clock in and out, track time by project, and generate accurate reports for billing your customers.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 text-lg font-medium bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:opacity-90"
            >
              Start Free Trial
            </Link>
            <Link
              href="#features"
              className="px-8 py-3 text-lg font-medium border rounded-md hover:bg-[var(--secondary)]"
            >
              Learn More
            </Link>
          </div>
        </section>

        <section id="features" className="bg-[var(--secondary)] py-20">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">Features</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-[var(--background)] p-6 rounded-lg">
                <div className="w-12 h-12 bg-[var(--primary)] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2">Clock In/Out</h4>
                <p className="text-[var(--muted-foreground)]">
                  Simple one-click time tracking. Employees can clock in and out from any device.
                </p>
              </div>
              <div className="bg-[var(--background)] p-6 rounded-lg">
                <div className="w-12 h-12 bg-[var(--primary)] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2">Project Tracking</h4>
                <p className="text-[var(--muted-foreground)]">
                  Assign time to specific projects and customers for accurate billing and reporting.
                </p>
              </div>
              <div className="bg-[var(--background)] p-6 rounded-lg">
                <div className="w-12 h-12 bg-[var(--primary)] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2">Reports & Billing</h4>
                <p className="text-[var(--muted-foreground)]">
                  Generate detailed reports by employee, project, or customer for easy billing.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-[var(--muted-foreground)]">
          <p>&copy; {new Date().getFullYear()} TimeTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
