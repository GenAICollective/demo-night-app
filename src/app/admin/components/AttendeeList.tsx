"use client";

import { type Attendee } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import { api } from "~/trpc/react";

import AttendeeTypeBadge from "~/components/AttendeeTypeBadge";

export default function AttendeeList({
  attendees,
  refetchEvent,
}: {
  attendees: Attendee[];
  refetchEvent: () => void;
}) {
  return (
    <div className="flex min-w-[300px] max-w-[300px] flex-col gap-2 rounded-xl bg-gray-100 p-4">
      <div className="flex flex-col justify-between">
        <h2 className="text-2xl font-bold">Attendees</h2>
        <p className="-mt-1 text-sm font-semibold text-gray-400">
          Total attendees: {attendees.length}
        </p>
      </div>
      <ul className="flex flex-col gap-2 overflow-auto">
        <AnimatePresence>
          {attendees.map((attendee) => (
            <AttendeeItem
              key={attendee.id}
              attendee={attendee}
              refetchEvent={refetchEvent}
            />
          ))}
        </AnimatePresence>
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
    <motion.li
      className="flex flex-row items-center gap-2"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        title="Copy ID"
        className="flex flex-1 cursor-pointer flex-row items-center justify-start gap-1 rounded-xl bg-white p-2 text-start font-medium focus:outline-none"
        onClick={copyIdToClipboard}
      >
        {attendee.name ? (
          <p className="line-clamp-1">{attendee.name}</p>
        ) : (
          <p className="line-clamp-1 italic text-gray-400">Anonymous</p>
        )}
        <AttendeeTypeBadge type={attendee.type} />
      </button>
      <button
        title="Delete"
        onClick={() => {
          deleteMutation.mutateAsync(attendee.id).then(() => refetchEvent());
        }}
        className="focus:outline-none"
      >
        🗑️
      </button>
    </motion.li>
  );
}
