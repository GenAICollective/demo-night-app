"use client";

import { WorkspaceContext } from "../contexts/WorkspaceContext";
import { useAttendee } from "../hooks/useAttendee";
import useEventSync from "../hooks/useEventSync";
import { AnimatePresence, motion } from "framer-motion";

import { type CurrentEvent, EventPhase } from "~/lib/currentEvent";

import LoadingScreen from "~/components/loading/LoadingScreen";

import DemosWorkspace from "./DemosWorkspace";
import EventHeader from "./EventHeader";
import PreWorkspace from "./PreWorkspace";
import RecapWorkspace from "./RecapWorkspace";
import ResultsWorkspace from "./ResultsWorkspace";
import VotingWorkspace from "./VotingWorkspace";

export default function Workspaces({
  currentEvent: initialCurrentEvent,
}: {
  currentEvent: CurrentEvent;
}) {
  const { currentEvent, event } = useEventSync(initialCurrentEvent);
  const { attendee, setAttendee } = useAttendee(initialCurrentEvent.id);

  function workspace() {
    switch (currentEvent?.phase) {
      case EventPhase.Pre:
        return <PreWorkspace />;
      case EventPhase.Demos:
        if (!event || !event.demos.length) return <LoadingScreen />;
        return <DemosWorkspace />;
      case EventPhase.Voting:
        if (!event) return <LoadingScreen />;
        return <VotingWorkspace />;
      case EventPhase.Results:
        if (!event) return <LoadingScreen />;
        return <ResultsWorkspace />;
      case EventPhase.Recap:
        if (!event || !event.awards.length || !event.demos.length)
          return <LoadingScreen />;
        return <RecapWorkspace />;
    }
  }

  return (
    <WorkspaceContext.Provider
      value={{ currentEvent, event, attendee, setAttendee }}
    >
      <EventHeader />
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={currentEvent?.phase}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={animationVariants}
          className="size-full min-h-[calc(100dvh)] flex-1"
        >
          <div className="size-full min-h-[calc(100dvh)] pt-20">
            {workspace()}
          </div>
        </motion.div>
      </AnimatePresence>
    </WorkspaceContext.Provider>
  );
}

const animationVariants = {
  initial: { opacity: 0, x: 400, scale: 0.75 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
  exit: {
    opacity: 0,
    x: -400,
    scale: 0.75,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};
