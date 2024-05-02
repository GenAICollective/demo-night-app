"use client";

import { type Award } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { api } from "~/trpc/react";

import SubmitButton from "~/components/SubmitButton";
import { useModal } from "~/components/modal/provider";

export function UpsertAwardModal({
  award,
  eventId,
  onCreated,
}: {
  award?: Award;
  eventId: string;
  onCreated: (award: Award) => void;
}) {
  const upsertMutation = api.award.upsert.useMutation();
  const { register, handleSubmit } = useForm({
    defaultValues: award,
  });
  const modal = useModal();

  return (
    <form
      onSubmit={handleSubmit((data) => {
        upsertMutation
          .mutateAsync({
            originalId: award?.id,
            id: award?.id,
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
      <h1 className="text-center text-xl font-bold">
        {award ? "Update" : "Create"} Award
      </h1>
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Name</span>
        <input
          type="text"
          {...register("name", { required: true, minLength: 3 })}
          className="rounded-xl border border-gray-200 p-2"
          autoComplete="off"
        />
      </label>
      {award && (
        <label className="flex flex-col gap-1">
          <span className="font-semibold">Award ID</span>
          <input
            type="text"
            {...register("id")}
            className="rounded-xl border border-gray-200 p-2"
            autoComplete="off"
          />
        </label>
      )}
      <SubmitButton
        title={`${award ? "Update" : "Create"} Award`}
        pending={upsertMutation.isPending}
      />
    </form>
  );
}
