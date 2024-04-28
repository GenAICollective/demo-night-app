import { type Attendee } from "@prisma/client";
import { useEffect, useState } from "react";

import { api } from "~/trpc/react";

export function useAttendee(eventId: string) {
  const [attendee, setAttendee] = useState<Attendee>(getLocalAttendee());
  const { data: attendeeData, refetch } = api.attendee.get.useQuery({
    id: attendee.id,
    eventId: eventId,
  });
  const updateMutation = api.attendee.update.useMutation();

  useEffect(() => {
    setLocalAttendee(attendee);
  }, [attendee]);

  useEffect(() => {
    if (attendeeData) {
      setAttendee(attendeeData);
    }
  }, [attendeeData]);

  useEffect(() => {
    if (!attendee) return;
    // Debounce update
    const handler = setTimeout(() => {
      updateMutation.mutate({
        id: attendee.id,
        name: attendee.name,
        email: attendee.email,
        type: attendee.type,
      });
    }, 5000);
    return () => clearTimeout(handler);
  }, [attendee]); // eslint-disable-line react-hooks/exhaustive-deps

  return { attendee, setAttendee, refetch };
}

function getLocalAttendee(): Attendee {
  if (typeof window !== "undefined") {
    const attendee = localStorage.getItem("attendee");
    if (attendee) return JSON.parse(attendee);
  }
  const attendee = {
    id: crypto.randomUUID(),
    name: null,
    email: null,
    type: null,
  };
  setLocalAttendee(attendee);
  return attendee;
}

function setLocalAttendee(attendee: Attendee) {
  if (typeof window === "undefined") return; // SSR guard
  localStorage.setItem("attendee", JSON.stringify(attendee));
}
