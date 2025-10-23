import { prisma } from "@/db/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const interviews = await prisma.interview.findMany({
      where: {
        candidateId: id,
      },
      include: {
        availableSlots: true,
        candidate: {
          include: {
            user: true,
          },
        },
        recruiter: {
          include: {
            user: true,
          },
        },
        bookedSlot: true,
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
