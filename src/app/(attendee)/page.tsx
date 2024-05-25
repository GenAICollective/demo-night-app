import HallOfFamePage from "../hall-of-fame/page";

import { api } from "~/trpc/server";

import Workspaces from "./components/Workspaces";

export async function generateMetadata() {
  const currentEvent = await api.event.getCurrent();
  return { title: currentEvent?.name ?? "GenAI Collective Demo Night!" };
}

export default async function AttendeePage() {
  const currentEvent = await api.event.getCurrent();
  if (!currentEvent) return <HallOfFamePage />;
  return (
    <main className="m-auto flex size-full max-w-xl flex-col text-black">
      <Workspaces currentEvent={currentEvent} />
    </main>
  );
}
