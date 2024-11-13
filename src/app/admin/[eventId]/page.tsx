"use client";

import { useEffect, useState } from "react";

import { EventPhase, allPhases, displayName } from "~/lib/types/currentEvent";
import { api } from "~/trpc/react";

import AttendeeList from "./components/AttendeeList";
import DemosDashboard from "./components/DemosDashboard";
import PreDashboard from "./components/PreDashboard";
import RecapDashboard from "./components/RecapDashboard";
import ResultsDashboard from "./components/ResultsDashboard";
import VotingDashboard from "./components/VotingDashboard";
import EventTitle from "~/components/EventTitle";

import {
  DashboardContext,
  useDashboardContext,
} from "./contexts/DashboardContext";
import { useEventAdmin } from "./hooks/useEventAdmin";

export default function AdminEventPage({
  params,
}: {
  params: { eventId: string };
}) {
  const {
    currentEvent,
    event,
    refetch: refetchEvent,
    setSelectedEventId,
  } = useEventAdmin();

  useEffect(() => {
    setSelectedEventId(params.eventId);
  }, [params.eventId, setSelectedEventId]);

  return (
    <main className="flex min-h-screen w-full flex-col text-black">
      <DashboardContext.Provider value={{ currentEvent, event, refetchEvent }}>
        {event ? (
          <EventDashboard />
        ) : (
          <div className="w-full p-2 text-center text-2xl font-semibold">
            No event selected
          </div>
        )}
      </DashboardContext.Provider>
    </main>
  );
}

function EventDashboard() {
  const { currentEvent, event } = useDashboardContext();
  const [phase, setPhase] = useState(currentEvent?.phase ?? EventPhase.Pre);

  function dashboard() {
    switch (phase) {
      case EventPhase.Pre:
        return <PreDashboard />;
      case EventPhase.Demos:
        return <DemosDashboard />;
      case EventPhase.Voting:
        return <VotingDashboard />;
      case EventPhase.Results:
        return <ResultsDashboard />;
      case EventPhase.Recap:
        return <RecapDashboard />;
    }
  }

  return (
    <div className="flex size-full flex-1 flex-col items-center justify-center gap-2 p-2 text-black">
      <EventTitle name={event?.name ?? ""} url={event?.url ?? ""} />
      <div className="flex w-full flex-1 flex-col justify-between gap-2">
        <PhaseSelector phase={phase} setPhase={setPhase} />
        <div className="flex size-full flex-1 flex-row gap-2">
          <div className="min-h-full flex-1">{dashboard()}</div>
          <AttendeeList />
        </div>
      </div>
    </div>
  );
}

function PhaseSelector({
  phase,
  setPhase,
}: {
  phase: EventPhase;
  setPhase: (phase: EventPhase) => void;
}) {
  const { currentEvent, event, refetchEvent } = useDashboardContext();
  const updateCurrentStateMutation = api.event.updateCurrentState.useMutation();

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center pb-2">
        <h3 className="font-semibold">Phase:</h3>
        <select
          className="ml-2 w-[120px] rounded-xl border border-gray-200 p-2 font-medium"
          value={phase}
          onChange={(e) => {
            const selectedPhase = parseInt(e.target.value, 10);
            if (!isNaN(selectedPhase)) {
              setPhase(selectedPhase as EventPhase);
            }
          }}
        >
          {allPhases.map((value) => (
            <option key={value} value={value}>
              {displayName(value)}
            </option>
          ))}
        </select>
        {currentEvent?.id === event?.id && (
          <button
            className="ml-2 rounded-xl bg-green-200 p-2 font-semibold transition-all hover:bg-green-300 focus:outline-none"
            hidden={phase === currentEvent?.phase}
            onClick={() =>
              updateCurrentStateMutation
                .mutateAsync({ phase: phase })
                .then(refetchEvent)
            }
          >
            Select Phase
          </button>
        )}
      </div>
    </div>
  );
}
