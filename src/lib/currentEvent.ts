import { kv } from "@vercel/kv";

export enum EventPhase {
  Pre = "pre",
  Demos = "demos",
  Voting = "voting",
  Results = "results",
  Recap = "recap",
}

export type CurrentEvent = {
  id: string;
  name: string;
  phase: EventPhase;
  currentDemoId: string | null;
  currentAwardId: string | null;
};

export async function getCurrentEvent(): Promise<CurrentEvent | null> {
  return await kv.get("currentEvent");
}

export async function updateCurrentEvent(
  event: { id: string; name: string } | null,
) {
  console.log("updateCurrentEvent", event);
  if (!event) {
    return kv.set("currentEvent", null);
  }
  let currentEvent = await getCurrentEvent();
  if (currentEvent && currentEvent.id === event.id) {
    return;
  }
  currentEvent = {
    id: event.id,
    name: event.name,
    phase: EventPhase.Pre,
    currentDemoId: null,
    currentAwardId: null,
  };
  return kv.set("currentEvent", currentEvent);
}

export async function updateCurrentEventState({
  phase,
  currentDemoId,
  currentAwardId,
}: {
  phase?: EventPhase;
  currentDemoId?: string | null;
  currentAwardId?: string | null;
}) {
  const currentEvent = await getCurrentEvent();
  if (!currentEvent) {
    throw new Error("No current event");
  }
  if (phase) {
    currentEvent.phase = phase;
  }
  if (currentDemoId) {
    currentEvent.currentDemoId = currentDemoId;
  }
  if (currentAwardId) {
    currentEvent.currentAwardId = currentAwardId;
  }
  return kv.set("currentEvent", currentEvent);
}
