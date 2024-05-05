import { type Attendee } from "@prisma/client";
import { createContext, useContext } from "react";

import { type CurrentEvent } from "~/lib/currentEvent";

export type IWorkspaceContext = {
  currentEvent: CurrentEvent;
  attendee: Attendee;
  setAttendee: (attendee: Attendee) => void;
};

export const WorkspaceContext = createContext<IWorkspaceContext>(null!);

export function useWorkspaceContext() {
  return useContext(WorkspaceContext);
}
