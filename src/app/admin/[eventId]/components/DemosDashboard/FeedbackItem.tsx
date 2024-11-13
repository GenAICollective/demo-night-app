import { motion } from "framer-motion";
import { Trash } from "lucide-react";
import { useMemo } from "react";

import * as QuickActions from "~/lib/types/quickActions";
import { cn } from "~/lib/utils";
import { type FeedbackAndAttendee } from "~/server/api/routers/demo";
import { api } from "~/trpc/react";

import AttendeeTypeBadge from "~/components/AttendeeTypeBadge";

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
    QuickActions.visibleActions.forEach(([id, action]) => {
      if (feedback.quickActions.includes(id)) {
        summary.push(action.icon);
      }
    });
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
          <Trash className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
    </motion.li>
  );
}
