"use client";

import { type Award } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { api } from "~/trpc/react";

import Button from "~/components/Button";
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
          placeholder="🏆 Best Overall"
          {...register("name")}
          className="rounded-xl border border-gray-200 p-2"
          autoComplete="off"
          autoFocus
          required
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
            required
          />
        </label>
      )}
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Description</span>
        <textarea
          placeholder="Award for the best overall demo!"
          {...register("description")}
          className="rounded-xl border border-gray-200 p-2"
          rows={2}
          required
        />
      </label>
      <Button pending={upsertMutation.isPending}>
        {`${award ? "Update" : "Create"} Award`}
      </Button>
    </form>
  );
}
