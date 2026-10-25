import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCompany } from "@/lib/session";
import { z } from "zod";

const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  code: z.string().optional(),
  hourlyRate: z.number().optional(),
  customerId: z.string().optional(),
  isBillable: z.boolean().optional().default(true),
});

// GET /api/projects - Get all projects for current company
export async function GET(request: NextRequest) {
  try {
    const user = await requireCompany();
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") !== "false";

    const projects = await prisma.project.findMany({
      where: {
        companyId: user.companyId!,
        ...(activeOnly && { isActive: true }),
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            timeEntries: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const user = await requireCompany();

    // Only admins and managers can create projects
    if (user.role !== "ADMIN" && user.role !== "MANAGER") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const data = createProjectSchema.parse(body);

    // Verify customer belongs to company if provided
    if (data.customerId) {
      const customer = await prisma.customer.findFirst({
        where: {
          id: data.customerId,
          companyId: user.companyId!,
        },
      });

      if (!customer) {
        return NextResponse.json(
          { error: "Customer not found" },
          { status: 404 }
        );
      }
    }

    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        code: data.code,
        hourlyRate: data.hourlyRate,
        customerId: data.customerId,
        isBillable: data.isBillable,
        companyId: user.companyId!,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
