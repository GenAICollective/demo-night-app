import Image from "next/image";

import { api } from "~/trpc/server";

import EventHeader from "./components/EventHeader";
import Workspaces from "./components/Workspaces";

export default async function AttendeePage() {
  const currentEvent = await api.event.getCurrent();
  if (!currentEvent) {
    return (
      <main className="flex min-h-screen w-full flex-col items-center justify-center pb-16 font-kallisto text-black">
        <Image src="/images/logo.png" alt="logo" width={160} height={160} />
        <h1 className="pt-4 text-center text-2xl font-semibold">
          No active demo night 🥲
        </h1>
        <p className="text-lg font-medium italic">(hold tight!)</p>
      </main>
    );
  }
  return (
    <main className="flex min-h-screen w-full flex-col text-black">
      <EventHeader currentEvent={currentEvent} />
      <Workspaces currentEvent={currentEvent} />
    </main>
  );
}
