import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { SlotStatus, InterviewStatus } from "@/generated/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const bookedSlotId = body.slotId;

    const updatedInterview = await prisma.interview.update({
      where: { id: body.interviewId },
      data: {
        status: InterviewStatus.CONFIRMED,
        bookedSlotId,
      },
      include: {
        bookedSlot: true,
      },
    });

    await prisma.slot.update({
      where: { id: bookedSlotId },
      data: {
        status: SlotStatus.BOOKED,
      },
    });

    return NextResponse.json({ interview: updatedInterview });
  } catch (error) {
    console.error("Error booking interview:", error);
    return NextResponse.json(
      { error: "Failed to book interview" },
      { status: 500 }
    );
  }
}
