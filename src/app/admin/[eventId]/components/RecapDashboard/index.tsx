import { useDashboardContext } from "../../contexts/DashboardContext";
import InfoButton from "../InfoButton";
import { AnimatePresence, motion } from "framer-motion";

import { EventPhase } from "~/lib/types/currentEvent";
import { cn } from "~/lib/utils";
import { type EventFeedbackAndAttendee } from "~/server/api/routers/eventFeedback";
import { api } from "~/trpc/react";

import AttendeeTypeBadge from "~/components/AttendeeTypeBadge";

import { env } from "~/env";

const REFRESH_INTERVAL =
  env.NEXT_PUBLIC_NODE_ENV === "development" ? 1_000 : 5_000;

export default function RecapDashboard() {
  const { currentEvent } = useDashboardContext();
  const { data: eventFeedback } = api.eventFeedback.getAdmin.useQuery(
    currentEvent?.id ?? "",
    {
      refetchInterval: REFRESH_INTERVAL,
    },
  );

  const message =
    currentEvent?.phase === EventPhase.Recap
      ? "Job well done! 😄"
      : "Don't forget to click 'Select Phase' above!";

  return (
    <div className="flex size-full flex-1 flex-col items-start justify-start gap-2 rounded-xl bg-gray-100 p-4">
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-row items-center justify-between">
          <h2 className="text-2xl font-bold">{message}</h2>
          <InfoButton
            title="Event Feedback"
            message="Here's all the feedback that attendees left for the event itself!"
          />
        </div>
        <p className="-mt-1 text-sm font-semibold text-gray-400">
          Total feedback: {eventFeedback?.length ?? 0}
        </p>
      </div>
      <ul className="flex max-h-screen w-full flex-col gap-2 overflow-auto">
        <AnimatePresence>
          {eventFeedback
            ?.sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime())
            .map((feedback) => (
              <EventFeedbackItem key={feedback.id} feedback={feedback} />
            ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export function EventFeedbackItem({
  feedback,
}: {
  feedback: EventFeedbackAndAttendee;
}) {
  return (
    <motion.li
      className="flex flex-1 flex-col gap-1 rounded-xl bg-white p-2"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-row items-center gap-1">
        <p
          className={cn(
            "font-semibold",
            feedback.attendee.name?.length ?? 0 > 0
              ? "text-black"
              : "italic text-gray-400",
          )}
        >{`${feedback.attendee.name?.length ?? 0 > 0 ? feedback.attendee.name : "Anonymous"}`}</p>
        <AttendeeTypeBadge type={feedback.attendee.type} />
      </div>
      {feedback.comment && (
        <p className="font-medium italic">{`"${feedback.comment}"`}</p>
      )}
    </motion.li>
  );
}
