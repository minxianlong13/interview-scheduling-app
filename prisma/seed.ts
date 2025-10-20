import { Prisma } from "../src/generated/prisma";
import { prisma } from "../src/db/prisma";

const recruiterData: Prisma.RecruiterCreateInput[] = [
  {
    user: {
      create: {
        email: "alice@prisma.io",
        name: "Alice",
        timezone: "America/New_York",
      },
    },
    company: "Tech Corp",
    slots: { create: [] },
    title: "HR Manager",
  },
  {
    user: {
      create: {
        email: "bob@prisma.io",
        name: "Bob",
        timezone: "Europe/London",
      },
    },
    company: "Biz Inc",
    slots: { create: [] },
    title: "Recruitment Specialist",
  },
];

const candidateData: Prisma.CandidateCreateInput[] = [
  {
    user: {
      create: {
        email: "charlie@prisma.io",
        name: "Charlie",
        timezone: "Asia/Tokyo",
      },
    },
    phone: "+81-90-1234-5678",
  },
  {
    user: {
      create: {
        email: "dave@prisma.io",
        name: "Dave",
        timezone: "Australia/Sydney",
      },
    },
    phone: "+61-2-1234-5678",
  },
];

export async function main() {
  for (const u of recruiterData) {
    await prisma.recruiter.create({ data: u });
  }

  for (const u of candidateData) {
    await prisma.candidate.create({ data: u });
  }
}

main();
