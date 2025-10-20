"use client";

import React, { useEffect, useState } from "react";
import { Plus, Users, AlarmClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TimeSlotPanel from "./time-slot-panel";
import CreateSlotDialog from "@/components/create-slot";
import { Recruiter, Slot } from "@/lib/types";
import { getUserTimezone } from "@/lib/timezones";

const RecruiterPage = () => {
  const [recruiter, setRecruiter] = useState<Recruiter | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [showCreateSlotModal, setShowCreateSlotModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecruiter();
    loadSlots();
  }, []);

  const loadRecruiter = async () => {
    try {
      const response = await fetch("/api/recruiters");
      const data = await response.json();
      console.log("Fetched recruiter data:", data);
      if (data.recruiters && data.recruiters.length > 0) {
        setRecruiter({
          ...data.recruiters[0],
          name: data.recruiters[0].user.name,
          email: data.recruiters[0].user.email,
        });
      }
    } catch (error) {
      console.error("Error loading recruiter:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSlots = async () => {
    try {
      const response = await fetch("/api/slots");
      const data = await response.json();
      console.log("Fetched slots data:", data.slots);
      setSlots(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.slots.map((slot: any) => ({
          ...slot,
          timeZone: slot.recruiter.timezone,
          isBooked: slot.status.toUpperCase() !== "AVAILABLE",
        })) || []
      );
    } catch (error) {
      console.error("Error loading slots:", error);
    }
  };

  const handleSlotCreated = () => {
    // Refresh slots or give feedback
    loadSlots();
    setShowCreateSlotModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const recruiterSlots = slots.filter((s) => s.recruiterId === recruiter?.id);
  const defaultTimezone = getUserTimezone();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                {recruiter?.name} • {recruiter?.timezone ?? defaultTimezone}
              </p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={() => {}} size="lg" className="w-40">
                <Plus className="w-4 h-4" />
                Interview
              </Button>
              <Button
                onClick={() => setShowCreateSlotModal(true)}
                size="lg"
                className="w-40"
              >
                <Plus className="w-4 h-4" />
                Time Slot
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="w-full max-w-6xl mx-auto">
          <Tabs defaultValue="recruiter" className="w-full">
            {/* Tabs header */}
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recruiter">
                <Users className="w-6 h-6" />
                Interviews
              </TabsTrigger>
              <TabsTrigger value="candidate">
                <AlarmClock className="w-6 h-6" />
                Time-slots
              </TabsTrigger>
            </TabsList>

            {/* Tabs content */}
            <TabsContent value="recruiter" className="p-6">
              <div className="text-center text-gray-700">
                Recruiter view content goes here.
              </div>
            </TabsContent>

            <TabsContent value="candidate" className="p-6">
              <div className="text-center text-gray-700">
                <TimeSlotPanel
                  slots={recruiterSlots}
                  timezone={recruiter?.timezone || defaultTimezone}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modals */}
      <CreateSlotDialog
        open={showCreateSlotModal}
        onOpenChange={setShowCreateSlotModal}
        recruiter={recruiter}
        onSlotCreated={handleSlotCreated}
      />
    </div>
  );
};

export default RecruiterPage;
