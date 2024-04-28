import { type Demo } from "@prisma/client";
import { useState } from "react";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function DemoDashboard({
  demos,
  currentDemoId,
  refetchEvent,
}: {
  demos: Demo[];
  currentDemoId: string | null;
  refetchEvent: () => void;
}) {
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(
    undefined,
  );

  return (
    <div className="flex size-full flex-row gap-2">
      <div className="flex w-[300px] flex-col gap-2 rounded-xl bg-gray-100 p-4">
        <h2 className="text-2xl font-bold">Demos</h2>
        <ul className="flex flex-col gap-2 overflow-auto">
          {demos.map((demo) => (
            <DemoItem
              key={demo.id}
              demo={demo}
              isCurrent={demo.id === currentDemoId}
              refetchEvent={refetchEvent}
            />
          ))}
        </ul>
      </div>
      <div className="flex flex-1 flex-col gap-2 rounded-xl bg-gray-100 p-4">
        <h2 className="text-2xl font-bold">Feedback</h2>
      </div>
    </div>
  );
}

function DemoItem({
  demo,
  isCurrent,
  refetchEvent,
}: {
  demo: Demo;
  isCurrent: boolean;
  refetchEvent: () => void;
}) {
  const updateCurrentDemoMutation = api.event.updateCurrentDemo.useMutation();
  const updateIndexMutation = api.demo.updateIndex.useMutation();

  return (
    <li className="flex flex-row items-center gap-2">
      <p className="w-[17px] font-bold">{`${demo.index + 1}.`}</p>
      <div
        className={cn(
          "flex flex-1 cursor-pointer flex-row justify-between rounded-lg p-2 font-medium focus:outline-none",
          { "bg-green-200": isCurrent, "bg-white": !isCurrent },
        )}
        onClick={() => {
          updateCurrentDemoMutation
            .mutateAsync({ id: demo.eventId, demoId: demo.id })
            .then(() => refetchEvent());
        }}
      >
        <span>{demo.name}</span>
        <span>⊕</span>
      </div>
      <div className="flex flex-row gap-2 font-semibold">
        <button
          onClick={() => {
            updateIndexMutation
              .mutateAsync({
                id: demo.id,
                index: demo.index - 1,
              })
              .then(() => refetchEvent());
          }}
        >
          ↑
        </button>
        <button
          onClick={() => {
            updateIndexMutation
              .mutateAsync({
                id: demo.id,
                index: demo.index + 1,
              })
              .then(() => refetchEvent());
          }}
        >
          ↓
        </button>
      </div>
    </li>
  );
}
