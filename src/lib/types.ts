export interface User {
  id: string;
  name: string;
  email: string;
  timezone: string;
}

export interface Recruiter {
  id: string;
  user: User;
  title: string;
  company: string;
}

export interface Candidate {
  id: string;
  user: User;
  phone: string;
}

export enum InterviewMode {
  IN_PERSON = "IN_PERSON",
  VIDEO = "VIDEO",
  PHONE = "PHONE",
}

export enum InterviewStatus {
  SCHEDULED = "SCHEDULED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  CONFIRMED = "CONFIRMED",
}

export interface Slot {
  id: string;
  recruiterId: string;
  timeZone: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  isBooked: boolean;
}

export interface Interview {
  id: string;
  recruiterId: string;
  recruiter?: Recruiter;
  candidateId: string;
  candidate?: Candidate;
  title: string;
  description: string;
  location: string;
  mode: InterviewMode;
  status: InterviewStatus;
  startTime: string; // ISO string
  endTime: string; // ISO string
  availableSlots: Slot[];
  bookedSlotId?: string;
  bookedSlot?: Slot;
}
