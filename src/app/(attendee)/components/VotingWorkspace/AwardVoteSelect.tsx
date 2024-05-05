import { type Award, type Demo, type Vote } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, Expand } from "lucide-react";
import { useState } from "react";

import { cn } from "~/lib/utils";

export default function AwardVoteSelect({
  award,
  demos,
  vote,
  onSelect,
}: {
  award: Award;
  demos: Demo[];
  vote?: Vote;
  onSelect: (awardId: string, demoId: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const selectedDemo = demos.find((demo) => demo.id === vote?.demoId);

  const toggleExpand = () => setIsExpanded(!isExpanded);
  return (
    <>
      <div
        onClick={toggleExpand}
        className={cn(
          "flex w-full cursor-pointer flex-row items-center justify-between rounded-xl px-4 py-3 text-center text-lg font-semibold shadow-lg backdrop-blur transition-all duration-300 ease-in-out",
          vote ? "bg-green-400/50" : "bg-red-400/50",
        )}
      >
        <motion.div
          key={vote?.demoId ?? "none"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex flex-row gap-2"
        >
          <p>{selectedDemo?.name ?? "Select a demo..."}</p>
        </motion.div>
        <Expand size={22} strokeWidth={2.25} color={"black"} />
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[15] h-full w-full bg-black/20 backdrop-blur"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: "50%" }}
              animate={{ opacity: 1, scale: 1, y: "0%" }}
              exit={{ opacity: 0, scale: 0.5, y: "50%" }}
              className="m-auto flex max-w-xl flex-col"
            >
              <div className="p-4 pb-0">
                <div className="left-0 z-20 m-auto flex w-full max-w-xl flex-col rounded-xl bg-black/60 px-4 pb-2 pt-3 shadow-xl backdrop-blur">
                  <h1 className="text-2xl font-bold text-white">
                    {award.name}
                  </h1>
                  <p className="pb-2 text-lg font-semibold italic leading-6 text-gray-200">
                    {award.description}
                  </p>
                </div>
              </div>
              <div className="left-0 z-20 flex max-h-[calc(100vh-4rem)] w-full flex-col gap-2 overflow-y-auto p-4 pb-[60vh]">
                {demos.map((demo) => (
                  <motion.div
                    initial={{ opacity: 0, y: -(demo.index + 1) * 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -(demo.index + 1) * 30 }}
                    key={demo.id}
                    onClick={() => {
                      onSelect(award.id, demo.id);
                      setIsExpanded(false);
                    }}
                    className={cn(
                      "flex cursor-pointer flex-row items-center justify-between gap-2 rounded-xl bg-white/80 px-4 py-3 text-lg font-semibold shadow-xl backdrop-blur hover:bg-gray-100/80 focus:outline-none",
                      vote?.demoId === demo.id &&
                        "bg-green-300/80 hover:bg-green-400/80",
                    )}
                  >
                    <div className="flex flex-col leading-6">
                      <p>{demo.name}</p>
                      <p className="text-sm font-medium italic text-gray-700">
                        {demo.description}
                      </p>
                    </div>
                    {vote?.demoId === demo.id && (
                      <CircleCheck size={23} strokeWidth={2.25} />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
