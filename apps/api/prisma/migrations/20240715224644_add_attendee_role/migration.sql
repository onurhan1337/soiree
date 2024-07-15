/*
  Warnings:

  - The `role` column on the `EventAttendee` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ATTENDEE_ROLE" AS ENUM ('ORGANIZER', 'ATTENDEE', 'SPEAKER');

-- AlterTable
ALTER TABLE "EventAttendee" DROP COLUMN "role",
ADD COLUMN     "role" "ATTENDEE_ROLE" NOT NULL DEFAULT 'ATTENDEE';
