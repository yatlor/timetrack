import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCompany } from "@/lib/session";
import { z } from "zod";

const createTimeEntrySchema = z.object({
  projectId: z.string().optional(),
  description: z.string().optional(),
  isBillable: z.boolean().optional().default(true),
});

// GET /api/time-entries - Get time entries for current user
export async function GET(request: NextRequest) {
  try {
    const user = await requireCompany();
    const { searchParams } = new URL(request.url);

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const projectId = searchParams.get("projectId");

    const where: Record<string, unknown> = {
      userId: user.id,
    };

    if (startDate || endDate) {
      where.clockIn = {};
      if (startDate) {
        (where.clockIn as Record<string, unknown>).gte = new Date(startDate);
      }
      if (endDate) {
        (where.clockIn as Record<string, unknown>).lte = new Date(endDate);
      }
    }

    if (projectId) {
      where.projectId = projectId;
    }

    const timeEntries = await prisma.timeEntry.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            code: true,
            customer: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { clockIn: "desc" },
    });

    return NextResponse.json(timeEntries);
  } catch (error) {
    console.error("Error fetching time entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch time entries" },
      { status: 500 }
    );
  }
}

// POST /api/time-entries - Clock in (start a new time entry)
export async function POST(request: NextRequest) {
  try {
    const user = await requireCompany();
    const body = await request.json();
    const data = createTimeEntrySchema.parse(body);

    // Check if user already has an active time entry
    const activeEntry = await prisma.timeEntry.findFirst({
      where: {
        userId: user.id,
        clockOut: null,
      },
    });

    if (activeEntry) {
      return NextResponse.json(
        { error: "You already have an active time entry. Please clock out first." },
        { status: 400 }
      );
    }

    // If projectId provided, verify it belongs to user's company
    if (data.projectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: data.projectId,
          companyId: user.companyId!,
          isActive: true,
        },
      });

      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }
    }

    const timeEntry = await prisma.timeEntry.create({
      data: {
        userId: user.id,
        projectId: data.projectId,
        description: data.description,
        isBillable: data.isBillable,
        clockIn: new Date(),
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return NextResponse.json(timeEntry, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error creating time entry:", error);
    return NextResponse.json(
      { error: "Failed to create time entry" },
      { status: 500 }
    );
  }
}
