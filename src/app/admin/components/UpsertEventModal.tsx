"use client";

import { type Event } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { api } from "~/trpc/react";

import Button from "~/components/Button";
import { useModal } from "~/components/modal/provider";

import { DeleteEventButton } from "./DeleteEvent";

export function UpsertEventModal({
  event,
  onSubmit,
  onDeleted,
}: {
  event?: Event;
  onSubmit: (event: Event) => void;
  onDeleted: () => void;
}) {
  const upsertMutation = api.event.upsert.useMutation();
  const { register, handleSubmit } = useForm({
    values: {
      name: event?.name ?? "",
      id: event?.id,
      date: (event?.date ?? new Date()).toISOString().substring(0, 10),
      url: event?.url ?? "",
    },
  });
  const modal = useModal();

  return (
    <form
      onSubmit={handleSubmit((data) => {
        upsertMutation
          .mutateAsync({
            originalId: event?.id,
            id: data.id,
            name: data.name,
            date: new Date(data.date),
            url: data.url,
          })
          .then((result) => {
            modal?.hide();
            toast.success(
              `Successfully ${event ? "updated" : "created"} event!`,
            );
            onSubmit(result);
          })
          .catch((error) => {
            toast.error(
              `Failed to ${event ? "update" : "create"} event: ${error.message}`,
            );
          });
      })}
      className="flex flex-col gap-4"
    >
      <h1 className="text-center text-xl font-bold">
        {event ? "Edit" : "Create New"} Event
      </h1>
      {event && (
        <div className="fixed right-2 top-2">
          <DeleteEventButton eventId={event.id} onDeleted={onDeleted} />
        </div>
      )}
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Name</span>
        <input
          type="text"
          {...register("name", { required: true })}
          className="rounded-xl border border-gray-200 p-2"
          placeholder="SF Demo Extravaganza 🚀"
          autoComplete="off"
          autoFocus
        />
      </label>
      {event && (
        <label className="flex flex-col gap-1">
          <span className="font-semibold">ID</span>
          <input
            type="text"
            {...register("id")}
            className="rounded-xl border border-gray-200 p-2"
            autoComplete="off"
            required
          />
        </label>
      )}
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Date</span>
        <input
          type="date"
          {...register("date", { valueAsDate: true })}
          className="rounded-xl border border-gray-200 p-2"
          required
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-semibold">URL</span>
        <input
          type="url"
          {...register("url")}
          className="rounded-xl border border-gray-200 p-2"
          autoComplete="off"
          placeholder="https://lu.ma/sf-demo"
          required
        />
      </label>
      <Button pending={upsertMutation.isPending}>
        {event ? "Update Event" : "Create Event"}
      </Button>
    </form>
  );
}
