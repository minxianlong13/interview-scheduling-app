import CalendarView from "@/components/calendar-view";
import {
  CardDescription,
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slot } from "@/lib/types";

function TimeSlotPanel({
  slots,
  timezone,
}: Readonly<{
  slots: Slot[];
  timezone: string;
}>) {
  const bookedSlots = slots.filter((s) => s.isBooked);
  const availableSlots = slots.filter((s) => !s.isBooked);

  return (
    <>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Slots</CardDescription>
            <CardTitle className="text-3xl">{slots.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Available</CardDescription>
            <CardTitle className="text-3xl text-primary">
              {availableSlots.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Booked</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {bookedSlots.length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <CalendarView slots={slots} timezone={timezone} onDelete={() => {}} />
    </>
  );
}

export default TimeSlotPanel;
