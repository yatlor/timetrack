import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCompany } from "@/lib/session";
import { z } from "zod";

const switchProjectSchema = z.object({
  projectId: z.string().nullable(),
});

// POST /api/time-entries/switch-project - Switch project on active time entry
export async function POST(request: NextRequest) {
  try {
    const user = await requireCompany();
    const body = await request.json();
    const { projectId } = switchProjectSchema.parse(body);

    // Get active time entry
    const activeEntry = await prisma.timeEntry.findFirst({
      where: {
        userId: user.id,
        clockOut: null,
      },
    });

    if (!activeEntry) {
      return NextResponse.json(
        { error: "No active time entry found. Please clock in first." },
        { status: 404 }
      );
    }

    // If projectId provided, verify it belongs to user's company
    if (projectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
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

    // Close current entry and create new one with new project
    const now = new Date();

    const [closedEntry, newEntry] = await prisma.$transaction([
      prisma.timeEntry.update({
        where: { id: activeEntry.id },
        data: { clockOut: now },
      }),
      prisma.timeEntry.create({
        data: {
          userId: user.id,
          projectId: projectId,
          clockIn: now,
          isBillable: activeEntry.isBillable,
        },
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
      }),
    ]);

    return NextResponse.json({
      closedEntry,
      newEntry,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error switching project:", error);
    return NextResponse.json(
      { error: "Failed to switch project" },
      { status: 500 }
    );
  }
}
