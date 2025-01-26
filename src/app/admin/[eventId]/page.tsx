import { redirect } from "next/navigation";

import { api } from "~/trpc/server";

import { ClientEventDashboard } from "./ClientEventDashboard";

export default async function AdminEventPage({
  params,
}: {
  params: { eventId: string };
}) {
  const [event, currentEvent] = await Promise.all([
    api.event.getAdmin(params.eventId),
    api.event.getCurrent(),
  ]);

  if (!event) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen w-full">
      <ClientEventDashboard event={event} currentEvent={currentEvent} />
    </main>
  );
}
