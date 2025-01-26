import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { api } from "~/trpc/server";

import AwardWinnerItem from "./components/AwardWinnerItem";
import HofHeader from "./components/HofHeader";
import { LinkButton } from "~/components/Button";
import { LogoConfetti } from "~/components/Confetti";
import Logos from "~/components/Logos";

import { env } from "~/env";

export const metadata: Metadata = {
  title: "Demo Night Hall of Fame 🏆",
};

export default async function HallOfFamePage() {
  const events = await api.event.all();
  if (!events || events.length === 0) return <NoEventsPage />;
  // TODO: Allow selection for any past event
  const event = events[0]!;
  return (
    <main className="m-auto flex size-full max-w-xl flex-col text-black">
      <HofHeader />
      <div className="flex size-full flex-col items-center justify-center gap-4 p-4 pt-20">
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <Link
            href={event.url}
            className="group flex w-full flex-col items-center justify-center"
            target="_blank"
          >
            <h1 className="text-center font-kallisto text-4xl font-bold leading-9 group-hover:underline">
              {event.name}
            </h1>
          </Link>
          <p className="text-md max-w-[330px] text-center font-medium leading-5 text-gray-500">
            What a night! Check out the winners and their demos below! 🤩
          </p>
        </div>
        <div className="flex w-full flex-col gap-8 pt-4">
          {event.awards.map((award) => (
            <AwardWinnerItem key={award.id} award={award} demos={event.demos} />
          ))}
        </div>
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
