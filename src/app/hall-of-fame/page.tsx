import { type Metadata } from "next";

import { api } from "~/trpc/server";

import EventDisplay from "./components/EventDisplay";
import HofHeader from "./components/HofHeader";
import { LinkButton } from "~/components/Button";
import { LogoConfetti } from "~/components/Confetti";
import Logos from "~/components/Logos";

import { env } from "~/env";

export const metadata: Metadata = {
  title: "Demo Night Hall of Fame 🏆",
  description:
    "Browse past Demo Night events and winning demos from our community.",
  robots: {
    index: true,
    follow: true,
  },
};

export default async function HallOfFamePage() {
  const events = await api.event.all();
  if (!events || events.length === 0) return <NoEventsPage />;

  return (
    <main className="m-auto flex size-full max-w-xl flex-col text-black">
      <HofHeader />
      <div className="flex size-full flex-col items-center justify-center gap-4 p-4 pt-20">
        <EventDisplay events={events} />
        <div className="pointer-events-none fixed inset-0">
          <LogoConfetti />
        </div>
      </div>
    </main>
  );
}

function NoEventsPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center pb-16 font-kallisto text-black">
      <Logos size={120} />
      <h1 className="pt-4 text-center text-2xl font-semibold">
        Demo Night App
      </h1>
      <LinkButton href={env.NEXT_PUBLIC_BASE_URL}>Learn more</LinkButton>
      <div className="z-3 pointer-events-none fixed inset-0">
        <LogoConfetti />
      </div>
    </main>
  );
}
