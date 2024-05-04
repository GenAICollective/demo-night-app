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
  onSubmit,
}: {
  award?: Award;
  eventId: string;
  onSubmit: (award: Award) => void;
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
            id: data.id as string,
            eventId: eventId,
            name: data.name as string,
            description: data.description as string,
          })
          .then((result) => {
            modal?.hide();
            toast.success(
              `Successfully ${award ? "updated" : "created"} award!`,
            );
            onSubmit(result);
          })
          .catch((error) => {
            toast.error(
              `Failed to ${award ? "update" : "create"} award: ${error.message}`,
            );
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
          autoFocus
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
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Description</span>
        <textarea
          {...register("description", { required: true, minLength: 3 })}
          className="rounded-xl border border-gray-200 p-2"
          rows={2}
        />
      </label>
      <SubmitButton
        title={`${award ? "Update" : "Create"} Award`}
        pending={upsertMutation.isPending}
      />
    </form>
  );
}
