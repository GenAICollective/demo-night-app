import { type Demo } from "@prisma/client";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { api } from "~/trpc/react";

export function DemoItem({
  demo,
  eventId,
  onClick,
  onClickQR,
  refetchEvent,
}: {
  demo: Demo;
  eventId: string;
  onClick: () => void;
  onClickQR: () => void;
  refetchEvent: () => void;
}) {
  const updateIndexMutation = api.demo.updateIndex.useMutation();
  const deleteMutation = api.demo.delete.useMutation();

  return (
    <motion.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-row items-center gap-2"
    >
      <p className="min-w-[25px] font-bold">{`${demo.index + 1}.`}</p>
      <button
        title="Edit Demo"
        onClick={onClick}
        className="flex-1 rounded-xl bg-white p-2 text-start font-medium focus:outline-none"
      >
        {demo.name}
      </button>
      <div className="flex flex-row gap-2 font-semibold">
        <button
          title="Copy URL"
          onClick={() => {
            const url = `${window.location.origin}/${eventId}/${demo.id}?secret=${demo.secret}`;
            navigator.clipboard.writeText(url).then(
              () => {
                toast.success("URL copied to clipboard!");
              },
              (err) => {
                toast.error("Failed to copy URL: ", err);
              },
            );
          }}
          className="focus:outline-none"
        >
          📋
        </button>
        <button
          title="View URL as QR Code"
          onClick={onClickQR}
          className="focus:outline-none"
        >
          🔳
        </button>
        <button
          title="Move Up"
          onClick={() => {
            updateIndexMutation
              .mutateAsync({
                id: demo.id,
                index: demo.index - 1,
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
                id: demo.id,
                index: demo.index + 1,
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
            deleteMutation.mutateAsync(demo.id).then(() => refetchEvent());
          }}
          className="focus:outline-none"
        >
          🗑️
        </button>
      </div>
    </motion.li>
  );
}
