import { type Award, type Demo } from "@prisma/client";
import { ChevronRight } from "lucide-react";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function ResultsDashboard({
  currentAwardId,
  awards,
  demos,
  refetchEvent,
}: {
  currentAwardId: string | null | undefined;
  awards: Award[];
  demos: Demo[];
  refetchEvent: () => void;
}) {
  const updateCurrentStateMutation = api.event.updateCurrentState.useMutation();

  const currentAwardIndex = awards.findIndex(
    (award) => award.id === currentAwardId,
  );

  return (
    <div className="flex size-full flex-1 flex-col gap-2 rounded-xl bg-gray-100 p-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Award Results</h2>
        <button
          className="rounded-xl bg-red-200 px-4 font-semibold"
          onClick={() => {
            updateCurrentStateMutation
              .mutateAsync({ currentAwardId: null })
              .then(refetchEvent);
          }}
        >
          Reset
        </button>
      </div>
      <ul className="flex flex-col gap-2 overflow-auto">
        {awards.map((award, index) => {
          const demo = demos.find((demo) => demo.id === award.winnerId)!;
          return (
            <li
              key={award.id}
              title="Reveal"
              className="flex flex-1 cursor-pointer items-center justify-between rounded-xl text-start font-medium focus:outline-none"
              onClick={() => {
                updateCurrentStateMutation
                  .mutateAsync({ currentAwardId: award.id })
                  .then(refetchEvent);
              }}
            >
              <div
                className={cn(
                  "flex h-full basis-1/2 flex-col justify-start rounded-xl bg-white p-2",
                  index <= (currentAwardIndex ?? -1) && "bg-green-200",
                )}
              >
                <p className="line-clamp-1 text-lg font-bold">{award.name}</p>
                <p className="italic leading-5 text-gray-700">
                  {award.description}
                </p>
              </div>
              <ChevronRight
                size={28}
                strokeWidth={3}
                className="text-gray-700"
              />
              <div
                className={cn(
                  "flex h-full basis-1/2 flex-col justify-start rounded-xl bg-white p-2",
                  index <= (currentAwardIndex ?? -1) && "bg-green-200",
                )}
              >
                <p className="line-clamp-1 text-lg font-bold">{demo.name}</p>
                <p className="italic leading-5 text-gray-700">
                  {demo.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
