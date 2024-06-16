"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import ConfettiExplosion from "react-dom-confetti";

import { QUICK_ACTIONS } from "~/lib/types/quickActions";
import { cn } from "~/lib/utils";

import { type LocalFeedback } from "./hooks/useFeedback";

export function ActionButtons({
  feedback,
  setFeedback,
}: {
  feedback: LocalFeedback | null;
  setFeedback: (feedback: LocalFeedback) => void;
}) {
  const [isExploding, setIsExploding] = useState(false);

  useEffect(() => {
    setIsExploding(false);
  }, [feedback?.demoId]);

  return (
    <div className="fixed bottom-3 z-10 flex w-full max-w-xl select-none items-center justify-evenly px-4 ">
      <div className="relative mb-5 flex flex-col items-center justify-center gap-1">
        <motion.button
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          whileTap={{ scale: 1.5, transition: { duration: 0.2 } }}
          className={cn(
            "aspect-square w-20 rounded-full border-4 from-blue-400/40 from-50% to-blue-500/60 text-center text-[40px] shadow-[0_10px_40px_rgb(59,130,246,0.5)] backdrop-blur transition-all bg-radient-ellipse-c hover:bg-blue-500/20",
            feedback?.tellMeMore ? "border-blue-500" : "border-transparent",
          )}
          onClick={() => {
            if (feedback) {
              const updatedFeedback = {
                ...feedback,
                tellMeMore: !(feedback.tellMeMore || false),
              };
              setFeedback(updatedFeedback);
              setIsExploding(updatedFeedback.tellMeMore);
            }
          }}
        >
          <div className="pl-10">
            <ConfettiExplosion
              active={isExploding}
              config={{
                colors: ["#809fff", "#99b3ff", "#b3c6ff"],
                elementCount: 200,
                duration: 5000,
              }}
            />
          </div>
          <span>📬</span>
        </motion.button>
        <p className="pointer-events-none absolute w-28 pt-[104px] text-center text-sm font-semibold text-gray-400">
          Email me!
        </p>
      </div>
      <div className="relative flex flex-col items-center justify-center gap-1">
        <motion.button
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          whileTap={{ scale: 1.5, transition: { duration: 0.2 } }}
          className={cn(
            "relative aspect-square w-28 rounded-full border-4 from-orange-400/40 from-50% to-orange-600/60 text-center text-lg text-orange-600 shadow-[0_15px_60px_rgb(234,88,12,0.5)] backdrop-blur transition-all bg-radient-ellipse-c hover:bg-orange-500/20",
            feedback?.claps ? "border-orange-500" : "border-transparent",
          )}
          onClick={() => {
            if (feedback) {
              const updatedFeedback = {
                ...feedback,
                claps: (feedback.claps || 0) + 1,
              };
              setFeedback(updatedFeedback);
            }
          }}
        >
          <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform pb-4 text-[50px]">
            👏
          </p>
          <p className="absolute bottom-8 left-1/2 -translate-x-1/2 translate-y-full transform font-bold">
            {feedback?.claps ?? 0}
          </p>
        </motion.button>
      </div>
      <QuickActionsButton feedback={feedback} setFeedback={setFeedback} />
    </div>
  );
}

function QuickActionsButton({
  feedback,
  setFeedback,
}: {
  feedback: LocalFeedback | null;
  setFeedback: (feedback: LocalFeedback) => void;
}) {
  const [showButtons, setShowButtons] = useState(false);

  return (
    <div>
      <div className="relative mb-5 flex flex-col items-center justify-center gap-1">
        <motion.button
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          whileTap={{ scale: 1.5, transition: { duration: 0.2 } }}
          className={cn(
            "aspect-square w-20 rounded-full border-4 border-transparent from-yellow-300/40 from-50% to-yellow-500/60 text-center text-[40px] shadow-[0_10px_40px_rgb(234,179,8,0.5)] backdrop-blur transition-all bg-radient-ellipse-c hover:bg-yellow-500/20",
            showButtons
              ? "from-red-400/40 to-red-500/60 shadow-[0_10px_40px_rgb(239,68,68,0.5)] hover:bg-red-500/20"
              : feedback?.quickActions.length
                ? "border-yellow-500"
                : "",
          )}
          onClick={() => setShowButtons(!showButtons)}
        >
          {showButtons ? "❌" : "🤝"}
        </motion.button>
        <p className="pointer-events-none absolute w-32 pt-[104px] text-center text-sm font-semibold text-gray-400">
          I want to help by...
        </p>
      </div>
      <AnimatePresence>
        {showButtons && (
          <motion.div
            className="absolute -top-[290px] flex flex-col gap-4"
            initial={{ opacity: 0, y: 100, x: -50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, x: -50, scale: 0.5 }}
          >
            {Object.entries(QUICK_ACTIONS).map(([id, action]) => (
              <div key={id} className="relative w-[300px]">
                <p className="pointer-events-none absolute -left-3 top-1/2 line-clamp-1 -translate-x-full -translate-y-1/2 rounded-full bg-white/60 p-2 text-sm font-semibold text-gray-400 backdrop-blur-sm">
                  {action.description}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 1.5, transition: { duration: 0.2 } }}
                  className={cn(
                    "relative aspect-square w-20 rounded-full border-4 border-transparent from-yellow-300/40 from-50% to-yellow-500/60 text-center text-[40px] shadow-[0_10px_40px_rgb(234,179,8,0.5)] backdrop-blur transition-all bg-radient-ellipse-c hover:bg-yellow-500/20",
                    feedback?.quickActions.includes(id)
                      ? "border-yellow-500"
                      : "",
                  )}
                  onClick={() => {
                    if (feedback) {
                      const updatedFeedback = {
                        ...feedback,
                        quickActions: feedback.quickActions.includes(id)
                          ? feedback.quickActions.filter((key) => key !== id)
                          : [...feedback.quickActions, id],
                      };
                      setFeedback(updatedFeedback);
                    }
                    setShowButtons(false);
                  }}
                >
                  {action.icon}
                </motion.button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
