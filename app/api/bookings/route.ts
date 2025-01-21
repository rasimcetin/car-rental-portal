import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { carId, startDate, endDate, totalPrice } = await request.json();

    // Validate required fields
    if (!carId || !startDate || !endDate || !totalPrice) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user and car details
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const car = await prisma.car.findUnique({
      where: { id: carId },
      include: { tenant: true },
    });

    if (!user || !car) {
      return NextResponse.json(
        { error: "Invalid user or car" },
        { status: 400 }
      );
    }

    // Check if car is available
    if (!car.available) {
      return NextResponse.json(
        { error: "Car is not available" },
        { status: 400 }
      );
    }

    // Check for overlapping bookings
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        carId,
        status: "CONFIRMED",
        OR: [
          {
            AND: [
              { startDate: { lte: new Date(startDate) } },
              { endDate: { gte: new Date(startDate) } },
            ],
          },
          {
            AND: [
              { startDate: { lte: new Date(endDate) } },
              { endDate: { gte: new Date(endDate) } },
            ],
          },
        ],
      },
    });

    if (overlappingBooking) {
      return NextResponse.json(
        { error: "Car is not available for selected dates" },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        carId: car.id,
        tenantId: car.tenant.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice,
        status: "CONFIRMED",
      },
    });

    // Update car availability
    await prisma.car.update({
      where: { id: carId },
      data: { available: false },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Failed to create booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { userId: user.id },
          { tenantId: user.id }
        ]
      },
      include: {
        car: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
