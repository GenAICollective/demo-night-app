"use client";

import QRCode from "react-qr-code";

import { type CurrentEvent } from "~/server/api/routers/event";

import useEventSync from "~/app/(attendee)/hooks/useEventSync";

export default function Presentations({
  currentEvent: initialCurrentEvent,
}: {
  currentEvent: CurrentEvent;
}) {
  const { currentEvent, event } = useEventSync(initialCurrentEvent);

  return (
    <div className="flex flex-col items-center justify-center gap-4 font-kallisto font-bold tracking-tight">
      <h1 className="text-4xl">{currentEvent.name}</h1>
      <QRCode size={256} value={window.location.origin} />
    </div>
  );
}
