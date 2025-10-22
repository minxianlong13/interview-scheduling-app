import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Recruiter, Slot } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { isSlotConflict } from "@/lib/timezones";

interface CreateSlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recruiter: Recruiter | null;
  slots: Slot[];
  onSlotCreated: () => void;
}

const CreateSlotDialog = ({
  open,
  onOpenChange,
  recruiter,
  slots,
  onSlotCreated,
}: CreateSlotDialogProps) => {
  const [date, setDate] = React.useState("");
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    if (!date || !startTime || !endTime) return;

    // Combine date and time into ISO strings
    const startDateTime = new Date(`${date}T${startTime}:00`);
    const endDateTime = new Date(`${date}T${endTime}:00`);

    if (
      slots.some((slot) =>
        isSlotConflict(
          slot,
          startDateTime.toISOString(),
          endDateTime.toISOString()
        )
      )
    ) {
      toast.error("Time slot conflicts with existing slots");
      return;
    }

    if (endDateTime <= startDateTime) {
      toast.error("End time must be after start time");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recruiterId: recruiter?.id,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
        }),
      });

      if (response.ok) {
        onSlotCreated();
        // Reset form
        setDate("");
        setStartTime("");
        setEndTime("");
      }
    } catch (error) {
      console.error("Error creating slot:", error);
      toast.error("Failed to create slot");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Time Slot</DialogTitle>
          <DialogDescription>
            Add a new available time slot for candidates to book
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Creating..." : "Create Slot"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSlotDialog;
