import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Slot } from "./types";

dayjs.extend(utc);
dayjs.extend(timezone);

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

export function isSlotConflict(slot1: Slot, slot2: Slot) {
  const start1 = dayjs.tz(`${slot1.startTime}`, slot1.timeZone);
  const end1 = dayjs.tz(`${slot1.endTime}`, slot1.timeZone);
  const start2 = dayjs.tz(`${slot2.startTime}`, slot2.timeZone);
  const end2 = dayjs.tz(`${slot2.endTime}`, slot2.timeZone);

  return start1.isBefore(end2) && start2.isBefore(end1);
}
