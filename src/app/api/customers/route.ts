import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCompany } from "@/lib/session";
import { z } from "zod";

const createCustomerSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/customers - Get all customers for current company
export async function GET(request: NextRequest) {
  try {
    const user = await requireCompany();
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") !== "false";

    const customers = await prisma.customer.findMany({
      where: {
        companyId: user.companyId!,
        ...(activeOnly && { isActive: true }),
      },
      include: {
        _count: {
          select: {
            projects: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

// POST /api/customers - Create a new customer
export async function POST(request: NextRequest) {
  try {
    const user = await requireCompany();

    // Only admins and managers can create customers
    if (user.role !== "ADMIN" && user.role !== "MANAGER") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const data = createCustomerSchema.parse(body);

    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone,
        address: data.address,
        notes: data.notes,
        companyId: user.companyId!,
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}
