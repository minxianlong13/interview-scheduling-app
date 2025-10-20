import { prisma } from "@/db/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const slots = await prisma.slot.findMany({
      include: {
        recruiter: {
          include: {
            user: true,
          },
        },
      },
    });
    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Error fetching slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch slots" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Handle slot creation logic here
    const newSlot = await prisma.slot.create({
      data: {
        startTime: body.startTime,
        endTime: body.endTime,
        recruiterId: body.recruiterId,
      },
    });

    console.log("New slot created:", newSlot);

    return NextResponse.json({ newSlot }, { status: 201 });
  } catch (error) {
    console.error("Error creating slot:", error);
    return NextResponse.json(
      { error: "Failed to create slot" },
      { status: 500 }
    );
  }
}
