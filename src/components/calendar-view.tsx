import { Slot } from "@/lib/types";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Calendar } from "./ui/calendar";
import { Clock, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  formatDateInTimezone,
  formatTimeOnlyInTimezone,
} from "@/lib/timezones";

interface CalendarViewProps {
  slots: Slot[];
  timezone: string;
  onDelete?: (slotId: string) => void;
}

function CalendarView({ slots, timezone, onDelete }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  // Get dates that have slots
  const datesWithSlots = new Set(
    slots.map((slot) => {
      const date = new Date(slot.startTime);
      return date.toDateString();
    })
  );

  // Filter slots for selected date
  const selectedDateSlots = selectedDate
    ? slots.filter((slot) => {
        const slotDate = new Date(slot.startTime);
        return slotDate.toDateString() === selectedDate.toDateString();
      })
    : [];

  // Sort slots by start time
  const sortedSlots = [...selectedDateSlots].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return (
    <div className="grid lg:grid-cols-[400px_1fr] gap-6">
      {/* Calendar Section */}
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
          <CardDescription>
            Choose a date to view interview slots
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={[{ before: new Date() }, { dayOfWeek: [0, 6] }]}
            modifiers={{
              hasSlots: (date) => datesWithSlots.has(date.toDateString()),
            }}
            modifiersClassNames={{
              hasSlots: "bg-primary/20 font-semibold",
            }}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      {/* Slots Section */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate
              ? formatDateInTimezone(selectedDate.toISOString(), timezone)
              : "Select a date"}
          </CardTitle>
          <CardDescription>
            {sortedSlots.length === 0
              ? "No interview slots scheduled"
              : `${sortedSlots.length} slot${
                  sortedSlots.length === 1 ? "" : "s"
                } scheduled`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedSlots.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No slots scheduled for this date</p>
              <p className="text-sm mt-2">
                Click &quot;Create Slot&quot; to add a new time slot
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedSlots.map((slot) => (
                <Card
                  key={slot.id}
                  className={
                    slot.isBooked
                      ? "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20"
                      : "border-border"
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={slot.isBooked ? "default" : "secondary"}
                            className={slot.isBooked ? "bg-green-600" : ""}
                          >
                            {slot.isBooked ? "Booked" : "Available"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {formatTimeOnlyInTimezone(slot.startTime, timezone)}{" "}
                            - {formatTimeOnlyInTimezone(slot.endTime, timezone)}
                          </span>
                        </div>
                        {/**slot.isBooked && slot.candidateName && (
                          <div className="mt-3 space-y-1.5 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <User className="w-4 h-4" />
                              <span>{slot.candidateName}</span>
                            </div>
                            {slot.candidateEmail && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="w-4 h-4" />
                                <span>{slot.candidateEmail}</span>
                              </div>
                            )}
                            {slot.candidateTimezone &&
                              slot.candidateTimezone !== timezone && (
                                <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
                                  Candidate timezone: {slot.candidateTimezone}
                                </div>
                              )}
                          </div>
                        ) */}
                      </div>
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(slot.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CalendarView;
