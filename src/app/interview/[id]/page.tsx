"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  UserCheck,
  UserPen,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import type { Interview, InterviewMode } from "@/lib/types";
import { getUserTimezone } from "@/lib/timezones";

export default function InterviewDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const interviewId = params.id as string;

  const searchParams = useSearchParams();
  const isRecruiterView = searchParams.get("isRecruiter") === "true";

  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");

  useEffect(() => {
    loadInterview();
  }, [interviewId]);

  const loadInterview = async () => {
    try {
      const response = await fetch(`/api/interviews/${interviewId}`);
      const data = await response.json();
      setInterview(data.interview);
    } catch (error) {
      console.error("Error loading interview:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInterviewEdited = async () => {};
  const handleInterviewCancel = async () => {
    router.back();
  };

  const handleBookSlot = async () => {
    if (!selectedSlotId) return;

    setBooking(true);
    try {
      const response = await fetch(`/api/interviews/${interviewId}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: selectedSlotId,
          candidateTimezone: getUserTimezone(),
        }),
      });

      if (response.ok) {
        await loadInterview();
        setSelectedSlotId("");
      }
    } catch (error) {
      console.error("Error booking slot:", error);
    } finally {
      setBooking(false);
    }
  };

  const getModeIcon = (mode: InterviewMode) => {
    switch (mode) {
      case "IN_PERSON":
        return <MapPin className="w-5 h-5" />;
      case "VIDEO":
        return <Video className="w-5 h-5" />;
      case "PHONE":
        return <Phone className="w-5 h-5" />;
    }
  };

  const getModeLabel = (mode: InterviewMode) => {
    switch (mode) {
      case "IN_PERSON":
        return "In Person";
      case "VIDEO":
        return "Video";
      case "PHONE":
        return "Phone";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-500";
      case "COMPLETED":
        return "bg-green-500";
      case "CANCELLED":
        return "bg-red-500";
      case "RESCHEDULED":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Interview Not Found</CardTitle>
            <CardDescription>
              The interview you&apos;re looking for doesn&apos;t exist.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const availableSlots = interview.availableSlots.filter(
    (slot) => !slot.isBooked
  );
  const isBooked = !!interview.bookedSlot;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-3xl">{interview.title}</CardTitle>
                <CardDescription className="text-base">
                  Interview Details
                </CardDescription>
              </div>
              <Badge className={getStatusColor(interview.status)}>
                {interview.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {interview.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{interview.description}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                {getModeIcon(interview.mode)}
                <div>
                  <p className="text-sm text-muted-foreground">
                    Interview Mode
                  </p>
                  <p className="font-medium">{getModeLabel(interview.mode)}</p>
                </div>
              </div>

              {interview.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{interview.location}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {interview.recruiter && (
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">Recruiter</h3>
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {interview.recruiter.user.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {interview.recruiter.user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {interview.candidate && (
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">Candidate</h3>
                  <div className="flex items-center gap-3">
                    <UserPen className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {interview.candidate.user.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {interview.candidate.user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Booked Slot */}
        {isBooked && interview.bookedSlot && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <CardTitle className="text-green-900">
                  Interview Scheduled
                </CardTitle>
              </div>
              <CardDescription>
                Your interview has been confirmed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 text-green-900">
                <Calendar className="w-5 h-5" />
                <div>
                  <p className="font-semibold text-lg">
                    {format(
                      parseISO(interview.bookedSlot.startTime),
                      "EEEE, MMMM d, yyyy"
                    )}
                  </p>
                  <p className="text-sm">
                    {format(parseISO(interview.bookedSlot.startTime), "h:mm a")}{" "}
                    - {format(parseISO(interview.bookedSlot.endTime), "h:mm a")}{" "}
                    ({interview.bookedSlot.recruiterTimezone})
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Slots */}
        {!isBooked && availableSlots.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Assigned Time Slots</CardTitle>
              <CardDescription>
                Assign a time slot for this interview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {availableSlots.map((slot) => {
                  const startTime = parseISO(slot.startTime);
                  const endTime = parseISO(slot.endTime);
                  const isSelected = selectedSlotId === slot.id;

                  return (
                    <Card
                      key={slot.id}
                      className={`cursor-pointer transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedSlotId(slot.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className="font-semibold">
                                {format(startTime, "EEEE, MMMM d, yyyy")}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span>
                                  {formatInTimeZone(
                                    startTime,
                                    interview.recruiter?.user.timezone ||
                                      getUserTimezone(),
                                    "h:mm a"
                                  )}{" "}
                                  -{" "}
                                  {formatInTimeZone(
                                    endTime,
                                    interview.recruiter?.user.timezone ||
                                      getUserTimezone(),
                                    "h:mm a"
                                  )}
                                </span>
                              </div>
                              <Badge variant="outline">
                                {interview.recruiter?.user.timezone ||
                                  getUserTimezone()}
                              </Badge>
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-6 h-6 text-primary" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {isRecruiterView && (
                <div className="flex items-center justify-end gap-2">
                  <Button
                    onClick={handleInterviewEdited}
                    disabled={selectedSlotId}
                    className="w-30"
                    size="lg"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleInterviewCancel}
                    size="lg"
                    className="w-30"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {!isBooked && availableSlots.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>No Available Slots</CardTitle>
              <CardDescription>
                There are currently no available time slots for this interview.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}
