"use client";

import { type Demo } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { api } from "~/trpc/react";

import SubmitButton from "~/components/SubmitButton";
import { useModal } from "~/components/modal/provider";

export function CreateDemoButton({
  eventId,
  onCreated,
}: {
  eventId: string;
  onCreated: (demo: Demo) => void;
}) {
  const modal = useModal();
  return (
    <button
      className="rounded-lg bg-blue-200 p-2 font-semibold transition-all hover:bg-blue-300 focus:outline-none"
      onClick={() =>
        modal?.show(<CreateDemoModal eventId={eventId} onCreated={onCreated} />)
      }
    >
      ⊕ Demo
    </button>
  );
}

export function CreateDemoModal({
  eventId,
  onCreated,
}: {
  eventId: string;
  onCreated: (demo: Demo) => void;
}) {
  const createMutation = api.demos.create.useMutation();
  const { register, handleSubmit } = useForm();
  const modal = useModal();

  return (
    <form
      onSubmit={handleSubmit((data) => {
        createMutation
          .mutateAsync({
            eventId: eventId,
            name: data.name as string,
            email: data.email as string,
            url: data.url as string,
          })
          .then((result) => {
            modal?.hide();
            toast.success("Successfully created demo!");
            onCreated(result);
          })
          .catch((error) => {
            toast.error(`Failed to create demo: ${error.message}`);
          });
      })}
      className="flex flex-col gap-4"
    >
      <h1 className="text-center text-xl font-bold">Create New Demo</h1>
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Name</span>
        <input
          type="text"
          {...register("name", { required: true, minLength: 3 })}
          className="rounded-md border border-gray-200 p-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Email</span>
        <input
          type="email"
          {...register("email", { required: true })}
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
      <SubmitButton title="Create Demo" pending={createMutation.isPending} />
    </form>
  );
}
