"use client";

import { type Demo } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { TAGLINE_MAX_LENGTH } from "~/lib/types/taglineMaxLength";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

import Button from "~/components/Button";
import { useModal } from "~/components/modal/provider";

export function UpsertDemoModal({
  demo,
  eventId,
  onSubmit,
}: {
  demo?: Demo;
  eventId: string;
  onSubmit: (demo: Demo) => void;
}) {
  const upsertMutation = api.demo.upsert.useMutation();
  const { register, handleSubmit, watch } = useForm({
    values: demo,
  });
  const modal = useModal();

  return (
    <form
      onSubmit={handleSubmit((data) => {
        upsertMutation
          .mutateAsync({
            originalId: demo?.id,
            id: data.id as string,
            eventId: eventId,
            name: data.name as string,
            description: data.description as string,
            email: data.email as string,
            url: data.url as string,
          })
          .then((result) => {
            modal?.hide();
            toast.success(`Successfully ${demo ? "updated" : "created"} demo!`);
            onSubmit(result);
          })
          .catch((error) => {
            toast.error(
              `Failed to ${demo ? "update" : "create"} demo: ${error.message}`,
            );
          });
      })}
      className="flex flex-col gap-4"
    >
      <h1 className="text-center text-xl font-bold">
        {demo ? "Edit" : "Create"} Demo
      </h1>
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Name</span>
        <input
          type="text"
          placeholder="Cofactory"
          {...register("name")}
          className="rounded-xl border border-gray-200 p-2"
          autoComplete="off"
          autoFocus
          required
        />
      </label>
      {demo && (
        <label className="flex flex-col gap-1">
          <span className="font-semibold">Demo ID</span>
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
        <div className="flex justify-between">
          <span className="font-semibold">Tagline</span>
          <span
            className={cn(
              "text-sm font-medium",
              watch("description")?.length > TAGLINE_MAX_LENGTH
                ? "text-red-500"
                : "text-gray-400",
            )}
          >
            {`(${watch("description").length} / ${TAGLINE_MAX_LENGTH})`}
          </span>
        </div>
        <textarea
          placeholder="The future of value creation in an AI-based economy."
          {...register("description")}
          className="rounded-xl border border-gray-200 p-2"
          rows={2}
          required
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Email</span>
        <input
          type="email"
          placeholder="hello@cofactory.ai"
          {...register("email")}
          className="rounded-xl border border-gray-200 p-2"
          autoComplete="off"
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
          required
        />
      </label>
      <Button pending={upsertMutation.isPending}>
        {`${demo ? "Update" : "Create"} Demo`}
      </Button>
    </form>
  );
}
