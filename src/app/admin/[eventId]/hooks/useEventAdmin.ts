import { type AdminEvent } from "../contexts/DashboardContext";
import { useEffect, useState } from "react";

import { type CurrentEvent } from "~/lib/types/currentEvent";
import { api } from "~/trpc/react";

import { env } from "~/env";

const REFRESH_INTERVAL =
  env.NEXT_PUBLIC_NODE_ENV === "development" ? 1_000 : 5_000;

export function useEventAdmin({
  initialEvent,
  initialCurrentEvent,
}: {
  initialEvent?: AdminEvent;
  initialCurrentEvent?: CurrentEvent | null;
}) {
  const { data: currentEvent, refetch: refetchCurrentEvent } =
    api.event.getCurrent.useQuery(undefined, {
      initialData: initialCurrentEvent,
    });
  const { data: event, refetch: refetchEvent } = api.event.getAdmin.useQuery(
    initialEvent?.id ?? "",
    {
      enabled: !!initialEvent?.id,
      refetchInterval: REFRESH_INTERVAL,
      initialData: initialEvent,
    },
  );

  const refetch = () => {
    refetchCurrentEvent();
    refetchEvent();
  };

  return { currentEvent, event, refetch };
}
