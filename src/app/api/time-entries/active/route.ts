import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCompany } from "@/lib/session";

// GET /api/time-entries/active - Get the current active time entry
export async function GET() {
  try {
    const user = await requireCompany();

    const activeEntry = await prisma.timeEntry.findFirst({
      where: {
        userId: user.id,
        clockOut: null,
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
    });

    return NextResponse.json(activeEntry);
  } catch (error) {
    console.error("Error fetching active time entry:", error);
    return NextResponse.json(
      { error: "Failed to fetch active time entry" },
      { status: 500 }
    );
  }
}
