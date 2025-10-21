-- CreateTable
CREATE TABLE "_AvailableSlots" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AvailableSlots_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AvailableSlots_B_index" ON "_AvailableSlots"("B");

-- AddForeignKey
ALTER TABLE "_AvailableSlots" ADD CONSTRAINT "_AvailableSlots_A_fkey" FOREIGN KEY ("A") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AvailableSlots" ADD CONSTRAINT "_AvailableSlots_B_fkey" FOREIGN KEY ("B") REFERENCES "Slot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
