"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Interview } from "@/lib/types";
import { format, parseISO } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  User,
  ChevronRight,
  FilePenLine,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DeleteButton } from "./delete-button";

interface InterviewsListProps {
  interviews: Interview[];
  isRecruiterView?: boolean;
  onDelete: (interviewId: string) => void;
}

export function InterviewsList({
  interviews,
  isRecruiterView = true,
  onDelete,
}: Readonly<InterviewsListProps>) {
  const router = useRouter();

  console.log("InterviewsList interviews:", interviews);

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
      case "CONFIRMED":
        return "destructive";
      case "CANCELLED":
        return "outline";
      default:
        return "default";
    }
  };

  const handleInterviewClick = (interviewId: string) => {
    router.push(`/interview/${interviewId}?isRecruiter=${isRecruiterView}`);
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
        return (
          <Card
            key={interview.id}
            className="cursor-pointer hover:bg-accent/50 transition-colors"
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
                    className="flex items-center gap-2"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info("Edit interview feature coming soon!");
                    }}
                  >
                    <FilePenLine className="w-4 h-4" />
                    Edit
                  </Button>
                  <DeleteButton
                    onConfirm={(e) => {
                      e.stopPropagation();
                      onDelete(interview.id);
                    }}
                  />
                  <ChevronRight
                    onClick={() => handleInterviewClick(interview.id)}
                    className="w-5 h-5 text-muted-foreground"
                  />
                </div>
              </div>
            </CardHeader>

            {/** The interview is booked */}
            {interview.bookedSlotId && (
              <CardContent className="pt-0">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {interview.bookedSlot &&
                        format(
                          parseISO(interview.bookedSlot.startTime),
                          "MMM d, yyyy"
                        )}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>
                      {interview.bookedSlot &&
                        format(
                          parseISO(interview.bookedSlot.startTime),
                          "h:mm a"
                        )}{" "}
                      -{" "}
                      {interview.bookedSlot &&
                        format(
                          parseISO(interview.bookedSlot.endTime),
                          "h:mm a"
                        )}
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
