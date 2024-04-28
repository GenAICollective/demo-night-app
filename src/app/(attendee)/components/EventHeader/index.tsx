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
    <header className="fixed top-0 flex h-12 w-full items-center justify-between bg-white/60 px-3 text-black backdrop-blur-xl">
      <div className="flex flex-row items-center">
        <Image src="/images/logo.png" alt="logo" width={25} height={25} />
        <h1 className="line-clamp-1 text-ellipsis px-3 font-kallisto text-xl font-bold tracking-tighter">
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
