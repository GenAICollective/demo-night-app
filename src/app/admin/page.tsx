"use client";

import { type Event } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

import { UpsertEventModal } from "./components/UpsertEventModal";
import { useModal } from "~/components/modal/provider";

import { DashboardContext } from "./[eventId]/contexts/DashboardContext";
import { useEventAdmin } from "./[eventId]/hooks/useEventAdmin";

export default function AdminHomePage() {
  const {
    currentEvent,
    event,
    refetch: refetchEvent,
    selectedEventId,
    setSelectedEventId,
  } = useEventAdmin();
  const modal = useModal();
  const { data: events, refetch: _refetchEvents } =
    api.event.allAdmin.useQuery();

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

  const showUpsertEventModal = (event?: Event) => {
    modal?.show(
      <UpsertEventModal
        event={event}
        onSubmit={() => refetch()}
        onDeleted={() => {
          setSelectedEventId(undefined);
          refetch();
        }}
      />,
    );
  };

  return (
    <main className="flex min-h-screen w-full flex-col text-black">
      <DashboardContext.Provider value={{ currentEvent, event, refetchEvent }}>
        <div className="flex items-center gap-2 p-2">
          <Image src="/images/logo.png" alt="logo" width={40} height={40} />
          <h1 className="line-clamp-1 font-kallisto text-2xl font-bold">
            Demo Night App Admin Dashboard
          </h1>
        </div>

        <div className="flex flex-col gap-4 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events?.map((event) => (
              <div
                key={event.id}
                className={cn(
                  "rounded-xl bg-gray-100 p-4",
                  event.id === selectedEventId
                    ? "border-blue-500"
                    : "border-gray-200",
                )}
                onClick={() => setSelectedEventId(event.id)}
                role="button"
              >
                <Link
                  href={`/admin/${event.id}`}
                  className="flex flex-col gap-1"
                >
                  <h3 className="line-clamp-1 text-xl font-bold">
                    {event.name}
                  </h3>
                  <p className="font-semibold leading-4 text-gray-600">
                    {event.date.toLocaleDateString("en-US", {
                      timeZone: "UTC",
                    })}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      className="flex-1 rounded-xl bg-blue-200 p-2 font-semibold transition-all hover:bg-blue-300 focus:outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        showUpsertEventModal(event);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className={cn(
                        "flex-1 rounded-xl p-2 font-semibold transition-all focus:outline-none",
                        event.id === currentEvent?.id
                          ? "bg-red-200 hover:bg-red-300"
                          : "bg-green-200 hover:bg-green-300",
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateCurrentMutation
                          .mutateAsync(
                            event.id === currentEvent?.id ? null : event.id,
                          )
                          .then(() => refetch());
                      }}
                    >
                      {event.id === currentEvent?.id ? "Stop" : "Start"}
                    </button>
                  </div>
                </Link>
              </div>
            ))}
            <button
              className="flex size-full items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-200 bg-white p-2 font-semibold transition-all hover:bg-gray-100 focus:outline-none"
              onClick={() => showUpsertEventModal()}
            >
              <PlusIcon className="size-4" strokeWidth={2.5} />
              Create Event
            </button>
          </div>
        </div>
      </DashboardContext.Provider>
    </main>
  );
}
