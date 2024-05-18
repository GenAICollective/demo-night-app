import { redirect } from "next/navigation";

import { EventPhase } from "~/lib/types/currentEvent";
import { api } from "~/trpc/server";

import EventHeader from "./components/EventHeader";
import { UpdateDemoPage } from "./components/UpdateDemo";

export default async function DemoistPage({
  params: { eventId, demoId },
  searchParams: { secret },
}: {
  params: { eventId: string; demoId: string };
  searchParams: { secret: string };
}) {
  if (!secret) {
    redirect("/404?type=invalid-secret");
  }

  const currentEvent = await api.event.getCurrent();
  const event = await api.event.get(eventId);
  const demo = await api.demo.get({ id: demoId, secret });

  if (!event || !demo) {
    redirect("/404");
  }

  let showRecap = true;

  // Only show the recap page if the demo has already happened
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
        <UpdateDemoPage demo={demo} secret={secret} />
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
