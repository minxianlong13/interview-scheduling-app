import { prisma } from "@/db/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const recruiters = await prisma.recruiter.findMany({
      include: {
        user: true,
      },
    });
    return NextResponse.json({ recruiters });
  } catch (error) {
    console.error("Error fetching recruiters:", error);
    return NextResponse.json(
      { error: "Failed to fetch recruiters" },
      { status: 500 }
    );
  }
}
