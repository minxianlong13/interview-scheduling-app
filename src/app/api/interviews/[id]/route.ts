import { prisma } from "@/db/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const interview = await prisma.interview.findFirst({
      where: { id },
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
    return NextResponse.json({ interview });
  } catch (error) {
    console.error("Error fetching interview details:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview details" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.interview.delete({
      where: { id },
    });
    return NextResponse.json(
      { message: "Interview deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting interview:", error);
    return NextResponse.json(
      { error: "Failed to delete interview" },
      { status: 500 }
    );
  }
}
