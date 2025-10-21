import { prisma } from "@/db/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const interviews = await prisma.interview.findMany({
      include: {
        availableSlots: true,
        candidate: {
          include: {
            user: true,
          },
        },
      },
    });
    return NextResponse.json({ interviews });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch interviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Handle interview creation logic here
    const newInterview = await prisma.interview.create({
      data: {
        title: body.title,
        description: body.description,
        location: body.location,
        mode: body.mode,
        status: "SCHEDULED",
        recruiterId: body.recruiterId,
        candidateId: body.candidateId,
        availableSlots: {
          connect: body.availableSlots.map((slot: { id: string }) => ({
            id: slot.id,
          })),
        },
      },
    });

    console.log("New interview created:", newInterview);

    return NextResponse.json({ newInterview }, { status: 201 });
  } catch (error) {
    console.error("Error creating interview:", error);
    return NextResponse.json(
      { error: "Failed to create interview" },
      { status: 500 }
    );
  }
}
