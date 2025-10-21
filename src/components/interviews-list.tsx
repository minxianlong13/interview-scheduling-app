"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Interview, Slot } from "@/lib/types";
import { format, parseISO } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  Trash2,
  User,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface InterviewsListProps {
  interviews: Interview[];
  slots: Slot[];
  onDelete: (interviewId: string) => void;
}

export function InterviewsList({
  interviews,
  slots,
  onDelete,
}: Readonly<InterviewsListProps>) {
  const router = useRouter();

  console.log("InterviewsList interviews:", interviews);

  const getSlotById = (slotId?: string) => {
    if (!slotId) return null;
    return slots.find((s) => s.id === slotId);
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "IN_PERSON":
        return <MapPin className="w-4 h-4" />;
      case "VIRTUAL":
        return <Video className="w-4 h-4" />;
      case "PHONE":
        return <Phone className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "default";
      case "COMPLETED":
        return "secondary";
      case "CANCELLED":
        return "destructive";
      case "RESCHEDULED":
        return "outline";
      default:
        return "default";
    }
  };

  const handleInterviewClick = (interviewId: string) => {
    router.push(`/interview/${interviewId}`);
  };

  if (interviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No interviews scheduled yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {interviews.map((interview) => {
        const slot = getSlotById(interview.bookedSlotId);

        return (
          <Card
            key={interview.id}
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => handleInterviewClick(interview.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-lg truncate">
                      {interview.title}
                    </CardTitle>
                    <Badge
                      variant={getStatusColor(interview.status)}
                      className="shrink-0"
                    >
                      {interview.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      <span className="truncate">
                        {interview?.candidate?.user.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {getModeIcon(interview.mode)}
                      <span className="capitalize">
                        {interview.mode.replace("_", " ").toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(interview.id);
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </CardHeader>
            {slot && (
              <CardContent className="pt-0">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(parseISO(slot.startTime), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>
                      {format(parseISO(slot.startTime), "h:mm a")} -{" "}
                      {format(parseISO(slot.endTime), "h:mm a")}
                    </span>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
