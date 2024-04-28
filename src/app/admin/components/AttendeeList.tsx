"use client";

import { type Attendee } from "@prisma/client";
import { toast } from "sonner";

export default function AttendeeList({ attendees }: { attendees: Attendee[] }) {
  return (
    <div className="flex w-[300px] flex-col gap-2 rounded-xl bg-gray-100 p-4">
      <div className="flex flex-col justify-between">
        <h2 className="text-2xl font-bold">Attendees</h2>
        <p className="-mt-1 text-sm font-semibold text-gray-400">
          Total attendees: {attendees.length}
        </p>
      </div>
      <ul className="flex flex-col gap-2 overflow-auto">
        {attendees.map((attendee) => (
          <AttendeeItem key={attendee.id} attendee={attendee} />
        ))}
      </ul>
    </div>
  );
}

function AttendeeItem({ attendee }: { attendee: Attendee }) {
  const copyIdToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(attendee.id);
      toast.success("ID copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy ID.");
    }
  };

  return (
    <li
      className="flex cursor-pointer flex-row items-center gap-2 rounded-lg bg-white p-2 font-medium"
      onClick={copyIdToClipboard}
    >
      <div className="flex flex-1 flex-row items-center justify-between gap-2 rounded-lg font-medium focus:outline-none">
        {attendee.name ? (
          <span>{attendee.name}</span>
        ) : (
          <span className="italic text-gray-400">Anonymous</span>
        )}
      </div>
    </li>
  );
}
