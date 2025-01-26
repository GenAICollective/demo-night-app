"use client";

import { type Event } from "@prisma/client";
import { CalendarIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

import { UpsertEventModal } from "./components/UpsertEventModal";
import Logos from "~/components/Logos";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardTitle } from "~/components/ui/card";

export default function AdminHomePage() {
  const { data: currentEvent, refetch: refetchCurrentEvent } =
    api.event.getCurrent.useQuery();
  const { data: events, refetch: refetchEvents } =
    api.event.allAdmin.useQuery();
  const [modalOpen, setModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | undefined>(undefined);

  const refetch = () => {
    refetchCurrentEvent();
    refetchEvents();
  };

  const showUpsertEventModal = (event?: Event) => {
    setEventToEdit(event);
    setModalOpen(true);
  };

  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b bg-white/60 shadow-sm backdrop-blur">
        <div className="container mx-auto flex items-center justify-between gap-1 px-8 py-2">
          <Logos size={36} />
          <div className="flex flex-col items-center justify-center">
            <h1 className="line-clamp-1 font-kallisto text-xl font-bold leading-6 tracking-tight">
              Demo Night App
            </h1>
            <span className="font-kallisto text-sm font-bold text-muted-foreground">
              Admin Dashboard
            </span>
          </div>
          <div className="flex w-[108px] items-center justify-end" />
        </div>
      </header>
      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              "border-dashed border-border",
              "active:scale-95",
            )}
            onClick={() => showUpsertEventModal()}
          >
            <CardContent className="flex h-[88px] items-center justify-center p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <PlusIcon className="h-5 w-5" />
                <span className="font-medium">Create Event</span>
              </div>
            </CardContent>
          </Card>
          {events?.map((event) => (
            <Card
              key={event.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                "border-border",
                "active:scale-95",
              )}
              onClick={() => {
                router.push(`/admin/${event.id}`);
              }}
            >
              <CardContent className="p-4">
                <CardTitle className="flex items-start justify-between">
                  <div className="flex items-center">
                    <span className="line-clamp-1 pr-2 text-xl">
                      {event.name}
                    </span>
                    {event.id === currentEvent?.id && (
                      <div className="flex items-center gap-2 rounded-full bg-green-100 px-2 py-1">
                        <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />
                        <span className="text-xs font-semibold text-green-600">
                          LIVE
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      showUpsertEventModal(event);
                    }}
                  >
                    <span className="sr-only">Edit</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </Button>
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <time>
                    {event.date.toLocaleDateString("en-US", {
                      timeZone: "UTC",
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <UpsertEventModal
        event={eventToEdit}
        onSubmit={() => refetch()}
        onDeleted={() => {
          setModalOpen(false);
          refetch();
        }}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </main>
  );
}
