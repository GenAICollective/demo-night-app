import { useWorkspaceContext } from "../../contexts/WorkspaceContext";
import { UpdateAttendeeButton } from "../UpdateAttendee";
import { EventPhase } from "@prisma/client";
import Image from "next/image";

export default function EventHeader() {
  const { currentEvent, attendee, setAttendee } = useWorkspaceContext();
  return (
    <header className="fixed top-0 flex h-20 w-full max-w-xl select-none flex-col items-center bg-white/60 text-black backdrop-blur">
      <PhasePills phase={currentEvent.phase} />
      <div className="flex w-full flex-1 flex-row items-center justify-between px-3">
        <Image src="/images/logo.png" alt="logo" width={36} height={36} />
        <h1 className="mt-1 line-clamp-1 text-ellipsis px-3 font-kallisto text-xl font-bold tracking-tight">
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

  const selectedPhaseIndex = Object.keys(phaseNames).indexOf(phase);

  return (
    <div className="flex w-full flex-row items-center justify-between px-2">
      {Object.entries(phaseNames).map(([phaseName, label], index) => (
        <div
          key={phaseName}
          className={`flex h-3 flex-1 items-center justify-center rounded-[6px] text-center font-kallisto text-[8px] font-bold tracking-wide backdrop-blur transition-all duration-1000 ease-in-out ${
            index === selectedPhaseIndex
              ? "bg-orange-500/70 text-black"
              : index < selectedPhaseIndex
                ? "bg-gray-300/50 text-black"
                : "bg-gray-200/50 text-black"
          }`}
        >
          <p>{label}</p>
        </div>
      ))}
    </div>
  );
}
