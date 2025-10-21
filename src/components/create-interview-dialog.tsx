"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  InterviewMode,
  type Recruiter,
  type Slot,
  type Candidate,
} from "@/lib/types";
import { format, parseISO, set } from "date-fns";
import { Clock, UserIcon } from "lucide-react";

interface CreateInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recruiter: Recruiter | null;
  onInterviewCreated: () => void;
}

function CreateInterviewDialog({
  open,
  onOpenChange,
  recruiter,
  onInterviewCreated,
}: Readonly<CreateInterviewDialogProps>) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState<InterviewMode>(InterviewMode.VIRTUAL);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlots, setSelectedSlots] = useState<Slot[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);

  const loadSlots = async () => {
    try {
      const response = await fetch("/api/slots");
      const data = await response.json();
      const recruiterSlots = data.slots.filter(
        (s: Slot) => s.recruiterId === recruiter?.id && !s.isBooked
      );
      setSlots(recruiterSlots);
    } catch (error) {
      console.error("Error loading slots:", error);
    }
  };

  const loadCandidates = async () => {
    try {
      const response = await fetch("/api/candidates");
      const data = await response.json();
      console.log("Fetched candidates data:", data);
      setCandidates(data.candidates as Candidate[]);
    } catch (error) {
      console.error("Error loading candidates:", error);
    }
  };

  useEffect(() => {
    if (open) {
      loadSlots();
      loadCandidates();
    }
  }, [open]);

  const availableSlotsForDate = selectedDate
    ? slots.filter((slot) => {
        const slotDate = parseISO(slot.startTime);
        return (
          slotDate.getDate() === selectedDate.getDate() &&
          slotDate.getMonth() === selectedDate.getMonth() &&
          slotDate.getFullYear() === selectedDate.getFullYear()
        );
      })
    : [];

  const datesWithSlots = slots.map((slot) => parseISO(slot.startTime));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create interview
      await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recruiterId: recruiter?.id,
          candidateId: selectedCandidateId || undefined,
          availableSlots: selectedSlots,
          title,
          description,
          location,
          mode,
        }),
      });

      onInterviewCreated();
      resetForm();
    } catch (error) {
      console.error("Error creating interview:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setMode(InterviewMode.VIDEO);
    setSelectedDate(undefined);
    setSelectedSlots([]);
    setSelectedCandidateId("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-4xl max-h-[120vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Interview</DialogTitle>
          <DialogDescription>
            Fill in the interview details and assign an available time slot
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Left Column - Interview Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Interview Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Senior Developer Interview"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e: any) => setDescription(e.target.value)}
                  placeholder="Interview details, topics to cover, etc."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mode">Interview Mode *</Label>
                <Select
                  value={mode}
                  onValueChange={(value) => setMode(value as InterviewMode)}
                >
                  <SelectTrigger id="mode" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIDEO">Video</SelectItem>
                    <SelectItem value="IN_PERSON">In Person</SelectItem>
                    <SelectItem value="PHONE">Phone</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location / Meeting Link</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={
                    mode === "VIRTUAL"
                      ? "Zoom/Teams link"
                      : mode === "IN_PERSON"
                      ? "Office address"
                      : "Phone number"
                  }
                />
              </div>

              <div className="border-t pt-4 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  Candidate Information
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="candidate">Candidate Name *</Label>
                  <Select
                    value={selectedCandidateId}
                    onValueChange={(value) => setSelectedCandidateId(value)}
                  >
                    <SelectTrigger id="candidate" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {candidates.map((candidate) => (
                        <SelectItem key={candidate.id} value={candidate.id}>
                          {candidate.user.name} ({candidate.user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Middle Column - Calendar Selection */}
            <div className="space-y-4">
              <div>
                <Label>Assign Time Slot (Optional)</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Select a date to view available slots
                </p>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  disabled={[{ before: new Date() }, { dayOfWeek: [0, 6] }]}
                  modifiers={{
                    hasSlots: datesWithSlots,
                  }}
                  modifiersClassNames={{
                    hasSlots: "bg-blue-500 text-white rounded-full",
                    today: "text-blue-500 font-semibold underline", // optional: style today's date too,
                  }}
                />
              </div>
            </div>

            {/* Right Column - Calendar Selection */}
            <div className="space-y-4">
              {selectedDate && availableSlotsForDate.length > 0 && (
                <div className="space-y-2">
                  <Label>
                    Available Slots for {format(selectedDate, "MMM d, yyyy")}
                  </Label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {availableSlotsForDate.map((slot) => (
                      <Card
                        key={slot.id}
                        className={`cursor-pointer transition-colors ${
                          selectedSlots.includes(slot)
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() => {
                          if (selectedSlots.includes(slot)) {
                            setSelectedSlots(
                              selectedSlots.filter((s) => s !== slot)
                            );
                          } else {
                            setSelectedSlots([...selectedSlots, slot]);
                          }
                        }}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">
                                {format(parseISO(slot.startTime), "h:mm a")} -{" "}
                                {format(parseISO(slot.endTime), "h:mm a")}
                              </span>
                            </div>
                            <Badge variant="secondary">Available</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {selectedDate && availableSlotsForDate.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No available slots for this date
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Interview"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateInterviewDialog;
