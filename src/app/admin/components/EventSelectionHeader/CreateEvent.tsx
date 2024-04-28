"use client";

import { type Event } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { api } from "~/trpc/react";

import SubmitButton from "~/components/SubmitButton";
import { useModal } from "~/components/modal/provider";

export function CreateEventButton({
  onCreated,
}: {
  onCreated: (event: Event) => void;
}) {
  const modal = useModal();
  return (
    <button
      className="rounded-lg bg-blue-200 p-2 font-semibold transition-all hover:bg-blue-300 focus:outline-none"
      onClick={() => modal?.show(<CreateEventModal onCreated={onCreated} />)}
    >
      Create Event
    </button>
  );
}

export function CreateEventModal({
  onCreated,
}: {
  onCreated: (event: Event) => void;
}) {
  const createMutation = api.event.create.useMutation();
  const { register, handleSubmit } = useForm();
  const modal = useModal();

  return (
    <form
      onSubmit={handleSubmit((data) => {
        createMutation
          .mutateAsync({
            name: data.name as string,
            date: new Date(data.date).toISOString(),
            url: data.url as string,
          })
          .then((result) => {
            modal?.hide();
            toast.success("Successfully created event!");
            onCreated(result);
          })
          .catch((error) => {
            toast.error(`Failed to create event: ${error.message}`);
          });
      })}
      className="flex flex-col gap-4"
    >
      <h1 className="text-center text-xl font-bold">Create New Event</h1>
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Name</span>
        <input
          type="text"
          defaultValue="SF Demo Extravaganza 🚀"
          {...register("name", { required: true })}
          className="rounded-md border border-gray-200 p-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Date</span>
        <input
          type="date"
          defaultValue={new Date().toISOString().split("T")[0]}
          {...register("date", { required: true })}
          className="rounded-md border border-gray-200 p-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-semibold">URL</span>
        <input
          type="url"
          {...register("url", { required: true })}
          className="rounded-md border border-gray-200 p-2"
        />
      </label>
      <SubmitButton title="Create Event" pending={createMutation.isPending} />
    </form>
  );
}
