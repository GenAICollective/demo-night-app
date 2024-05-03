"use client";

import { type Event } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { api } from "~/trpc/react";

import SubmitButton from "~/components/SubmitButton";
import { useModal } from "~/components/modal/provider";

export function UpsertEventModal({
  event,
  onSubmit,
}: {
  event?: Event;
  onSubmit: (event: Event) => void;
}) {
  const upsertMutation = api.event.upsert.useMutation();
  const { register, handleSubmit } = useForm({
    defaultValues: event,
  });
  const modal = useModal();

  return (
    <form
      onSubmit={handleSubmit((data) => {
        upsertMutation
          .mutateAsync({
            originalId: event?.id,
            id: data.id as string,
            name: data.name as string,
            date: new Date(data.date).toISOString(),
            url: data.url as string,
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
        {event ? "Update" : "Create New"} Event
      </h1>
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
            {...register("id", { required: true })}
            className="rounded-xl border border-gray-200 p-2"
            autoComplete="off"
          />
        </label>
      )}
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Date</span>
        <input
          type="date"
          {...register("date", { required: true })}
          className="rounded-xl border border-gray-200 p-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-semibold">URL</span>
        <input
          type="url"
          {...register("url", { required: true })}
          className="rounded-xl border border-gray-200 p-2"
          autoComplete="off"
          placeholder="https://lu.ma/sf-demo"
        />
      </label>
      <SubmitButton
        title={event ? "Update Event" : "Create Event"}
        pending={upsertMutation.isPending}
      />
    </form>
  );
}
