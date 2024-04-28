"use client";

import {
  type Attendee,
  type Award,
  type Demo,
  type Event,
  EventPhase,
} from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";

import { api } from "~/trpc/react";

import AttendeeList from "./components/AttendeeList";
import DemoDashboard from "./components/DemoDashboard";
import EventSelectionHeader from "./components/EventSelectionHeader";
import PreEventDashboard from "./components/PreEventDashboard";

type CompleteEvent = Event & {
  demos: Demo[];
  attendees: Attendee[];
  awards: Award[];
};

export default function AdminPage() {
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(
    undefined,
  );
  const { data: event, refetch: refetchEvent } = api.event.getAdmin.useQuery(
    selectedEventId ?? "",
    {
      enabled: !!selectedEventId,
    },
  );

  useEffect(() => {
    if (selectedEventId) {
      refetchEvent();
    }
  }, [selectedEventId, refetchEvent]);

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
  const updatePhaseMutation = api.event.updatePhase.useMutation();

  function dashboard() {
    switch (phase) {
      case EventPhase.PRE:
        return (
          <PreEventDashboard
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
        return (
          <PreEventDashboard
            eventId={event.id}
            demos={event.demos}
            awards={event.awards}
            refetchEvent={refetchEvent}
          />
        );
      case EventPhase.RESULTS:
        return (
          <PreEventDashboard
            eventId={event.id}
            demos={event.demos}
            awards={event.awards}
            refetchEvent={refetchEvent}
          />
        );
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
      <div className="flex w-full flex-1 flex-row justify-between gap-2">
        <div className="flex flex-1 flex-col">
          <div className="flex flex-row items-center pb-2">
            <h3 className="font-semibold">Phase:</h3>
            <select
              className="ml-2 w-[150px] rounded-lg border border-gray-200 p-2"
              value={phase}
              onChange={(e) =>
                setPhase(EventPhase[e.target.value as EventPhase])
              }
            >
              <option value="PRE">Pre-event</option>
              <option value="DEMO">Demos</option>
              <option value="VOTING">Voting</option>
              <option value="RESULTS">Results</option>
            </select>
            <button
              className="ml-2 rounded-lg bg-green-200 p-2 font-semibold transition-all hover:bg-green-300 focus:outline-none"
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
          <div className="size-full flex-1">{dashboard()}</div>
        </div>
        <AttendeeList attendees={event.attendees} />
      </div>
    </div>
  );
}
