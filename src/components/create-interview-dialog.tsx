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
import type {
  Recruiter,
  TimeSlot,
  InterviewMode,
  InterviewStatus,
} from "@/lib/types";
import { format, parseISO } from "date-fns";
import { Clock, MapPin, Video, Phone, UserIcon } from "lucide-react";

interface CreateInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recruiter: Recruiter;
  onInterviewCreated: () => void;
}

export function CreateInterviewDialog({
  open,
  onOpenChange,
  recruiter,
  onInterviewCreated,
}: CreateInterviewDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState<InterviewMode>("VIRTUAL");
  const [status, setStatus] = useState<InterviewStatus>("SCHEDULED");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePhone, setCandidatePhone] = useState("");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadSlots();
    }
  }, [open]);

  const loadSlots = async () => {
    try {
      const response = await fetch("/api/slots");
      const data = await response.json();
      const recruiterSlots = data.slots.filter(
        (s: TimeSlot) => s.recruiterId === recruiter.id && !s.isBooked
      );
      setSlots(recruiterSlots);
    } catch (error) {
      console.error("Error loading slots:", error);
    }
  };

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
      // Create candidate first
      const candidateResponse = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: candidateName,
          email: candidateEmail,
          phone: candidatePhone,
        }),
      });
      const candidateData = await candidateResponse.json();

      // Create interview
      await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recruiterId: recruiter.id,
          candidateId: candidateData.candidate.id,
          bookedSlotId: selectedSlotId || undefined,
          title,
          description,
          location,
          mode,
          status,
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
    setMode("VIRTUAL");
    setStatus("SCHEDULED");
    setSelectedDate(undefined);
    setSelectedSlotId("");
    setCandidateName("");
    setCandidateEmail("");
    setCandidatePhone("");
  };

  const getModeIcon = (mode: InterviewMode) => {
    switch (mode) {
      case "IN_PERSON":
        return <MapPin className="w-4 h-4" />;
      case "VIRTUAL":
        return <Video className="w-4 h-4" />;
      case "PHONE":
        return <Phone className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Interview</DialogTitle>
          <DialogDescription>
            Fill in the interview details and assign an available time slot
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
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
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Interview details, topics to cover, etc."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mode">Interview Mode *</Label>
                <Select
                  value={mode}
                  onValueChange={(value) => setMode(value as InterviewMode)}
                >
                  <SelectTrigger id="mode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIRTUAL">Virtual</SelectItem>
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

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as InterviewStatus)}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="RESCHEDULED">Rescheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border-t pt-4 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  Candidate Information
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="candidateName">Candidate Name *</Label>
                  <Input
                    id="candidateName"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="candidateEmail">Candidate Email *</Label>
                  <Input
                    id="candidateEmail"
                    type="email"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="candidatePhone">Candidate Phone</Label>
                  <Input
                    id="candidatePhone"
                    value={candidatePhone}
                    onChange={(e) => setCandidatePhone(e.target.value)}
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Slot Selection */}
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
                  modifiers={{
                    hasSlots: datesWithSlots,
                  }}
                  modifiersStyles={{
                    hasSlots: {
                      fontWeight: "bold",
                      textDecoration: "underline",
                    },
                  }}
                />
              </div>

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
                          selectedSlotId === slot.id
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedSlotId(slot.id)}
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
