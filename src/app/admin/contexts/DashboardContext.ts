import {
  type Attendee,
  type Award,
  type Demo,
  type Event,
} from "@prisma/client";
import { createContext, useContext } from "react";

import { type CurrentEvent } from "~/lib/types/currentEvent";

export type AdminEvent = Event & {
  demos: Demo[];
  attendees: Attendee[];
  awards: Award[];
};

export type IDashboardContext = {
  currentEvent: CurrentEvent | null | undefined;
  event: AdminEvent | null | undefined;
  refetchEvent: () => void;
};

export const DashboardContext = createContext<IDashboardContext>(null!);

export function useDashboardContext() {
  return useContext(DashboardContext);
}
