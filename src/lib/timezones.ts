import { isBefore } from "date-fns";
import { Slot } from "./types";

export function formatTimeInTimezone(
  isoString: string,
  timezone: string
): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatDateInTimezone(
  isoString: string,
  timezone: string
): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatTimeOnlyInTimezone(
  isoString: string,
  timezone: string
): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function isSlotConflict(
  slot1: Slot,
  startTime: string,
  endTime: string
): boolean {
  const start1 = new Date(slot1.startTime);
  const end1 = new Date(slot1.endTime);
  const start2 = new Date(startTime);
  const end2 = new Date(endTime);

  // Two intervals overlap if each starts before the other ends
  return isBefore(start1, end2) && isBefore(start2, end1);
}

export function formatInTimezone(
  isoString: string,
  timezone: string,
  format?: string
): string {
  const date = new Date(isoString);

  // Default format if none provided
  if (!format) {
    return formatTimeInTimezone(isoString, timezone);
  }

  // Handle common format patterns
  if (format === "PPP 'at' p" || format.includes("PPP")) {
    // Long date format with time
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  }

  if (format === "PP") {
    // Medium date format
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  if (format === "p") {
    // Time only
    return formatTimeOnlyInTimezone(isoString, timezone);
  }

  // Default to full date and time
  return formatTimeInTimezone(isoString, timezone);
}
