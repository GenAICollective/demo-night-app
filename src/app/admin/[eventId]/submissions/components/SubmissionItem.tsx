import { type Submission } from "@prisma/client";
import { motion } from "framer-motion";
import { FlagIcon, StarIcon } from "lucide-react";

import { cn } from "~/lib/utils";

import SubmissionStatusBadge from "~/components/SubmissionStatusBadge";

export function SubmissionItem({
  index,
  submission,
  isSelected,
  onClick,
}: {
  index: number;
  submission: Submission;
  isSelected: boolean;
  onClick: (submission: Submission) => void;
}) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-row items-center gap-2"
    >
      <p className="min-w-[25px] font-bold">{`${index + 1}.`}</p>
      <button
        title="Review Submission"
        onClick={() => onClick(submission)}
        className={cn(
          "flex flex-1 flex-row items-start gap-2 rounded-xl border-2 bg-white p-[6px] focus:outline-none",
          isSelected ? "border-gray-400" : "border-transparent",
        )}
      >
        <div className="flex flex-1 flex-col items-start gap-1">
          <p className="line-clamp-1 text-start font-medium">
            {submission.name}
          </p>
          <SubmissionStatusBadge status={submission.status} />
        </div>
        <div className="flex flex-col items-end gap-1">
          <StarRating rating={submission.rating ?? 0} />
          {submission.flagged && (
            <FlagIcon
              className="h-[18px] w-[18px] fill-orange-500 text-orange-700"
              strokeWidth={2.5}
            />
          )}
        </div>
      </button>
    </motion.li>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex flex-row gap-[1px]">
      {[1, 2, 3, 4, 5].map((_, index) => (
        <StarIcon
          key={index}
          className={cn(
            "h-[20px] w-[20px] transition-all duration-300",
            index < rating
              ? "fill-yellow-300 text-yellow-500"
              : "text-gray-400",
          )}
          strokeWidth={2.25}
        />
      ))}
    </div>
  );
}
