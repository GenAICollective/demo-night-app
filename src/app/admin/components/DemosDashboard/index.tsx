import { useDashboardContext } from "../../contexts/DashboardContext";
import InfoButton from "../InfoButton";
import { type Demo } from "@prisma/client";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

import { feedbackScore } from "~/lib/feedback";
import { api } from "~/trpc/react";

import { DemoItem } from "./DemoItem";
import { FeedbackItem } from "./FeedbackItem";
import FeedbackOverview from "./FeedbackOverview";
import { env } from "~/env";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useMockFeedback } from "~/test/hooks/useMockFeedback";

const REFRESH_INTERVAL =
  env.NEXT_PUBLIC_NODE_ENV === "development" ? 1_000 : 5_000;

export default function DemosDashboard() {
  const { currentEvent, event, refetchEvent } = useDashboardContext();
  const eventId = currentEvent?.id ?? event?.id ?? "";
  const [selectedDemo, setSelectedDemo] = useState<Demo | undefined>(
    event?.demos.find((demo) => demo.id === eventId),
  );
  const { data: feedback, refetch: refetchFeedback } =
    api.demo.getFeedback.useQuery(selectedDemo?.id ?? "", {
      enabled: !!selectedDemo,
      refetchInterval: REFRESH_INTERVAL,
    });
  // const { feedback, refetch: refetchFeedback } = useMockFeedback();
  if (!event) {
    return null;
  }

  return (
    <div className="flex size-full flex-row gap-2">
      <div className="flex w-[300px] flex-col gap-2 rounded-xl bg-gray-100 p-4">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-2xl font-bold">Demos</h2>
          <InfoButton
            title="Demo Management"
            message="Click on a demo when the presenter is about to begin to allow attendees to give feedback on it!"
          />
        </div>
        <ul className="flex flex-col gap-2 overflow-auto">
          <AnimatePresence>
            {event.demos.map((demo) => (
              <DemoItem
                key={demo.id}
                demo={demo}
                selectedDemo={selectedDemo}
                setSelectedDemo={setSelectedDemo}
                isCurrent={demo.id === currentEvent?.currentDemoId}
                refetchEvent={refetchEvent}
              />
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <div className="flex flex-1 flex-col gap-2 rounded-xl bg-gray-100 p-4">
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center justify-between">
            <h2 className="line-clamp-1 text-2xl font-bold">
              {selectedDemo?.name
                ? `Feedback for ${selectedDemo.name}`
                : "Feedback"}
            </h2>
            <InfoButton
              title="Feedback"
              message="Here is all feedback that attendees have given on this demo ranked by relevance!"
            />
          </div>
          <FeedbackOverview feedback={feedback ?? []} />
        </div>
        <ul className="flex max-h-screen flex-col gap-2 overflow-auto">
          <AnimatePresence>
            {feedback
              ?.sort((a, b) => feedbackScore(b) - feedbackScore(a))
              .map((feedback) => (
                <FeedbackItem
                  key={feedback.id}
                  feedback={feedback}
                  refetchFeedback={refetchFeedback}
                />
              ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}
