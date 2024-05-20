import Image from "next/image";
import Link from "next/link";

import { api } from "~/trpc/server";

import Workspaces from "./components/Workspaces";

export async function generateMetadata() {
  const currentEvent = await api.event.getCurrent();
  return { title: currentEvent?.name ?? "GenAI Collective Demo Night!" };
}

export default async function AttendeePage() {
  const currentEvent = await api.event.getCurrent();
  if (!currentEvent) return <DemoNightHomePage />;
  return (
    <main className="m-auto flex size-full max-w-xl flex-col text-black">
      <Workspaces currentEvent={currentEvent} />
    </main>
  );
}

async function DemoNightHomePage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center pb-16 font-kallisto text-black">
      <Image src="/images/logo.png" alt="logo" width={160} height={160} />
      <h1 className="pt-4 text-center text-2xl font-semibold">
        GenAI Collective Demo Night!
      </h1>
      <Link
        className="mt-4 rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white shadow-xl hover:bg-orange-600"
        href="https://genaicollective.ai"
      >
        Learn more
      </Link>
    </main>
  );
}
