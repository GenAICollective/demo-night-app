import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { api } from "~/trpc/server";

import { LinkButton } from "~/components/Button";
import { GaicoConfetti } from "~/components/Confetti";

export const metadata: Metadata = {
  title: "GenAI Collective Demo Night | Hall of Fame 🏆",
};

export default async function HallOfFamePage() {
  const events = await api.event.all();
  if (!events || events.length === 0) return <NoEventsPage />;
  // TODO: Allow selection for any past event
  const event = events[0];
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center pb-16 font-kallisto text-black">
      <Image src="/images/logo.png" alt="logo" width={160} height={160} />
      <h1 className="pt-4 text-center text-2xl font-semibold">
        GenAI Collective Hall of Fame!
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

function NoEventsPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center pb-16 font-kallisto text-black">
      <Image
        className="z-10"
        src="/images/logo.png"
        id="logo"
        alt="logo"
        width={160}
        height={160}
      />
      <h1 className="pt-4 text-center text-2xl font-semibold">
        GenAI Collective Demo Night!
      </h1>
      <LinkButton href="https://genaicollective.ai">Learn more</LinkButton>
      <div className="z-3 pointer-events-none fixed inset-0">
        <GaicoConfetti />
      </div>
    </main>
  );
}
