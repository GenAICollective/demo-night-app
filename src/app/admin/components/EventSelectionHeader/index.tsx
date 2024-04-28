"use client";

import Image from "next/image";
import { useEffect } from "react";

import { api } from "~/trpc/react";

import { CreateEventButton } from "./CreateEvent";
import { DeleteEventButton } from "./DeleteEvent";

export default function EventSelectionHeader({
  selectedEventId,
  setSelectedEventId,
}: {
  selectedEventId?: string;
  setSelectedEventId: (eventId?: string) => void;
}) {
  const { data: events, refetch: refetchEvents } = api.events.all.useQuery();
  const makeCurrentMutation = api.events.makeCurrent.useMutation();

  useEffect(() => {
    if (events && events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0]!.id);
    }
  }, [events, selectedEventId, setSelectedEventId]);

  return (
    <header className="flex w-full items-center justify-between bg-gray-100 p-2 text-black">
      <div className="flex flex-row items-center gap-2">
        <Image src="/images/logo.png" alt="logo" width={40} height={40} />
        <label className="font-semibold">Event:</label>
        {events && events.length > 0 && (
          <div className="flex flex-row items-center gap-2">
            <select
              className="rounded-lg border border-gray-200 p-2"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
            >
              {events?.map((event) => (
                <option key={event.id} value={event.id}>
                  {`${event.name} • ${event.date.toLocaleDateString("en-US", { timeZone: "UTC" })}`}
                </option>
              ))}
            </select>
          </div>
        )}
        {selectedEventId && (
          <button
            className="rounded-lg bg-green-200 p-2 font-semibold transition-all hover:bg-green-300 focus:outline-none"
            hidden={
              events?.filter((e) => e.id === selectedEventId)[0]?.isCurrent
            }
            onClick={() =>
              makeCurrentMutation
                .mutateAsync(selectedEventId)
                .then(() => refetchEvents())
            }
          >
            Make Current
          </button>
        )}
      </div>
      <div className="flex flex-row items-center gap-2">
        {selectedEventId && (
          <DeleteEventButton
            eventId={selectedEventId}
            onDeleted={() => {
              setSelectedEventId(undefined);
              refetchEvents();
            }}
          />
        )}
        <CreateEventButton
          onCreated={(event) => {
            setSelectedEventId(event.id);
            refetchEvents();
          }}
        />
      </div>
    </header>
  );
}
