import Image from "next/image";

import { api } from "~/trpc/server";

import Presentations from "./components/Presentations";

export async function generateMetadata() {
  const currentEvent = await api.event.getCurrent();
  return { title: currentEvent?.name ?? "GenAI Collective Demo Night!" };
}

export default async function AdminPresentPage() {
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
    <main className="flex size-full min-h-screen flex-col items-center justify-center">
      <Presentations currentEvent={currentEvent} />
    </main>
  );
}
