import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, domain, description, adminEmail, adminPassword } = body;

    // Validate required fields
    if (!name || !domain || !adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if tenant domain already exists
    const existingTenant = await prisma.tenant.findUnique({
      where: { domain },
    });

    if (existingTenant) {
      return NextResponse.json(
        { error: "Tenant domain already exists" },
        { status: 400 }
      );
    }

    // Create tenant and admin user in a transaction
    const result = await prisma.$transaction(async (tx: PrismaClient) => {
      // Create tenant
      const tenant = await tx.tenant.create({
        data: {
          name,
          domain,
          description,
        },
      });

      // Create admin user
      const hashedPassword = await hash(adminPassword, 10);
      const user = await tx.user.create({
        data: {
          email: adminEmail,
          name: "Admin",
          password: hashedPassword,
          role: "ADMIN",
          tenants: {
            create: {
              tenantId: tenant.id,
              role: "ADMIN",
            },
          },
        },
      });

      return { tenant, user };
    });

    return NextResponse.json(
      {
        message: "Tenant created successfully",
        tenant: {
          id: result.tenant.id,
          name: result.tenant.name,
          domain: result.tenant.domain,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating tenant:", error);
    return NextResponse.json(
      { error: "Failed to create tenant" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const tenants = await prisma.tenant.findMany({
      select: {
        id: true,
        name: true,
        domain: true,
        description: true,
      },
    });

    return NextResponse.json(tenants);
  } catch (error) {
    console.error("Error fetching tenants:", error);
    return NextResponse.json(
      { error: "Failed to fetch tenants" },
      { status: 500 }
    );
  }
}
