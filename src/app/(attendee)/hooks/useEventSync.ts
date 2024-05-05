import { useEffect } from "react";

import { type CurrentEvent } from "~/lib/currentEvent";
import { api } from "~/trpc/react";

import { env } from "~/env";

const REFRESH_INTERVAL =
  env.NEXT_PUBLIC_NODE_ENV === "development" ? 1_000 : 5_000;

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
    refetchEvent();
  }, [currentEvent.phase]); // eslint-disable-line react-hooks/exhaustive-deps

  return { currentEvent, event, refetchEvent };
}
