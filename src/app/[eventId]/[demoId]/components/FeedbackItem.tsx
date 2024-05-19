"use client";

import { ArrowUpRight } from "lucide-react";

import { QUICK_ACTIONS } from "~/lib/types/quickActions";
import { type DemoFeedback } from "~/server/api/routers/demo";

export function FeedbackItem({ feedback }: { feedback: DemoFeedback }) {
  const summary = [
    feedback.claps
      ? `👏<span class="text-xs"> x${feedback.claps}</span>`
      : null,
    feedback.tellMeMore ? "📬" : null,
    ...(feedback.quickActions?.map((id) => QUICK_ACTIONS[id]?.icon) ?? []),
  ].filter((s) => s) as string[];
  const summaryString = summary.join(" • ");
  return (
    <div key={feedback.id} className="w-full font-medium leading-6">
      <div className="group z-10 flex w-full flex-col gap-2 rounded-xl bg-gray-300/50 p-4 shadow-xl backdrop-blur">
        <div className="flex items-center gap-2">
          <h3 className="line-clamp-1 text-xl font-bold group-hover:underline">
            {feedback.comment}
          </h3>
          <ArrowUpRight
            size={24}
            strokeWidth={3}
            className="h-5 w-5 flex-none rounded-md bg-gray-300/50 p-[2px] text-gray-500 group-hover:bg-gray-400/50 group-hover:text-gray-700"
          />
          <p
            className="pl-2 font-semibold text-gray-500"
            dangerouslySetInnerHTML={{ __html: summaryString }}
          />
        </div>
        {feedback.rating && (
          <div className="pointer-events-none h-11 w-full px-2 pt-1">
            {feedback.rating}
          </div>
        )}
        {feedback.comment && (
          <p className="italic text-gray-700">{`"${feedback.comment}"`}</p>
        )}
      </div>
    </div>
  );
}
