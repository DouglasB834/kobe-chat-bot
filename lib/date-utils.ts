import { differenceInCalendarDays, parseISO } from "date-fns";

export function isLancamento(
  postedAt: string | Date,
  withinDays: number = 6
): boolean {
  const date =
    typeof postedAt === "string" ? parseISO(postedAt) : postedAt;
  const now = new Date();
  const daysSince = differenceInCalendarDays(now, date);
  return daysSince >= 0 && daysSince <= withinDays;
}
