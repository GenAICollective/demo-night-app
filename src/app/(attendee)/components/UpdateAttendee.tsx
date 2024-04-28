"use client";

import { type Attendee, type Event } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { api } from "~/trpc/react";

import SubmitButton from "~/components/SubmitButton";
import { useModal } from "~/components/modal/provider";

export function UpdateAttendeeButton({
  attendee,
  onUpdated,
}: {
  attendee: Attendee;
  onUpdated: (attendee: Attendee) => void;
}) {
  const modal = useModal();
  return (
    <button
      className="rounded-lg bg-blue-200 p-2 font-semibold transition-all hover:bg-blue-300 focus:outline-none"
      onClick={() =>
        modal?.show(
          <UpdateAttendeeModal attendee={attendee} onUpdated={onUpdated} />,
        )
      }
    >
      Update Profile
    </button>
  );
}

export function UpdateAttendeeModal({
  attendee,
  onUpdated,
}: {
  attendee: Attendee;
  onUpdated: (attendee: Attendee) => void;
}) {
  const updateMutation = api.attendee.update.useMutation();
  const { register, handleSubmit } = useForm();
  const modal = useModal();

  return (
    <form
      onSubmit={handleSubmit((data) => {
        updateMutation
          .mutateAsync({
            id: attendee.id,
            name: data.name as string,
            email: data.email as string,
            type: data.type as string,
          })
          .then((result) => {
            modal?.hide();
            toast.success("Successfully updated profile!");
            onUpdated(result);
          })
          .catch((error) => {
            toast.error(`Failed to update profile: ${error.message}`);
          });
      })}
      className="flex flex-col gap-4"
    >
      <h1 className="text-center text-xl font-bold">Update Profile</h1>
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Name</span>
        <input
          type="text"
          defaultValue={attendee.name ?? ""}
          {...register("name")}
          className="rounded-md border border-gray-200 p-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Email</span>
        <input
          type="email"
          defaultValue={attendee.email ?? ""}
          {...register("email")}
          className="rounded-md border border-gray-200 p-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Type</span>
        <input
          type="text"
          defaultValue={attendee.type ?? ""}
          {...register("type")}
          className="rounded-md border border-gray-200 p-2"
        />
      </label>
      <SubmitButton title="Update Profile" pending={updateMutation.isPending} />
    </form>
  );
}
