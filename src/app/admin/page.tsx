"use client";

import {
  type Attendee,
  type Award,
  type Demo,
  type Event,
} from "@prisma/client";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { type CurrentEvent, EventPhase } from "~/lib/currentEvent";
import { api } from "~/trpc/react";

import AttendeeList from "./components/AttendeeList";
import DemoDashboard from "./components/DemoDashboard";
import EventSelectionHeader from "./components/EventSelectionHeader";
import PreDashboard from "./components/PreDashboard";
import ResultsDashboard from "./components/ResultsDashboard";
import VotingDashboard from "./components/VotingDashboard";

import { useEventAdmin } from "./hooks/useEventAdmin";

type CompleteEvent = Event & {
  demos: Demo[];
  attendees: Attendee[];
  awards: Award[];
};

export default function AdminPage() {
  const { currentEvent, event, refetch, selectedEventId, setSelectedEventId } =
    useEventAdmin();

  return (
    <main className="flex min-h-screen w-full flex-col text-black">
      <EventSelectionHeader
        selectedEventId={selectedEventId}
        setSelectedEventId={setSelectedEventId}
        currentEvent={currentEvent}
        refetch={refetch}
      />
      {event ? (
        <EventDashboard
          currentEvent={currentEvent}
          event={event}
          refetch={refetch}
        />
      ) : (
        <div className="w-full p-2 text-center text-2xl font-semibold">
          No event selected
        </div>
      )}
    </main>
  );
}

function EventDashboard({
  currentEvent,
  event,
  refetch,
}: {
  currentEvent: CurrentEvent | null | undefined;
  event: CompleteEvent;
  refetch: () => void;
}) {
  const [phase, setPhase] = useState(currentEvent?.phase ?? EventPhase.Pre);

  function dashboard() {
    switch (phase) {
      case EventPhase.Pre:
        return (
          <PreDashboard
            eventId={event.id}
            demos={event.demos}
            awards={event.awards}
            refetchEvent={refetch}
          />
        );
      case EventPhase.Demos:
        return (
          <DemoDashboard
            demos={event.demos}
            currentDemoId={currentEvent?.currentDemoId}
            refetchEvent={refetch}
          />
        );
      case EventPhase.Voting:
        return (
          <VotingDashboard
            awards={event.awards}
            demos={event.demos}
            refetchEvent={refetch}
          />
        );
      case EventPhase.Results:
        return (
          <ResultsDashboard
            currentAwardId={currentEvent?.currentAwardId}
            awards={event.awards}
            demos={event.demos}
            refetchEvent={refetch}
          />
        );
    }
  }

  return (
    <div className="flex size-full flex-1 flex-col items-center justify-center gap-2 p-2 text-black">
      <Link
        className="group flex items-center gap-3 pt-2 transition-all focus:outline-none"
        href={event?.url ?? ""}
        target="_blank"
      >
        <h1 className="font-kallisto text-4xl font-bold tracking-tight group-hover:underline">
          {event?.name}
        </h1>
        <ArrowUpRight
          size={28}
          strokeWidth={3}
          className="-mt-[5px] rounded-lg bg-gray-200 p-[2px] text-gray-500 group-hover:bg-gray-300 group-hover:text-gray-700"
        />
      </Link>
      <div className="flex w-full flex-1 flex-col justify-between gap-2">
        <PhaseSelector
          phase={phase}
          setPhase={setPhase}
          currentEvent={currentEvent}
          refetch={refetch}
        />
        <div className="flex size-full flex-1 flex-row gap-2">
          <div className="min-h-full flex-1">{dashboard()}</div>
          <AttendeeList attendees={event.attendees} refetchEvent={refetch} />
        </div>
      </div>
    </div>
  );
}

function PhaseSelector({
  phase,
  setPhase,
  currentEvent,
  refetch,
}: {
  phase: EventPhase;
  setPhase: (phase: EventPhase) => void;
  currentEvent: CurrentEvent | null | undefined;
  refetch: () => void;
}) {
  const updateCurrentStateMutation = api.event.updateCurrentState.useMutation();

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center pb-2">
        <h3 className="font-semibold">Phase:</h3>
        <select
          className="ml-2 w-[120px] rounded-xl border border-gray-200 p-2 font-medium"
          value={phase}
          onChange={(e) => setPhase(e.target.value as EventPhase)}
        >
          <option value="pre">Pre-demos</option>
          <option value="demos">Demos</option>
          <option value="voting">Voting</option>
          <option value="results">Results</option>
          <option value="recap">Recap</option>
        </select>
        <button
          className="ml-2 rounded-xl bg-green-200 p-2 font-semibold transition-all hover:bg-green-300 focus:outline-none"
          hidden={phase === currentEvent?.phase}
          onClick={() =>
            updateCurrentStateMutation
              .mutateAsync({ phase: phase })
              .then(() => refetch())
          }
        >
          Select Phase
        </button>
      </div>
    </div>
  );
}
