import {
  type Attendee,
  type Award,
  type Demo,
  type Event,
} from "@prisma/client";
import { createContext, useContext } from "react";

import { type CurrentEvent } from "~/lib/currentEvent";

export type CompleteEvent = Event & {
  demos: Demo[];
  attendees: Attendee[];
  awards: Award[];
};

export type IDashboardContext = {
  currentEvent: CurrentEvent | null | undefined;
  event: CompleteEvent | null | undefined;
  refetchEvent: () => void;
};

export const DashboardContext = createContext<IDashboardContext>(null!);

export function useDashboardContext() {
  return useContext(DashboardContext);
}
