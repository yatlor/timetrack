# TimeTrack

A time tracking SaaS application built with Next.js, allowing companies to track employee hours and manage project billing.

## Features

- **Multi-tenant**: Companies can sign up and manage their own employees, customers, and projects
- **Clock In/Out**: Employees can easily clock in and out with one click
- **Project Tracking**: Assign time to specific projects for accurate billing
- **Customer Management**: Organize projects by customer for billing purposes
- **Reports**: Generate detailed time reports by date range, project, or customer
- **Role-based Access**: Admin, Manager, and Employee roles with appropriate permissions

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **Styling**: Tailwind CSS
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd timetrack
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your database URL and NextAuth secret:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/timetrack"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   ```

4. Generate Prisma client and push schema:
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages (login, register)
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth & registration
│   │   ├── customers/     # Customer CRUD
│   │   ├── projects/      # Project CRUD
│   │   └── time-entries/  # Time tracking API
│   └── dashboard/         # Protected dashboard pages
├── components/            # React components
├── lib/                   # Utility functions and configurations
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   └── session.ts        # Session helpers
└── types/                # TypeScript type definitions
prisma/
└── schema.prisma         # Database schema
```

## Database Schema

- **Company**: Multi-tenant organization
- **User**: Employees with role-based access
- **Customer**: Clients for billing purposes
- **Project**: Work items assigned to customers
- **TimeEntry**: Clock in/out records linked to projects

## API Routes

### Time Entries
- `GET /api/time-entries` - List time entries
- `POST /api/time-entries` - Clock in
- `GET /api/time-entries/active` - Get current active entry
- `POST /api/time-entries/clock-out` - Clock out
- `POST /api/time-entries/switch-project` - Switch project on active entry

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project (admin/manager only)

### Customers
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer (admin/manager only)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio

## License

MIT
