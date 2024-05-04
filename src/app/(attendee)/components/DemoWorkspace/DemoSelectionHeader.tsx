import { type Demo } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, CircleCheck } from "lucide-react";
import { useState } from "react";

import { cn } from "~/lib/utils";

export function DemoSelectionHeader({
  demos,
  selectedDemo,
  setSelectedDemo,
  currentDemoId,
}: {
  demos: Demo[];
  selectedDemo: Demo | undefined;
  setSelectedDemo: (demo: Demo) => void;
  currentDemoId: string | null;
}) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);
  return (
    <>
      <div className="fixed z-20 w-full max-w-xl select-none p-2">
        <div
          onClick={toggleExpand}
          className={cn(
            "flex w-full cursor-pointer flex-row items-center justify-between rounded-xl px-4 py-3 text-center text-lg font-semibold shadow-lg backdrop-blur transition-all duration-300 ease-in-out",
            selectedDemo?.id === currentDemoId
              ? "bg-green-400/50"
              : "bg-red-400/50",
            isExpanded ? " bg-black/20 backdrop-blur hover:bg-black/30" : "",
          )}
        >
          <motion.div
            key={selectedDemo ? selectedDemo.id : "none"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-row gap-2"
          >
            {(isExpanded && (
              <p className="italic text-white">Select a demo:</p>
            )) || (
              <>
                <p className="w-7">{(selectedDemo?.index ?? 0) + 1}.</p>
                <p>{selectedDemo?.name ?? ""}</p>
              </>
            )}
          </motion.div>
          <ChevronDown
            size={28}
            strokeWidth={2.25}
            color={isExpanded ? "white" : "black"}
            className={cn(
              "transform transition-transform duration-300 ease-in-out",
              isExpanded ? "rotate-180" : "",
            )}
          />
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="absolute left-0 flex max-h-[calc(100vh-4rem)] w-full flex-col gap-2 overflow-y-auto px-2 pb-[60vh] pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {demos.map((demo) => (
                <motion.div
                  initial={{ opacity: 0, y: -(demo.index + 1) * 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -(demo.index + 1) * 30 }}
                  key={demo.id}
                  onClick={() => {
                    setSelectedDemo(demo);
                    setIsExpanded(false);
                  }}
                  className={cn(
                    "flex cursor-pointer flex-row items-center justify-between gap-2 rounded-xl px-4 py-3 text-lg font-semibold shadow-xl focus:outline-none",
                    demo.id === currentDemoId
                      ? "bg-green-300 hover:bg-green-400"
                      : "bg-white hover:bg-red-100",
                  )}
                >
                  <div className="flex flex-row gap-2">
                    <p className="w-7">{demo.index + 1}.</p>
                    <p>{`${demo.name} ${demo.id === currentDemoId ? "(current)" : ""}`}</p>
                  </div>
                  {selectedDemo?.id === demo.id && (
                    <CircleCheck size={23} strokeWidth={2.25} />
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-0 top-0 z-10 h-full w-full bg-black/20 backdrop-blur"
          />
        )}
      </AnimatePresence>
    </>
  );
}
