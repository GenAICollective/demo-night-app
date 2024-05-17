import { colorForAttendeeType } from "~/lib/types/attendeeTypes";

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
