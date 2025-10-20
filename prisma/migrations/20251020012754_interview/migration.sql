/*
  Warnings:

  - Added the required column `mode` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Interview` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InterviewMode" AS ENUM ('IN_PERSON', 'VIDEO', 'PHONE');

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "description" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "mode" "InterviewMode" NOT NULL,
ADD COLUMN     "status" "InterviewStatus" NOT NULL DEFAULT 'SCHEDULED',
ADD COLUMN     "title" TEXT NOT NULL;
