import { Calendar, Clock, Users, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-5xl font-bold mb-4 text-balance">
            Streamline Interview Scheduling
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-8">
            Create available time slots, manage your interview calendar, and
            keep track of all your scheduled interviews in one place.
          </p>
          <Link href="/recruiter">
            <Button size="lg" className="text-lg px-8">
              Go to Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Manage Time Slots</CardTitle>
              <CardDescription>
                Set up your available interview times with flexible scheduling
                options
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>View Interviews</CardTitle>
              <CardDescription>
                View all your scheduled interviews and track booking status
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Settings & Config</CardTitle>
              <CardDescription>
                Customize your preferences and configure timezone settings
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Simple • Efficient • Professional</p>
        </div>
      </div>
    </div>
  );
}
