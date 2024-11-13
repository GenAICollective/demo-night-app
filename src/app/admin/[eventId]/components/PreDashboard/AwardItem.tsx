import { type Award } from "@prisma/client";
import { motion } from "framer-motion";
import { EyeOff, MoveDown, MoveUp, Trash } from "lucide-react";

import { api } from "~/trpc/react";

export function AwardItem({
  award,
  onClick,
  refetchEvent,
}: {
  award: Award;
  onClick: () => void;
  refetchEvent: () => void;
}) {
  const updateIndexMutation = api.award.updateIndex.useMutation();
  const deleteMutation = api.award.delete.useMutation();

  return (
    <motion.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-row items-center gap-2"
    >
      <p className="min-w-[15px] font-bold">{`${award.index + 1}.`}</p>
      <button
        title="Edit Award"
        className="flex flex-1 flex-row items-center gap-2 rounded-xl bg-white p-2 text-start font-medium focus:outline-none"
        onClick={onClick}
      >
        <p className="line-clamp-1">{award.name}</p>
        {!award.votable && (
          <EyeOff size={14} strokeWidth={3} className="text-gray-600" />
        )}
      </button>
      <div className="flex flex-row gap-1 font-semibold">
        <button
          title="Move Up"
          onClick={() => {
            updateIndexMutation
              .mutateAsync({
                id: award.id,
                index: award.index - 1,
              })
              .then(() => refetchEvent());
          }}
          className="focus:outline-none"
        >
          <MoveUp className="h-4 w-4" strokeWidth={2.5} />
        </button>
        <button
          title="Move Down"
          onClick={() => {
            updateIndexMutation
              .mutateAsync({
                id: award.id,
                index: award.index + 1,
              })
              .then(() => refetchEvent());
          }}
          className="focus:outline-none"
        >
          <MoveDown className="h-4 w-4" strokeWidth={2.5} />
        </button>
        <button
          title="Delete"
          onClick={() => {
            deleteMutation.mutateAsync(award.id).then(() => refetchEvent());
          }}
          className="focus:outline-none"
        >
          <Trash className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
    </motion.li>
  );
}
