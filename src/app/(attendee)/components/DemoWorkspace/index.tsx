import { type Attendee, type Demo, type Feedback } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { type CurrentEvent } from "~/server/api/routers/event";

import { DemoSelectionHeader } from "./DemoSelectionHeader";
import { useFeedback } from "./hooks/useFeedback";

export default function DemoWorkspace({
  currentEvent,
  attendee,
  demos,
}: {
  currentEvent: CurrentEvent;
  attendee: Attendee;
  demos: Demo[];
}) {
  const { id: eventId, currentDemoId } = currentEvent;
  const [selectedDemo, setSelectedDemo] = useState<Demo>(demos[0]!);
  const { feedback, setFeedback, refetch } = useFeedback(
    eventId,
    attendee,
    selectedDemo,
  );

  useEffect(() => {
    if (currentDemoId) {
      const demo = demos.find((demo) => demo.id === currentDemoId);
      if (demo) {
        setSelectedDemo(demo);
      }
    }
  }, [currentDemoId, demos]);

  return (
    <>
      <DemoSelectionHeader
        demos={demos}
        selectedDemo={selectedDemo}
        setSelectedDemo={setSelectedDemo}
        currentDemoId={currentDemoId}
      />
      <div className="flex h-full flex-col items-center justify-center p-4 pt-16">
        <label
          htmlFor="rating-slider"
          className="mb-2 block text-sm font-medium text-gray-900"
        >
          Rate the Demo (1-10):
        </label>
        <input
          id="rating-slider"
          type="range"
          min="1"
          max="10"
          value={feedback?.rating ?? undefined}
          onChange={(e) => {
            const updatedRating = parseInt(e.target.value, 10);
            setFeedback({ ...feedback, rating: updatedRating });
          }}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
        />
        <label
          htmlFor="comment-input"
          className="mb-2 mt-4 block text-sm font-medium text-gray-900"
        >
          Comment:
        </label>
        <div className="mt-1 text-center">{feedback?.rating ?? 1}</div>
        <textarea
          id="comment-input"
          value={feedback?.comment ?? ""}
          onChange={(e) => {
            setFeedback({ ...feedback, comment: e.target.value });
          }}
          className="block w-full rounded-lg border border-gray-200 p-2"
          placeholder="Enter your feedback..."
        />
        <div className="absolute bottom-4 flex items-center gap-4">
          <button
            className="h-16 w-16 rounded-full bg-red-100 text-center text-3xl shadow-xl transition-all hover:scale-110 hover:bg-blue-200"
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
          </button>
          <button
            className="h-16 w-16 rounded-full bg-yellow-100 text-center text-3xl shadow-xl transition-all hover:scale-110 hover:bg-yellow-200"
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
            <span>👏</span>
            <p className="text-lg font-semibold text-yellow-900">
              {feedback?.claps ?? 0}
            </p>
          </button>
          <ActionButton feedback={feedback} setFeedback={setFeedback} />
        </div>
      </div>
    </>
  );
}

function ActionButton({
  feedback,
  setFeedback,
}: {
  feedback: Feedback | null;
  setFeedback: (feedback: Feedback) => void;
}) {
  const [showActionButtons, setShowActionButtons] = useState(false);

  return (
    <>
      <button
        className="h-16 w-16 rounded-full bg-green-100 text-center text-3xl shadow-xl transition-all hover:scale-110 hover:bg-green-200"
        onClick={() => setShowActionButtons(!showActionButtons)}
      >
        <span>🤝</span>
      </button>
      <AnimatePresence>
        {showActionButtons && (
          <motion.div
            key="action-buttons"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.2 }}
            className="absolute mt-4 flex gap-4"
          >
            <button
              className="h-16 w-16 rounded-full bg-blue-100 text-center text-3xl shadow-xl transition-all hover:scale-110 hover:bg-blue-200"
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
            </button>
            <button
              className="h-16 w-16 rounded-full bg-blue-100 text-center text-3xl shadow-xl transition-all hover:scale-110 hover:bg-blue-200"
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
            </button>
            <button
              className="h-16 w-16 rounded-full bg-blue-100 text-center text-3xl shadow-xl transition-all hover:scale-110 hover:bg-blue-200"
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
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
