"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { QUICK_ACTIONS } from "~/lib/types/quickActions";
import { cn } from "~/lib/utils";
import { type DemoFeedback } from "~/server/api/routers/demo";

import AttendeeTypeBadge from "~/components/AttendeeTypeBadge";
import { RATING_EMOJIS } from "~/components/RatingSlider";

export function FeedbackItem({ feedback }: { feedback: DemoFeedback }) {
  const summary = [
    feedback.rating ? RATING_EMOJIS[feedback.rating] : null,
    feedback.claps
      ? `👏<span class="text-xs"> x${feedback.claps}</span>`
      : null,
    feedback.tellMeMore ? "📬" : null,
    ...(feedback.quickActions?.map((id) => QUICK_ACTIONS[id]?.icon) ?? []),
  ].filter((s) => s) as string[];
  const summaryString = summary.join(" • ");
  return (
    <div key={feedback.id} className="z-10 w-full font-medium leading-6">
      <div className="flex w-full flex-col gap-1 rounded-xl bg-gray-300/50 p-4 shadow-xl backdrop-blur">
        <div className="flex items-center gap-2">
          <Link
            className={cn(
              "group flex items-center gap-2",
              !feedback.attendee?.linkedin && "pointer-events-none",
            )}
            href={feedback.attendee?.linkedin ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3
              className={cn(
                "line-clamp-1 text-xl font-bold group-hover:underline",
                !feedback.attendee?.name && "italic text-gray-500",
              )}
            >
              {feedback.attendee?.name ?? "Anonymous"}
            </h3>
            {feedback.attendee?.linkedin && (
              <ArrowUpRight
                size={24}
                strokeWidth={3}
                className="h-5 w-5 flex-none rounded-md bg-gray-300/50 p-[2px] text-gray-500 group-hover:bg-gray-400/50 group-hover:text-gray-700"
              />
            )}
          </Link>
          {feedback.attendee?.type && (
            <AttendeeTypeBadge type={feedback.attendee.type} />
          )}
          <p
            className="pl-2 font-semibold text-gray-500"
            dangerouslySetInnerHTML={{ __html: summaryString }}
          />
        </div>
        {feedback.attendee?.email && (
          <p className="font-semibold text-gray-700">
            Email: {feedback.attendee.email}
          </p>
        )}
        {feedback.comment && (
          <p className="italic text-gray-700">{`"${feedback.comment}"`}</p>
        )}
      </div>
    </div>
  );
}
