"use client";

import { Candidate, Recruiter } from "@/lib/types";
import { createContext, useContext, useEffect, useState } from "react";

type UserContextType = {
  candidate: Candidate | null;
  recruiter: Recruiter | null;
  loading: boolean;
};

// Create the context
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

// Create the provider
export function UserProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [recruiter, setRecruiter] = useState<Recruiter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecruiter = async () => {
      try {
        const response = await fetch("/api/recruiters");
        const data = await response.json();
        if (data.recruiters && data.recruiters.length > 0) {
          setRecruiter(data.recruiters[0]);
        }
      } catch (error) {
        console.error("Error loading recruiter:", error);
      }
    };

    const loadCandidates = async () => {
      try {
        const response = await fetch("/api/candidates");
        const data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
          setCandidate(data.candidates[0]);
        }
      } catch (error) {
        console.error("Error loading candidates:", error);
      }
    };

    Promise.all([loadCandidates(), loadRecruiter()]).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <UserContext.Provider value={{ candidate, recruiter, loading }}>
      {children}
    </UserContext.Provider>
  );
}

// ✅ Custom Hook
export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
