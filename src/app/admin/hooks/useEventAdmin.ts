import { useEffect, useState } from "react";

import { api } from "~/trpc/react";

import { env } from "~/env";

const REFRESH_INTERVAL =
  env.NEXT_PUBLIC_NODE_ENV === "development" ? 1_000 : 5_000;

export function useEventAdmin() {
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(
    undefined,
  );
  const { data: event, refetch: refetchEvent } = api.event.getAdmin.useQuery(
    selectedEventId ?? "",
    {
      enabled: !!selectedEventId,
      refetchInterval: REFRESH_INTERVAL,
    },
  );

  useEffect(() => {
    if (selectedEventId) {
      refetchEvent();
    }
  }, [selectedEventId, refetchEvent]);

  return { event, refetchEvent, selectedEventId, setSelectedEventId };
}
