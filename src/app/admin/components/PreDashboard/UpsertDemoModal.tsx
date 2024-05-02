"use client";

import { type Demo } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { api } from "~/trpc/react";

import SubmitButton from "~/components/SubmitButton";
import { useModal } from "~/components/modal/provider";

export function UpsertDemoModal({
  demo,
  eventId,
  onCreated,
}: {
  demo?: Demo;
  eventId: string;
  onCreated: (demo: Demo) => void;
}) {
  const upsertMutation = api.demo.upsert.useMutation();
  const { register, handleSubmit } = useForm({
    defaultValues: demo,
  });
  const modal = useModal();

  return (
    <form
      onSubmit={handleSubmit((data) => {
        upsertMutation
          .mutateAsync({
            originalId: demo?.id,
            id: demo?.id,
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
      <h1 className="text-center text-xl font-bold">
        {demo ? "Edit" : "Create"} Demo
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
      {demo && (
        <label className="flex flex-col gap-1">
          <span className="font-semibold">Demo ID</span>
          <input
            type="text"
            {...register("id")}
            className="rounded-xl border border-gray-200 p-2"
            autoComplete="off"
          />
        </label>
      )}
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Email</span>
        <input
          type="email"
          {...register("email", { required: true })}
          className="rounded-xl border border-gray-200 p-2"
          autoComplete="off"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-semibold">URL</span>
        <input
          type="url"
          {...register("url", { required: true })}
          className="rounded-xl border border-gray-200 p-2"
          autoComplete="off"
        />
      </label>
      <SubmitButton
        title={`${demo ? "Update" : "Create"} Demo`}
        pending={upsertMutation.isPending}
      />
    </form>
  );
}
