"use client";

import { type Attendee } from "@prisma/client";
import { toast } from "sonner";

import { api } from "~/trpc/react";

export default function AttendeeList({
  attendees,
  refetchEvent,
}: {
  attendees: Attendee[];
  refetchEvent: () => void;
}) {
  return (
    <div className="flex min-w-[300px] flex-col gap-2 rounded-xl bg-gray-100 p-4">
      <div className="flex flex-col justify-between">
        <h2 className="text-2xl font-bold">Attendees</h2>
        <p className="-mt-1 text-sm font-semibold text-gray-400">
          Total attendees: {attendees.length}
        </p>
      </div>
      <ul className="flex flex-col gap-2 overflow-auto">
        {attendees.map((attendee) => (
          <AttendeeItem
            key={attendee.id}
            attendee={attendee}
            refetchEvent={refetchEvent}
          />
        ))}
      </ul>
    </div>
  );
}

function AttendeeItem({
  attendee,
  refetchEvent,
}: {
  attendee: Attendee;
  refetchEvent: () => void;
}) {
  const deleteMutation = api.attendee.delete.useMutation();
  const copyIdToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(attendee.id);
      toast.success("ID copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy ID.");
    }
  };

  return (
    <li className="flex flex-row items-center gap-2">
      <div
        className="flex-1 cursor-pointer rounded-xl bg-white p-2 font-medium focus:outline-none"
        onClick={copyIdToClipboard}
      >
        {attendee.name ? (
          <p>{attendee.name}</p>
        ) : (
          <p className="italic text-gray-400">Anonymous</p>
        )}
      </div>
      <button
        onClick={() => {
          deleteMutation.mutateAsync(attendee.id).then(() => refetchEvent());
        }}
      >
        🗑️
      </button>
    </li>
  );
}
