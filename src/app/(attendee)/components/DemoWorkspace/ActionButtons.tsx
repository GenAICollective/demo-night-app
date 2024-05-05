import { type Feedback } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";

import { cn } from "~/lib/utils";

export function ActionButtons({
  feedback,
  setFeedback,
}: {
  feedback: Feedback | null;
  setFeedback: (feedback: Feedback) => void;
}) {
  const [isExploding, setIsExploding] = useState(false);
  return (
    <div className="fixed bottom-3 z-10 flex w-full max-w-xl select-none items-center justify-evenly px-4 ">
      <motion.button
        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
        whileTap={{ scale: 1.5, transition: { duration: 0.2 } }}
        className={cn(
          "relative mb-10 aspect-square w-20 rounded-full border-4 from-yellow-500/40 from-50% to-yellow-500/60 text-center text-[40px] shadow-2xl backdrop-blur transition-all bg-radient-ellipse-c hover:bg-yellow-500/20",
          feedback?.star ? "border-yellow-500" : "border-transparent",
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
        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
        whileTap={{ scale: 1.5, transition: { duration: 0.2 } }}
        className={cn(
          "relative aspect-square w-28 rounded-full border-4 from-orange-500/40 from-50% to-orange-500/60 text-center text-lg text-orange-600 shadow-2xl backdrop-blur transition-all bg-radient-ellipse-c hover:bg-orange-500/20",
          feedback?.claps ? "border-orange-500" : "border-transparent",
        )}
        onClick={() => {
          setIsExploding(true);
          if (feedback) {
            const updatedFeedback = {
              ...feedback,
              claps: (feedback.claps || 0) + 1,
            };
            setFeedback(updatedFeedback);
          }
        }}
      >
        {isExploding && (
          <ConfettiExplosion
            force={0.1}
            duration={2200}
            particleCount={30}
            width={400}
          />
        )}
        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform pb-4 text-[50px]">
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
        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
        whileTap={{ scale: 1.5, transition: { duration: 0.2 } }}
        className={cn(
          "relative mb-10 aspect-square w-20 rounded-full border-4 border-transparent from-blue-500/40 from-50% to-blue-500/60 text-center text-[40px] shadow-2xl backdrop-blur transition-all bg-radient-ellipse-c hover:bg-blue-500/20",
          showActionButtons
            ? "from-red-500/40 to-red-500/60 hover:bg-red-500/20"
            : hasActed
              ? "border-blue-500"
              : "",
        )}
        onClick={() => setShowActionButtons(!showActionButtons)}
      >
        {showActionButtons ? "❌" : "🤝"}
      </motion.button>
      <AnimatePresence>
        {showActionButtons && (
          <motion.div
            className="absolute -top-[290px] flex flex-col gap-4"
            initial={{ opacity: 0, y: 100, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.5 }}
          >
            {[
              { label: "📬", key: "wantToAccess" },
              { label: "💰", key: "wantToInvest" },
              { label: "🧑‍💻", key: "wantToWork" },
            ].map((action) => (
              <motion.button
                key={action.key}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                whileTap={{ scale: 1.5, transition: { duration: 0.2 } }}
                className={cn(
                  "relative aspect-square w-20 rounded-full border-4 border-transparent from-blue-500/40 from-50% to-blue-500/60 text-center text-[40px] shadow-2xl backdrop-blur transition-all bg-radient-ellipse-c hover:bg-blue-500/20",
                  feedback?.[action.key as keyof typeof feedback]
                    ? "border-blue-500"
                    : "",
                )}
                onClick={() => {
                  if (feedback) {
                    const updatedFeedback = {
                      ...feedback,
                      [action.key]:
                        !feedback[action.key as keyof typeof feedback],
                    };
                    setFeedback(updatedFeedback);
                  }
                  setShowActionButtons(false);
                }}
              >
                {action.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
