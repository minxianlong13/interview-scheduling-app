export interface User {
  id: string;
  name: string;
  email: string;
  timezone: string;
}

export interface Recruiter extends User {
  company: string;
}

export interface Candidate extends User {
  phoneNumber: string;
}

export interface Slot {
  id: string;
  recruiterId: string;
  timeZone: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  isBooked: boolean;
}
