"use client";

import { WorkspaceContext } from "../contexts/WorkspaceContext";
import { useAttendee } from "../hooks/useAttendee";
import useEventSync from "../hooks/useEventSync";
import { EventPhase } from "@prisma/client";

import { type CurrentEvent } from "~/server/api/routers/event";

import LoadingDots from "~/components/loading/loading-dots";

import DemoWorkspace from "./DemoWorkspace";
import EventHeader from "./EventHeader";
import PreWorkspace from "./PreWorkspace";
import ResultsWorkspace from "./ResultsWorkspace";
import VotingWorkspace from "./VotingWorkspace";

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
        return <PreWorkspace />;
      case EventPhase.DEMO:
        if (!event || event.demos.length === 0) return <LoadingScreen />;
        return <DemoWorkspace demos={event.demos} />;
      case EventPhase.VOTING:
        if (!event || event.demos.length === 0) return <LoadingScreen />;
        return <VotingWorkspace awards={event.awards} demos={event.demos} />;
      case EventPhase.RESULTS:
        return <ResultsWorkspace />;
    }
  }

  return (
    <WorkspaceContext.Provider value={{ currentEvent, attendee, setAttendee }}>
      <EventHeader />
      <div className="size-full flex-1 pt-12">{workspace()}</div>
    </WorkspaceContext.Provider>
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
