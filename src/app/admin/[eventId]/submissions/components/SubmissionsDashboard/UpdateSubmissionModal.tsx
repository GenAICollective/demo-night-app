"use client";

import { type Submission } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { api } from "~/trpc/react";

import Button from "~/components/Button";
import { useModal } from "~/components/modal/provider";

const DESCRIPTION_MAX_LENGTH = 120;

export function UpdateSubmissionModal({
  submission,
  onSubmit,
}: {
  submission?: Submission;
  onSubmit: (submission: Submission) => void;
}) {
  const updateMutation = api.submission.update.useMutation();
  const { register, handleSubmit, watch } = useForm({
    defaultValues: submission,
  });
  const modal = useModal();

  return (
    <form
      onSubmit={handleSubmit((data) => {
        updateMutation
          .mutateAsync({
            id: data.id as string,
            name: data.name as string,
            description: data.description as string,
            email: data.email as string,
            url: data.url as string,
          })
          .then((result) => {
            modal?.hide();
            toast.success(
              `Successfully ${submission ? "updated" : "created"} submission!`,
            );
            onSubmit(result);
          })
          .catch((error) => {
            toast.error(
              `Failed to ${submission ? "update" : "create"} submission: ${error.message}`,
            );
          });
      })}
      className="flex flex-col gap-4"
    >
      <h1 className="text-center text-xl font-bold">
        {submission ? "Edit" : "Create"} Submission
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
      {submission && (
        <label className="flex flex-col gap-1">
          <span className="font-semibold">Submission ID</span>
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
        <span
          className={`font-semibold ${watch("description")?.length > DESCRIPTION_MAX_LENGTH ? "text-red-500" : ""}`}
        >
          Description{" "}
          {watch("description")?.length > DESCRIPTION_MAX_LENGTH
            ? `(${watch("description").length} / ${DESCRIPTION_MAX_LENGTH})`
            : ""}
        </span>
        <textarea
          placeholder="The future of value creation in an AI-based economy."
          {...register("description")}
          className="rounded-xl border border-gray-200 p-2"
          rows={2}
          maxLength={DESCRIPTION_MAX_LENGTH}
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
      <Button pending={updateMutation.isPending}>
        {`${submission ? "Update" : "Create"} Submission`}
      </Button>
    </form>
  );
}
