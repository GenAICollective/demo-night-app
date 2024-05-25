import { useWorkspaceContext } from "../../contexts/WorkspaceContext";
import { UpdateAttendeeButton } from "../UpdateAttendee";
import Image from "next/image";
import Link from "next/link";

import { EventPhase, allPhases, displayName } from "~/lib/types/currentEvent";

import { env } from "~/env";

export default function EventHeader() {
  const { currentEvent, attendee, setAttendee } = useWorkspaceContext();
  return (
    <header className="fixed left-0 right-0 z-[11] flex h-20 w-full select-none flex-col items-center bg-white/60 text-black backdrop-blur">
      <div className="flex w-full max-w-xl flex-1 flex-col items-center justify-between">
        <PhasePills currentPhase={currentEvent?.phase ?? EventPhase.Pre} />
        <div className="flex w-full flex-1 flex-row items-center justify-between px-3">
          <Link
            href={env.NEXT_PUBLIC_BASE_URL}
            className="-ml-1 flex items-center p-1"
            target="_blank"
          >
            <Image
              id="logo"
              src="/images/logo.png"
              alt="logo"
              width={36}
              height={36}
            />
          </Link>
          <h1 className="mt-1 line-clamp-1 text-ellipsis px-1 font-kallisto text-xl font-bold tracking-tight">
            {currentEvent?.name ?? ""}
          </h1>
          <div className="flex aspect-square w-9 items-center justify-center">
            {currentEvent?.phase !== EventPhase.Pre && (
              <UpdateAttendeeButton
                attendee={attendee}
                setAttendee={setAttendee}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function PhasePills({ currentPhase }: { currentPhase: EventPhase }) {
  return (
    <div className="flex w-full flex-row items-center justify-between gap-1 px-4 pt-1">
      {allPhases.map((phase) => (
        <div
          key={phase}
          className={`flex h-3 flex-1 items-center justify-center rounded-[6px] text-center font-kallisto text-[8px] font-bold tracking-wide backdrop-blur transition-all duration-500 ease-in-out ${
            phase === currentPhase
              ? "bg-orange-500/80 text-white"
              : "bg-black/5 text-gray-500"
          }`}
        >
          <p>{displayName(phase)}</p>
        </div>
      ))}
    </div>
  );
}
