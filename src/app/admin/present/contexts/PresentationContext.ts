import { createContext, useContext } from "react";

import { type CurrentEvent } from "~/lib/types/currentEvent";

import { type AdminEvent } from "~/app/admin/[eventId]/contexts/DashboardContext";

export type IPresentationContext = {
  currentEvent: CurrentEvent;
  event: AdminEvent;
  refetchEvent: () => void;
};

export const PresentationContext = createContext<IPresentationContext>(null!);

export function usePresentationContext() {
  return useContext(PresentationContext);
}
