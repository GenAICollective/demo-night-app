import { type Demo } from "@prisma/client";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { api } from "~/trpc/react";

import Button from "~/components/Button";
import { useModal } from "~/components/modal/provider";

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
  const modal = useModal();
  const deleteMutation = api.demo.delete.useMutation();

  const showUpdateIndexModal = () => {
    modal?.show(<UpdateIndexModal demo={demo} />);
  };

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
        className="line-clamp-1 flex-1 rounded-xl bg-white p-2 text-start font-medium focus:outline-none"
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
          title="Move"
          onClick={showUpdateIndexModal}
          className="focus:outline-none"
        >
          ↕
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

export function UpdateIndexModal({ demo }: { demo: Demo }) {
  const updateIndexMutation = api.demo.updateIndex.useMutation();
  const { register, handleSubmit } = useForm({
    defaultValues: { order: demo.index + 1 },
  });
  const modal = useModal();

  return (
    <form
      onSubmit={handleSubmit((data) => {
        updateIndexMutation
          .mutateAsync({
            id: demo.id,
            index: data.order - 1,
          })
          .then(() => {
            modal?.hide();
            toast.success(`Successfully updated index!`);
          })
          .catch((error) => {
            toast.error(`Failed to update index: ${error.message}`);
          });
      })}
      className="flex flex-col gap-4"
    >
      <h1 className="text-center text-xl font-bold">Update Order</h1>
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Order</span>
        <input
          type="number"
          placeholder="1"
          {...register("order", {
            valueAsNumber: true,
            min: 1,
          })}
          className="rounded-xl border border-gray-200 p-2"
          autoComplete="off"
          autoFocus
          required
        />
      </label>
      <Button pending={updateIndexMutation.isPending}>Update Order</Button>
    </form>
  );
}
