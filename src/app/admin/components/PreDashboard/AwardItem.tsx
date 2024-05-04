import { type Award } from "@prisma/client";
import { motion } from "framer-motion";

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
      <p className="min-w-[25px] font-bold">{`${award.index + 1}.`}</p>
      <button
        title="Edit Award"
        className="flex-1 rounded-xl bg-white p-2 text-start font-medium focus:outline-none"
        onClick={onClick}
      >
        {award.name}
      </button>
      <div className="flex flex-row gap-2 font-semibold">
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
          ↑
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
          ↓
        </button>
        <button
          title="Delete"
          onClick={() => {
            deleteMutation.mutateAsync(award.id).then(() => refetchEvent());
          }}
          className="focus:outline-none"
        >
          🗑️
        </button>
      </div>
    </motion.li>
  );
}
