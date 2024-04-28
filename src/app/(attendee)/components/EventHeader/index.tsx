import { UpdateAttendeeButton } from "../UpdateAttendee";
import { type Attendee, EventPhase } from "@prisma/client";
import Image from "next/image";

import { type CurrentEvent } from "~/server/api/routers/event";

export default function EventHeader({
  currentEvent,
  attendee,
  setAttendee,
}: {
  currentEvent: CurrentEvent;
  attendee: Attendee | null;
  setAttendee: (attendee: Attendee) => void;
}) {
  return (
    <header className="flex w-full items-center justify-between bg-gray-100 p-2 text-black">
      <div className="flex flex-row items-center gap-2">
        <Image src="/images/logo.png" alt="logo" width={25} height={25} />
        <h1 className="font-kallisto text-xl font-bold tracking-tighter">
          {currentEvent.name}
        </h1>
      </div>
      <div className="flex flex-row items-center gap-2">
        {currentEvent.phase !== EventPhase.PRE && (
          <UpdateAttendeeButton attendee={attendee} setAttendee={setAttendee} />
        )}
      </div>
    </header>
  );
}
