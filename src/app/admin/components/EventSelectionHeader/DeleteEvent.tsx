"use client";

import { toast } from "sonner";

import { api } from "~/trpc/react";

import { useModal } from "~/components/modal/provider";

export function DeleteEventButton({
  eventId,
  onDeleted,
}: {
  eventId: string;
  onDeleted: () => void;
}) {
  const modal = useModal();
  return (
    <button
      className="rounded-lg bg-red-200 p-2 font-semibold transition-all hover:bg-red-300 focus:outline-none"
      onClick={() =>
        modal?.show(
          <DeleteEventModal eventId={eventId} onDeleted={onDeleted} />,
        )
      }
    >
      Delete Event
    </button>
  );
}

export function DeleteEventModal({
  eventId,
  onDeleted,
}: {
  eventId: string;
  onDeleted: () => void;
}) {
  const deleteMutation = api.events.delete.useMutation();
  const modal = useModal();

  const handleDelete = () => {
    deleteMutation
      .mutateAsync(eventId)
      .then(() => {
        modal?.hide();
        toast.success("Event successfully deleted");
        onDeleted();
      })
      .catch((error) => {
        toast.error(`Failed to delete event: ${error.message}`);
      });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-center text-xl font-bold">Confirm Deletion</h1>
      <p className="w-[300px] text-wrap text-center">
        Are you sure you want to delete this event?
      </p>
      <button
        className="rounded-lg bg-red-500 p-2 font-semibold text-white transition-all hover:bg-red-600 focus:outline-none"
        onClick={handleDelete}
        disabled={deleteMutation.isPending}
      >
        Confirm Delete
      </button>
    </div>
  );
}
