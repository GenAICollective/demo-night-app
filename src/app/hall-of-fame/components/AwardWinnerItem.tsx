import { type Award } from "@prisma/client";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { type PublicDemo } from "~/server/api/routers/event";

export default function AwardWinnerItem({
  award,
  demos,
}: {
  award: Award;
  demos: PublicDemo[];
}) {
  const winner = demos.find((demo) => demo.id === award.winnerId);

  if (!winner)
    return (
      <div className="group z-10 flex min-h-28 items-center justify-center rounded-xl bg-gray-300/50 p-4 shadow-xl backdrop-blur">
        <h2 className="text-4xl">🤫</h2>
      </div>
    );

  return (
    <div className="flex flex-col font-medium">
      <h2 className="font-kallisto text-2xl font-bold">{award.name}</h2>
      <p className="text-md pb-2 pl-[2px] text-lg font-semibold italic leading-6 text-gray-500">
        {award.description}
      </p>
      <Link
        href={winner.url}
        className="group z-10 flex min-h-28 flex-col rounded-xl bg-yellow-300/50 p-4 shadow-xl backdrop-blur"
      >
        <div className="flex items-center gap-2">
          <h2 className="font-kallisto text-2xl font-bold group-hover:underline">
            {winner.name}
          </h2>
          <ArrowUpRight
            size={24}
            strokeWidth={3}
            className="h-5 w-5 flex-none rounded-md bg-yellow-400/50 p-[2px] text-yellow-600 group-hover:bg-yellow-500/50 group-hover:text-yellow-700"
          />
        </div>
        <p className="italic leading-5 text-gray-700">{winner.description}</p>
      </Link>
    </div>
  );
}
