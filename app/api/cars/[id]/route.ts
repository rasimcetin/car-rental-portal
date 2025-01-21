import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// This is an API Route handler, not a React component
// Params are provided synchronously by Next.js in the route handler context
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = await params.id;

  if (!id) {
    return NextResponse.json({ error: "Car ID is required" }, { status: 400 });
  }

  try {
    const car = await prisma.car.findUnique({
      where: {
        id,
      },
      include: {
        tenant: true,
      },
    });

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error("Failed to fetch car:", error);
    return NextResponse.json({ error: "Failed to fetch car" }, { status: 500 });
  }
}
