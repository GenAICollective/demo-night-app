import { type FeedbackAndAttendee } from ".";
import { type Feedback } from "@prisma/client";
import { motion } from "framer-motion";
import { useMemo } from "react";

import { QUICK_ACTIONS } from "~/lib/types/quickActions";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

import AttendeeTypeBadge from "~/components/AttendeeTypeBadge";

export function feedbackScore(feedback: Feedback) {
  let score = feedback.comment ? 1000 : 0;
  score += feedback.comment?.length ?? 0;
  score += (feedback.rating ?? 0) * 5;
  score += feedback.claps ?? 0;
  score += feedback.tellMeMore ? 10 : 0;
  score += feedback.quickActions.length * 20;
  return score;
}

export function FeedbackItem({
  feedback,
  refetchFeedback,
}: {
  feedback: FeedbackAndAttendee;
  refetchFeedback: () => void;
}) {
  const deleteMutation = api.feedback.delete.useMutation();

  const summaryString = useMemo(() => {
    const summary: string[] = [];
    if (feedback.rating) {
      summary.push(String.fromCodePoint(48 + feedback.rating, 65039, 8419));
    }
    if (feedback.claps) {
      summary.push(`👏<span class="text-xs"> x${feedback.claps}</span>`);
    }
    if (feedback.tellMeMore) {
      summary.push("📬");
    }
    for (const [id, action] of Object.entries(QUICK_ACTIONS)) {
      if (feedback.quickActions.includes(id)) {
        summary.push(action.icon);
      }
    }
    return summary.join(" • ");
  }, [feedback]);

  return (
    <motion.li
      className="flex flex-row gap-2"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-1 flex-col gap-1 rounded-xl bg-white p-2">
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
          <p
            className="font-semibold text-gray-400"
            dangerouslySetInnerHTML={{
              __html: `${summaryString ? `• ${summaryString}` : ""}`,
            }}
          />
        </div>
        {feedback.comment && (
          <p className="font-medium italic">{`"${feedback.comment}"`}</p>
        )}
      </div>
      <div className="flex flex-row gap-2">
        <button
          onClick={() => {
            deleteMutation
              .mutateAsync(feedback.id)
              .then(() => refetchFeedback());
          }}
          className="focus:outline-none"
        >
          🗑
        </button>
      </div>
    </motion.li>
  );
}
