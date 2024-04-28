import { useEffect } from "react";

import { type CurrentEvent } from "~/server/api/routers/event";
import { api } from "~/trpc/react";

const REFRESH_INTERVAL = 10_000;

export default function useEventSync(initialCurrentEvent: CurrentEvent) {
  const { data: currentEvent } = api.event.getCurrent.useQuery<CurrentEvent>(
    undefined,
    {
      initialData: initialCurrentEvent,
      refetchInterval: REFRESH_INTERVAL,
    },
  );

  const { data: event, refetch: refetchEvent } = api.event.get.useQuery(
    currentEvent?.id ?? "",
    {
      enabled: !!currentEvent,
    },
  );

  useEffect(() => {
    if (currentEvent?.phase !== event?.phase) {
      refetchEvent();
    }
  }, [currentEvent, event, refetchEvent]);

  return { currentEvent, event, refetchEvent };
}
