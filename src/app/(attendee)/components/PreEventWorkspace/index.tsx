import { UpdateAttendeeForm } from "../UpdateAttendee";
import { type Attendee } from "@prisma/client";

export default function PreEventWorkspace({
  attendee,
  setAttendee,
}: {
  attendee: Attendee | null;
  setAttendee: (attendee: Attendee) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <UpdateAttendeeForm attendee={attendee} setAttendee={setAttendee} />
    </div>
  );
}
