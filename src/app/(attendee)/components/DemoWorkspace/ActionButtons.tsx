import { type Feedback } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import { cn } from "~/lib/utils";

export function ActionButtons({
  feedback,
  setFeedback,
}: {
  feedback: Feedback | null;
  setFeedback: (feedback: Feedback) => void;
}) {
  return (
    <div className="fixed bottom-4 flex w-full max-w-xl items-center justify-evenly">
      <motion.button
        whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
        whileTap={{ scale: 1.5, transition: { duration: 1 } }}
        className={cn(
          "aspect-square w-20 rounded-full text-center text-[40px] shadow-xl transition-all hover:scale-110",
          feedback?.star
            ? "border-4 border-yellow-500 bg-yellow-300 hover:bg-yellow-400"
            : "bg-yellow-100 hover:bg-yellow-200",
        )}
        onClick={() => {
          if (feedback) {
            const updatedFeedback = {
              ...feedback,
              star: !(feedback.star || false),
            };
            setFeedback(updatedFeedback);
          }
        }}
      >
        ⭐
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
        whileTap={{ scale: 1.5, transition: { duration: 1 } }}
        className={cn(
          "relative aspect-square w-28 rounded-full text-center text-lg shadow-xl transition-all",
          feedback?.claps
            ? "bg-radient-ellipse-c border-4 border-orange-500 from-orange-200 from-0% to-orange-300 to-70% text-orange-700 hover:bg-orange-400"
            : "bg-radient-ellipse-c from-orange-100 to-orange-400 text-gray-500 hover:bg-orange-200",
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
        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform pb-2 text-[50px]">
          👏
        </p>
        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 translate-y-full transform font-bold">
          {feedback?.claps ?? 0}
        </p>
      </motion.button>
      <WantToButton feedback={feedback} setFeedback={setFeedback} />
    </div>
  );
}
function WantToButton({
  feedback,
  setFeedback,
}: {
  feedback: Feedback | null;
  setFeedback: (feedback: Feedback) => void;
}) {
  const [showActionButtons, setShowActionButtons] = useState(false);

  const hasActed = useMemo(() => {
    return (
      (feedback?.wantToAccess ?? false) ||
      (feedback?.wantToInvest ?? false) ||
      (feedback?.wantToWork ?? false)
    );
  }, [feedback]);

  return (
    <div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 1.5 }}
        className={cn(
          "aspect-square w-20 rounded-full text-center text-[40px] shadow-xl transition-all hover:scale-110",
          showActionButtons
            ? "bg-red-100 hover:bg-red-200"
            : hasActed
              ? "border-4 border-blue-500 bg-blue-300 hover:bg-blue-400"
              : "bg-blue-100 hover:bg-blue-200",
        )}
        onClick={() => setShowActionButtons(!showActionButtons)}
      >
        {showActionButtons ? "❌" : "🤝"}
      </motion.button>
      <AnimatePresence>
        {showActionButtons && (
          <motion.div
            key="action-buttons"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-[270px] flex flex-col gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 1.5 }}
              className={cn(
                "aspect-square w-20 rounded-full text-center text-[40px] shadow-xl transition-all hover:scale-110",
                feedback?.wantToAccess
                  ? "border-4 border-blue-500 bg-blue-300 hover:bg-blue-400"
                  : "bg-blue-100 hover:bg-blue-200",
              )}
              onClick={() => {
                if (feedback) {
                  const updatedFeedback = {
                    ...feedback,
                    wantToAccess: !(feedback.wantToAccess || false),
                  };
                  setFeedback(updatedFeedback);
                }
                setShowActionButtons(false);
              }}
            >
              📬
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 1.5 }}
              className={cn(
                "aspect-square w-20 rounded-full text-center text-[40px] shadow-xl transition-all hover:scale-110",
                feedback?.wantToInvest
                  ? "border-4 border-blue-500 bg-blue-300 hover:bg-blue-400"
                  : "bg-blue-100 hover:bg-blue-200",
              )}
              onClick={() => {
                if (feedback) {
                  const updatedFeedback = {
                    ...feedback,
                    wantToInvest: !(feedback.wantToInvest || false),
                  };
                  setFeedback(updatedFeedback);
                }
                setShowActionButtons(false);
              }}
            >
              💰
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 1.5 }}
              className={cn(
                "aspect-square w-20 rounded-full text-center text-[40px] shadow-xl transition-all hover:scale-110",
                feedback?.wantToWork
                  ? "border-4 border-blue-500 bg-blue-300 hover:bg-blue-400"
                  : "bg-blue-100 hover:bg-blue-200",
              )}
              onClick={() => {
                if (feedback) {
                  const updatedFeedback = {
                    ...feedback,
                    wantToWork: !(feedback.wantToWork || false),
                  };
                  setFeedback(updatedFeedback);
                }
                setShowActionButtons(false);
              }}
            >
              🧑‍💻
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
