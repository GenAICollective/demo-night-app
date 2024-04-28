"use client";

import { type Attendee } from "@prisma/client";

export default function AttendeeList({ attendees }: { attendees: Attendee[] }) {
  return (
    <div className="flex w-[300px] flex-col gap-2 rounded-xl bg-gray-100 p-4">
      <h2 className="text-2xl font-bold">
        Attendees ({attendees.length} total)
      </h2>
      <ul className="flex flex-col gap-2 overflow-auto">
        {attendees.map((attendee) => (
          <li key={attendee.id}>{attendee.name}</li>
        ))}
      </ul>
    </div>
  );
}
