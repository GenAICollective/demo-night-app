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
    <div className="flex size-full flex-1 flex-col items-center justify-center gap-2 p-4">
      <div className="absolute bottom-0 w-full max-w-xl p-4">
        <UpdateAttendeeForm attendee={attendee} setAttendee={setAttendee} />
      </div>
    </div>
  );
}
