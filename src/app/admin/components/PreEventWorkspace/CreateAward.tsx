"use client";

import { type Award } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { api } from "~/trpc/react";

import SubmitButton from "~/components/SubmitButton";
import { useModal } from "~/components/modal/provider";

export function CreateAwardButton({
  eventId,
  onCreated,
}: {
  eventId: string;
  onCreated: (award: Award) => void;
}) {
  const modal = useModal();
  return (
    <button
      className="rounded-lg bg-blue-200 p-2 font-semibold transition-all hover:bg-blue-300 focus:outline-none"
      onClick={() =>
        modal?.show(
          <CreateAwardModal eventId={eventId} onCreated={onCreated} />,
        )
      }
    >
      ⊕ Award
    </button>
  );
}

export function CreateAwardModal({
  eventId,
  onCreated,
}: {
  eventId: string;
  onCreated: (award: Award) => void;
}) {
  const createMutation = api.award.create.useMutation();
  const { register, handleSubmit } = useForm();
  const modal = useModal();

  return (
    <form
      onSubmit={handleSubmit((data) => {
        createMutation
          .mutateAsync({
            eventId: eventId,
            name: data.name as string,
          })
          .then((result) => {
            modal?.hide();
            toast.success("Successfully created award!");
            onCreated(result);
          })
          .catch((error) => {
            toast.error(`Failed to create award: ${error.message}`);
          });
      })}
      className="flex flex-col gap-4"
    >
      <h1 className="text-center text-xl font-bold">Create New Award</h1>
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Name</span>
        <input
          type="text"
          {...register("name", { required: true, minLength: 3 })}
          className="rounded-md border border-gray-200 p-2"
        />
      </label>
      <SubmitButton title="Create Award" pending={createMutation.isPending} />
    </form>
  );
}
