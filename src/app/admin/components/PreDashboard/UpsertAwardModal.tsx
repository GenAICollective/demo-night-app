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
    values: {
      id: award?.id,
      name: award?.name,
      description: award?.description,
      votable: award?.votable ?? true,
    },
  });
  const modal = useModal();

  return (
    <form
      onSubmit={handleSubmit((data) => {
        upsertMutation
          .mutateAsync({
            originalId: award?.id,
            id: data.id,
            eventId: eventId,
            name: data.name!,
            description: data.description!,
            votable: data.votable!,
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
      className="flex max-w-[400px] flex-col gap-4"
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

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register("votable")}
          className="h-4 w-4 rounded border-gray-300"
        />
        <span
          className="font-semibold"
          title="Enable this if attendees should be able to cast votes for this award"
        >
          Attendees can vote?
        </span>
      </label>
      <Button pending={upsertMutation.isPending}>
        {`${award ? "Update" : "Create"} Award`}
      </Button>
    </form>
  );
}
