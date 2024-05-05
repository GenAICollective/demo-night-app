"use client";

import { useDashboardContext } from "../../contexts/DashboardContext";
import { type Event } from "@prisma/client";
import Image from "next/image";
import { useEffect, useMemo } from "react";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

import { useModal } from "~/components/modal/provider";

import { DeleteEventButton } from "./DeleteEvent";
import { UpsertEventModal } from "./UpsertEventModal";

export default function EventSelectionHeader({
  selectedEventId,
  setSelectedEventId,
}: {
  selectedEventId?: string;
  setSelectedEventId: (eventId?: string) => void;
}) {
  const { currentEvent, refetchEvent } = useDashboardContext();
  const modal = useModal();
  const { data: events, refetch: _refetchEvents } = api.event.all.useQuery();
  const updateCurrentMutation = api.event.updateCurrent.useMutation();

  const refetch = () => {
    refetchEvent();
    _refetchEvents();
  };

  useEffect(() => {
    if (events && events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0]!.id);
    }
  }, [events, selectedEventId, setSelectedEventId]);

  const isCurrent = useMemo(
    () => events?.filter((e) => e.id === currentEvent?.id)[0],
    [events, currentEvent],
  );

  const showUpsertEventModal = (event?: Event) => {
    modal?.show(<UpsertEventModal event={event} onSubmit={() => refetch()} />);
  };

  return (
    <header className="flex w-full items-center justify-between bg-gray-100 p-2 text-black">
      <div className="flex flex-row items-center gap-2">
        <Image src="/images/logo.png" alt="logo" width={40} height={40} />
        <label className="font-semibold">Event:</label>
        {events && events.length > 0 && (
          <div className="flex flex-row items-center gap-2">
            <select
              className="rounded-xl border border-gray-200 p-2 font-medium"
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
          <>
            <button
              className="w-28 rounded-xl bg-blue-200 p-2 font-semibold transition-all hover:bg-blue-300 focus:outline-none"
              onClick={() => {
                showUpsertEventModal(
                  events?.find((e) => e.id === selectedEventId),
                );
              }}
            >
              Edit Event
            </button>
            <button
              className={cn(
                "w-28 rounded-xl p-2 font-semibold transition-all focus:outline-none",
                isCurrent
                  ? "bg-red-200 hover:bg-red-300"
                  : "bg-green-200 hover:bg-green-300",
              )}
              onClick={() => {
                updateCurrentMutation
                  .mutateAsync(isCurrent ? null : selectedEventId)
                  .then(() => refetch());
              }}
            >
              {isCurrent ? "Stop" : "Start"} Event
            </button>
          </>
        )}
      </div>
      <div className="flex flex-row items-center gap-2">
        {selectedEventId && (
          <DeleteEventButton
            eventId={selectedEventId}
            onDeleted={() => {
              setSelectedEventId(undefined);
              refetch();
            }}
          />
        )}
        <button
          className="w-28 rounded-xl bg-blue-200 p-2 font-semibold transition-all hover:bg-blue-300 focus:outline-none"
          onClick={() => showUpsertEventModal()}
        >
          Create Event
        </button>
      </div>
    </header>
  );
}
