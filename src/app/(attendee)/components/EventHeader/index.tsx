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
    <header className="fixed top-0 flex h-12 w-full max-w-xl flex-col items-center bg-white/60 text-black backdrop-blur">
      {/* <PhasePills phase={currentEvent.phase} /> */}
      <div className="flex w-full flex-1 flex-row items-center justify-between px-3">
        <Image src="/images/logo.png" alt="logo" width={36} height={36} />
        <h1 className="mt-1 line-clamp-1 text-ellipsis px-3 font-kallisto text-xl font-bold tracking-tighter">
          {currentEvent.name}
        </h1>
        <div className="flex aspect-square w-9 items-center justify-center">
          {currentEvent.phase !== EventPhase.PRE && (
            <UpdateAttendeeButton
              attendee={attendee}
              setAttendee={setAttendee}
            />
          )}
        </div>
      </div>
    </header>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function PhasePills({ phase }: { phase: EventPhase }) {
  const phaseNames = {
    [EventPhase.PRE]: "Pre-Demos",
    [EventPhase.DEMO]: "Demos",
    [EventPhase.VOTING]: "Voting",
    [EventPhase.RESULTS]: "Results",
  };

  return (
    <div className="flex w-full flex-row items-center justify-between">
      {Object.entries(phaseNames).map(([phaseName, label]) => (
        <span
          key={phaseName}
          className={`h-3 flex-1 rounded-full p-[1px] text-center text-[7px] font-semibold backdrop-blur ${
            phaseName === phase
              ? "bg-orange-500/50 text-black"
              : "bg-gray-200/50 text-black"
          }`}
        >
          {label}
        </span>
      ))}
    </div>
  );
}
