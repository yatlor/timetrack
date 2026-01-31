import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCompany } from "@/lib/session";

// POST /api/time-entries/clock-out - Clock out from active time entry
export async function POST() {
  try {
    const user = await requireCompany();

    const activeEntry = await prisma.timeEntry.findFirst({
      where: {
        userId: user.id,
        clockOut: null,
      },
    });

    if (!activeEntry) {
      return NextResponse.json(
        { error: "No active time entry found" },
        { status: 404 }
      );
    }

    const updatedEntry = await prisma.timeEntry.update({
      where: { id: activeEntry.id },
      data: { clockOut: new Date() },
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

    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error("Error clocking out:", error);
    return NextResponse.json(
      { error: "Failed to clock out" },
      { status: 500 }
    );
  }
}
