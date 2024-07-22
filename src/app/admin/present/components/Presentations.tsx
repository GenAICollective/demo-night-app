"use client";

import { PresentationContext } from "../contexts/PresentationContext";
import useEventAdminSync from "../hooks/useEventAdminSync";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";

import { animationVariants } from "~/lib/animation";
import { type CurrentEvent, EventPhase } from "~/lib/types/currentEvent";

import LoadingScreen from "~/components/loading/LoadingScreen";

import AwardsPresentation from "./AwardsPresentation";
import DemosPresentation from "./DemosPresentation";
import PrePresentation from "./PrePresentation";
import PresentationHeader from "./PresentationHeader";

enum PresentationPhase {
  Pre,
  Demos,
  Awards,
}

export default function Presentations({
  currentEvent: initialCurrentEvent,
}: {
  currentEvent: CurrentEvent;
}) {
  const {
    currentEvent,
    event,
    refetch: refetchEvent,
  } = useEventAdminSync(initialCurrentEvent);

  const phase = useMemo(() => {
    switch (currentEvent?.phase) {
      case EventPhase.Pre:
        return PresentationPhase.Pre;
      case EventPhase.Demos:
        return PresentationPhase.Demos;
      case EventPhase.Voting:
      case EventPhase.Results:
      case EventPhase.Recap:
        return PresentationPhase.Awards;
    }
  }, [currentEvent?.phase]);

  if (!event) return <LoadingScreen />;

  function presentation() {
    switch (phase) {
      case PresentationPhase.Pre:
        return <PrePresentation />;
      case PresentationPhase.Demos:
        return <DemosPresentation />;
      case PresentationPhase.Awards:
        return <AwardsPresentation />;
    }
  }

  return (
    <PresentationContext.Provider value={{ currentEvent, event, refetchEvent }}>
      <PresentationHeader />
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={phase}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={animationVariants}
          className="size-full min-h-screen flex-1"
        >
          <div className="size-full min-h-screen content-center pt-20">
            {presentation()}
          </div>
        </motion.div>
      </AnimatePresence>
    </PresentationContext.Provider>
  );
}
