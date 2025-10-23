"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Video,
  Building,
  Clock,
  ChevronRight,
} from "lucide-react";
import type { Interview } from "@/lib/types";
import { formatInTimezone, getUserTimezone } from "@/lib/timezones";
import { useRouter } from "next/navigation";

interface CandidateInterviewsListProps {
  interviews: Interview[];
  candidateTimezone?: string;
}

export function CandidateInterviewsList({
  interviews,
  candidateTimezone,
}: Readonly<CandidateInterviewsListProps>) {
  const router = useRouter();

  console.log("CandidateInterviewsList interviews:", interviews);
  if (interviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No interviews scheduled yet</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "COMPLETED":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "CONFIRMED":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "VIDEO":
        return <Video className="w-4 h-4" />;
      case "IN_PERSON":
        return <Building className="w-4 h-4" />;
      case "PHONE":
        return <Clock className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {interviews.map((interview) => (
        <Card
          key={interview.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push(`/interview/${interview.id}`)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">
                  {interview.title}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge
                    variant="outline"
                    className={getStatusColor(interview.status)}
                  >
                    {interview.status}
                  </Badge>
                  <span className="flex items-center gap-1">
                    {getModeIcon(interview.mode)}
                    {interview.mode.replace("_", " ")}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-sm">
              {interview.recruiter && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-medium">Recruiter:</span>
                  <span>{interview.recruiter.user.name}</span>
                </div>
              )}
              {interview.bookedSlot ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatInTimezone(
                      interview.bookedSlot.startTime,
                      candidateTimezone ?? getUserTimezone(),
                      "PPP 'at' p"
                    )}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <Clock className="w-4 h-4" />
                  <span>Awaiting slot selection</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
