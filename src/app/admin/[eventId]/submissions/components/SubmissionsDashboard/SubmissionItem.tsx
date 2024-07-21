import { type Submission } from "@prisma/client";
import { motion } from "framer-motion";

import { api } from "~/trpc/react";

export function SubmissionItem({
  index,
  submission,
  onClick,
  refetch,
}: {
  index: number;
  submission: Submission;
  onClick: (submission: Submission) => void;
  refetch: () => void;
}) {
  const allowDeletion = false;
  const deleteMutation = api.submission.delete.useMutation();

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
        title="Edit Submission"
        onClick={() => onClick(submission)}
        className="line-clamp-1 flex-1 rounded-xl bg-white p-2 text-start font-medium focus:outline-none"
      >
        {submission.name}
      </button>
      {allowDeletion && (
        <div className="flex flex-row gap-2 font-semibold">
          <button
            title="Delete"
            onClick={() => {
              deleteMutation.mutateAsync(submission.id).then(() => refetch());
            }}
            className="focus:outline-none"
          >
            🗑️
          </button>
        </div>
      )}
    </motion.li>
  );
}
