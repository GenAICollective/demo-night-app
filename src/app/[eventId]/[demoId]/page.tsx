import { redirect } from "next/navigation";

import { EventPhase } from "~/lib/currentEvent";
import { api } from "~/trpc/server";

import EventHeader from "./components/EventHeader";

export default async function DemoistPage({
  params: { eventId, demoId },
}: {
  params: { eventId: string; demoId: string };
}) {
  const event = await api.event.get(eventId);
  const currentEvent = await api.event.getCurrent();

  if (event === null) {
    redirect("/404");
  }

  let showRecap = true;

  // Redirect to edit page if event is in the future or it's pre-demo phase
  if (!currentEvent) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    if (date <= event.date) {
      showRecap = false;
    }
  } else if (currentEvent.phase === EventPhase.Pre) {
    showRecap = false;
  } else if (currentEvent.phase === EventPhase.Demos) {
    showRecap = false;
  }

  if (!showRecap) {
    return (
      <>
        <EventHeader eventName={event.name} />
        <div className="p-4 pt-14">
          <h1>Live!</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <EventHeader eventName={event.name} />
      <div className="p-4 pt-14">
        <h1>Recap!</h1>
      </div>
    </>
  );
}
