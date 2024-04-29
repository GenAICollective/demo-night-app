"use client";

import { useAttendee } from "../hooks/useAttendee";
import useEventSync from "../hooks/useEventSync";
import { EventPhase } from "@prisma/client";

import { type CurrentEvent } from "~/server/api/routers/event";

import LoadingDots from "~/components/loading/loading-dots";

import DemoWorkspace from "./DemoWorkspace";
import EventHeader from "./EventHeader";
import PreEventWorkspace from "./PreEventWorkspace";

export default function Workspaces({
  currentEvent: initialCurrentEvent,
}: {
  currentEvent: CurrentEvent;
}) {
  const { currentEvent, event } = useEventSync(initialCurrentEvent);
  const { attendee, setAttendee } = useAttendee(initialCurrentEvent.id);

  function workspace() {
    switch (currentEvent?.phase) {
      case EventPhase.PRE:
        return (
          <PreEventWorkspace attendee={attendee} setAttendee={setAttendee} />
        );
      case EventPhase.DEMO:
        if (!event || event.demos.length === 0) return <LoadingScreen />;
        return (
          <DemoWorkspace
            currentEvent={currentEvent}
            attendee={attendee}
            demos={event.demos}
          />
        );
      case EventPhase.VOTING:
        return <p>{`${currentEvent.phase} - ${currentEvent.currentDemoId}`}</p>;
      case EventPhase.RESULTS:
        return <p>{`${currentEvent.phase} - ${currentEvent.currentDemoId}`}</p>;
    }
  }

  return (
    <>
      <EventHeader
        currentEvent={currentEvent}
        attendee={attendee}
        setAttendee={setAttendee}
      />
      <div className="size-full flex-1 pt-12">{workspace()}</div>
    </>
  );
}

function LoadingScreen() {
  return (
    <div className="flex w-full flex-1 animate-pulse flex-col items-center justify-center gap-2 py-16 font-kallisto text-black">
      <h1 className="pt-4 text-center text-2xl font-semibold">
        Loading Demos!
      </h1>
      <p className="text-lg font-medium italic">(hold tight!)</p>
      <LoadingDots />
    </div>
  );
}
