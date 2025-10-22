import Link from "next/link";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Calendar className="h-5 w-5" />
            </div>
            <span className="text-lg">Interview Scheduler</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/recruiter">
              <Button variant="ghost">Recruiter</Button>
            </Link>
            <Link href="/candidate">
              <Button variant="ghost">Candidate</Button>
            </Link>
            <Link href="/recruiter">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
