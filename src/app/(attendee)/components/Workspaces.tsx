"use client";

import { EventPhase } from "@prisma/client";

import { api } from "~/trpc/react";

import LoadingDots from "~/components/loading/loading-dots";

import DemoWorkspace from "./DemoWorkspace";

export default function Workspaces() {
  const { data: currentEvent } = api.event.getCurrent.useQuery(undefined, {
    refetchInterval: 5_000,
  });
  const { data: event } = api.event.get.useQuery(currentEvent?.id ?? "", {
    enabled: !!currentEvent,
  });

  if (!currentEvent || !event) {
    return (
      <div className="flex min-h-screen w-full animate-pulse flex-col items-center justify-center gap-2 pb-16 font-kallisto text-black">
        <h1 className="pt-4 text-center text-2xl font-semibold">
          Loading Demos!
        </h1>
        <p className="text-lg font-medium italic">(hold tight!)</p>
        <LoadingDots />
      </div>
    );
  }

  function workspace() {
    switch (currentEvent?.phase) {
      case EventPhase.PRE:
        return <p>{`${currentEvent.phase} - ${currentEvent.currentDemoId}`}</p>;
      case EventPhase.DEMO:
        return (
          <DemoWorkspace
            demos={event!.demos}
            currentDemoId={currentEvent.currentDemoId}
          />
        );
      case EventPhase.VOTING:
        return <p>{`${currentEvent.phase} - ${currentEvent.currentDemoId}`}</p>;
      case EventPhase.RESULTS:
        return <p>{`${currentEvent.phase} - ${currentEvent.currentDemoId}`}</p>;
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col text-black">
      {workspace()}
    </div>
  );
}
