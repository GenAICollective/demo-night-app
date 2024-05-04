import { useWorkspaceContext } from "../../contexts/WorkspaceContext";
import { type Demo } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, BadgeInfo } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useModal } from "~/components/modal/provider";

import { ActionButtons } from "./ActionButtons";
import { ClapsConfetti, StarConfetti } from "./Confetti";
import { DemoSelectionHeader } from "./DemoSelectionHeader";
import InfoModal from "./InfoModal";
import RatingSlider from "./RatingSlider";
import { useFeedback } from "./hooks/useFeedback";

export default function DemoWorkspace({ demos }: { demos: Demo[] }) {
  const { currentEvent, attendee } = useWorkspaceContext();
  const { id: eventId, currentDemoId } = currentEvent;
  const [selectedDemo, setSelectedDemo] = useState<Demo>(demos[0]!);
  const { feedback, setFeedback } = useFeedback(
    eventId,
    attendee,
    selectedDemo,
  );
  const modal = useModal();
  const [lastCommentChange, setLastCommentChange] = useState<number | null>(
    null,
  );
  const lastDemoIndex = useRef<number>(0);

  useEffect(() => {
    if (
      currentDemoId &&
      (!lastCommentChange || Date.now() - lastCommentChange >= 3000)
    ) {
      const demo = demos.find((demo) => demo.id === currentDemoId);
      if (demo) {
        setSelectedDemo(demo);
        setLastCommentChange(null);
      }
    }
  }, [currentDemoId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedDemo) {
      lastDemoIndex.current = selectedDemo.index;
    }
  }, [selectedDemo]);

  return (
    <>
      <DemoSelectionHeader
        demos={demos}
        selectedDemo={selectedDemo}
        setSelectedDemo={setSelectedDemo}
        currentDemoId={currentDemoId}
      />
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={selectedDemo.id}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={animationVariants(
            selectedDemo.index,
            lastDemoIndex.current,
          )}
          className="flex h-full flex-col items-center justify-center gap-8 p-4 pb-[200px] pt-20"
        >
          <div className="-mb-3 flex flex-col items-center">
            <Link
              href={selectedDemo.url}
              target="_blank"
              className="group flex items-center gap-3 transition-all"
            >
              <h1 className="line-clamp-1 font-kallisto text-4xl font-bold tracking-tight group-hover:underline">
                {selectedDemo.name}
              </h1>
              <ArrowUpRight
                size={28}
                strokeWidth={3}
                className="-mt-[5px] aspect-square w-7 flex-none rounded-lg bg-gray-200 p-[2px] text-gray-500 group-hover:bg-gray-300 group-hover:text-gray-700"
              />
            </Link>
            <p className="min-h-[40px] px-2 text-center text-lg font-semibold leading-6 text-gray-500">
              {selectedDemo.description}
            </p>
          </div>
          <div className="w-full px-4 pt-4">
            <RatingSlider feedback={feedback} setFeedback={setFeedback} />
          </div>
          <textarea
            value={feedback?.comment ?? ""}
            onChange={(e) => {
              setFeedback({ ...feedback, comment: e.target.value });
              setLastCommentChange(Date.now());
            }}
            rows={3}
            className="z-10 mt-4 block w-full resize-none rounded-xl border-2 border-gray-200 bg-white/60 p-2 text-lg font-medium backdrop-blur"
            placeholder="Enter your feedback..."
          />
        </motion.div>
        <ActionButtons feedback={feedback} setFeedback={setFeedback} />
      </AnimatePresence>
      <button
        className="fixed bottom-2 left-2 z-10 h-9 w-9 cursor-pointer rounded-full bg-gray-200 p-[6px] text-gray-500 shadow-xl hover:bg-gray-300 hover:text-gray-700"
        onClick={() => modal?.show(<InfoModal />)}
      >
        <BadgeInfo />
      </button>
      <StarConfetti feedback={feedback} />
      <ClapsConfetti feedback={feedback} />
    </>
  );
}

function animationVariants(selectedDemoIndex: number, lastDemoIndex: number) {
  const direction = selectedDemoIndex > lastDemoIndex ? 1 : -1;
  return {
    initial: { opacity: 0, y: 400 * direction, scale: 0.75 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
    exit: {
      opacity: 0,
      scale: 0.75,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
  };
}
