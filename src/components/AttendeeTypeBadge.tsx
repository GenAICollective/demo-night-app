import { AttendeeType } from "~/lib/types/attendeeTypes";

export function colorForAttendeeType(type: string): string {
  switch (type) {
    case AttendeeType.Founder:
      return "bg-blue-200";
    case AttendeeType.Investor:
      return "bg-green-200";
    case AttendeeType.Engineer:
      return "bg-purple-200";
    case AttendeeType.ProductManager:
      return "bg-yellow-200";
    case AttendeeType.Designer:
      return "bg-pink-200";
    case AttendeeType.Other:
    default:
      return "bg-gray-200";
  }
}

export default function AttendeeTypeBadge({ type }: { type: string | null }) {
  if (!type) return null;
  const color = colorForAttendeeType(type);
  return (
    <span
      className={`rounded-lg px-2 text-xs font-semibold ${color} text-${color.replace("bg-", "")}-800`}
    >
      {type}
    </span>
  );
}
