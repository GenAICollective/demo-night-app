"use client";

import {
  type Attendee,
  type Award,
  type Demo,
  type Event,
  EventPhase,
} from "@prisma/client";
import Link from "next/link";
import { useState } from "react";

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
  const { event, refetchEvent, selectedEventId, setSelectedEventId } =
    useEventAdmin();

  return (
    <main className="flex min-h-screen w-full flex-col text-black">
      <EventSelectionHeader
        selectedEventId={selectedEventId}
        setSelectedEventId={setSelectedEventId}
      />
      {event ? (
        <EventDashboard event={event} refetchEvent={refetchEvent} />
      ) : (
        <div className="w-full p-2 text-center text-2xl font-semibold">
          No event selected
        </div>
      )}
    </main>
  );
}

function EventDashboard({
  event,
  refetchEvent,
}: {
  event: CompleteEvent;
  refetchEvent: () => void;
}) {
  const [phase, setPhase] = useState(event.phase);

  function dashboard() {
    switch (phase) {
      case EventPhase.PRE:
        return (
          <PreDashboard
            eventId={event.id}
            demos={event.demos}
            awards={event.awards}
            refetchEvent={refetchEvent}
          />
        );
      case EventPhase.DEMO:
        return (
          <DemoDashboard
            demos={event.demos}
            currentDemoId={event.currentDemoId}
            refetchEvent={refetchEvent}
          />
        );
      case EventPhase.VOTING:
        return <VotingDashboard />;
      case EventPhase.RESULTS:
        return <ResultsDashboard />;
    }
  }

  return (
    <div className="flex size-full flex-1 flex-col items-center justify-center gap-2 p-2 text-black">
      <Link
        className="pt-2 text-4xl font-bold hover:text-blue-500 hover:underline focus:outline-none"
        href={event?.url ?? ""}
        target="_blank"
      >
        {event?.name}
      </Link>
      <div className="flex w-full flex-1 flex-col justify-between gap-2">
        <PhaseSelector
          phase={phase}
          setPhase={setPhase}
          event={event}
          refetchEvent={refetchEvent}
        />
        <div className="flex size-full flex-1 flex-row gap-2">
          <div className="min-h-full flex-1">{dashboard()}</div>
          <AttendeeList
            attendees={event.attendees}
            refetchEvent={refetchEvent}
          />
        </div>
      </div>
    </div>
  );
}

function PhaseSelector({
  phase,
  setPhase,
  event,
  refetchEvent,
}: {
  phase: EventPhase;
  setPhase: (phase: EventPhase) => void;
  event: CompleteEvent;
  refetchEvent: () => void;
}) {
  const updatePhaseMutation = api.event.updatePhase.useMutation();

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center pb-2">
        <h3 className="font-semibold">Phase:</h3>
        <select
          className="ml-2 w-[120px] rounded-xl border border-gray-200 p-2"
          value={phase}
          onChange={(e) => setPhase(EventPhase[e.target.value as EventPhase])}
        >
          <option value="PRE">Pre-demos</option>
          <option value="DEMO">Demos</option>
          <option value="VOTING">Voting</option>
          <option value="RESULTS">Results</option>
        </select>
        <button
          className="ml-2 rounded-xl bg-green-200 p-2 font-semibold transition-all hover:bg-green-300 focus:outline-none"
          hidden={phase === event.phase}
          onClick={() =>
            updatePhaseMutation
              .mutateAsync({ id: event.id, phase: phase })
              .then(() => refetchEvent())
          }
        >
          Select Phase
        </button>
      </div>
    </div>
  );
}
