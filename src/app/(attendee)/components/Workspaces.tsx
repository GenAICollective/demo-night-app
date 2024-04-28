"use client";

import { EventPhase } from "@prisma/client";
import { useEffect } from "react";

import { type CurrentEvent } from "~/server/api/routers/event";
import { api } from "~/trpc/react";

import LoadingDots from "~/components/loading/loading-dots";

import DemoWorkspace from "./DemoWorkspace";
import { UpdateAttendeeButton } from "./UpdateAttendee";

export default function Workspaces({
  currentEvent: initialCurrentEvent,
}: {
  currentEvent: CurrentEvent;
}) {
  const { data: currentEvent } = api.event.getCurrent.useQuery(undefined, {
    initialData: initialCurrentEvent,
    refetchInterval: 5_000,
  });
  const { data: event, refetch: refetchEvent } = api.event.get.useQuery(
    currentEvent?.id ?? "",
    {
      enabled: !!currentEvent,
    },
  );
  const attendeeId = getAttendeeId();
  const { data: attendee, refetch: refetchAttendee } =
    api.attendee.get.useQuery({
      id: attendeeId,
      eventId: initialCurrentEvent.id,
    });

  useEffect(() => {
    if (currentEvent?.phase !== event?.phase) {
      refetchEvent();
    }
  }, [currentEvent, event, refetchEvent]);

  function workspace() {
    switch (currentEvent?.phase) {
      case EventPhase.PRE:
        return <p>{`${currentEvent.phase} - ${currentEvent.currentDemoId}`}</p>;
      case EventPhase.DEMO:
        if (!event) return <LoadingScreen />;
        return (
          <DemoWorkspace
            demos={event.demos}
            currentDemoId={currentEvent.currentDemoId}
          />
        );
      case EventPhase.VOTING:
        return <p>{`${currentEvent.phase} - ${currentEvent.currentDemoId}`}</p>;
      case EventPhase.RESULTS:
        return <p>{`${currentEvent.phase} - ${currentEvent.currentDemoId}`}</p>;
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col text-black">
      {attendee && (
        <UpdateAttendeeButton
          attendee={attendee}
          onUpdated={() => refetchAttendee()}
        />
      )}
      {workspace()}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen w-full animate-pulse flex-col items-center justify-center gap-2 pb-16 font-kallisto text-black">
      <h1 className="pt-4 text-center text-2xl font-semibold">
        Loading Demos!
      </h1>
      <p className="text-lg font-medium italic">(hold tight!)</p>
      <LoadingDots />
    </div>
  );
}

function getAttendeeId(clear = false): string {
  if (typeof window === "undefined") return ""; // SSR guard
  if (clear) localStorage.removeItem("attendeeId");
  let id = localStorage.getItem("attendeeId");
  if (id) return id;
  id = crypto.randomUUID();
  localStorage.setItem("attendeeId", id);
  return id;
}
