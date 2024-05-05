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
  awards: Award[];
};

export type IWorkspaceContext = {
  currentEvent: CurrentEvent;
  event: CompleteEvent | null | undefined;
  attendee: Attendee;
  setAttendee: (attendee: Attendee) => void;
};

export const WorkspaceContext = createContext<IWorkspaceContext>(null!);

export function useWorkspaceContext() {
  return useContext(WorkspaceContext);
}
