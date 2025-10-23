"use client";

import { useState, useEffect } from "react";
import { CandidateInterviewsList } from "@/components/candidate-interview-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "lucide-react";
import type { Interview } from "@/lib/types";
import { useUserContext } from "@/hooks/useUserContext";

export default function CandidatePage() {
  const { candidate } = useUserContext();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (candidate) {
      fetchInterviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidate]);

  const fetchInterviews = async () => {
    if (!candidate) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/candidates/${candidate.id}/interviews`
      );
      const data = await response.json();
      console.log("Fetched interviews data:", data);
      setInterviews(data.interviews);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>My Interviews</CardTitle>
              <CardDescription>
                {candidate?.user.name} • {candidate?.user.email}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>Loading interviews...</p>
          </CardContent>
        </Card>
      ) : (
        <CandidateInterviewsList
          interviews={interviews}
          candidateTimezone={candidate?.user.timezone}
        />
      )}
    </div>
  );
}
