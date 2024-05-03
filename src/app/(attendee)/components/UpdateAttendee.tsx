"use client";

import { type Attendee } from "@prisma/client";
import { CircleUserRoundIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import SubmitButton from "~/components/SubmitButton";
import { useModal } from "~/components/modal/provider";

export function UpdateAttendeeButton({
  attendee,
  setAttendee,
}: {
  attendee: Attendee | null;
  setAttendee: (attendee: Attendee) => void;
}) {
  const modal = useModal();
  return (
    <CircleUserRoundIcon
      className="cursor-pointer hover:opacity-50 focus:outline-none"
      size={28}
      color="black"
      onClick={() =>
        modal?.show(
          <UpdateAttendeeModal attendee={attendee} setAttendee={setAttendee} />,
        )
      }
    />
  );
}

export function UpdateAttendeeModal({
  attendee,
  setAttendee,
}: {
  attendee: Attendee | null;
  setAttendee: (attendee: Attendee) => void;
}) {
  const modal = useModal();

  return (
    <UpdateAttendeeForm
      attendee={attendee}
      setAttendee={setAttendee}
      onSubmit={() => modal?.hide()}
    />
  );
}

export function UpdateAttendeeForm({
  attendee,
  setAttendee,
  onSubmit,
}: {
  attendee: Attendee | null;
  setAttendee: (attendee: Attendee) => void;
  onSubmit?: () => void;
}) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: attendee?.name ?? "",
      email: attendee?.email ?? "",
      type: selectedType(attendee),
      // customType: attendeePreselectTypes.includes(attendee?.type ?? "")
      //   ? ""
      //   : attendee?.type ?? "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        if (!attendee) {
          toast.error("Failed to update profile. Hang with us!");
          return;
        }
        setAttendee({
          id: attendee.id,
          name: data.name,
          email: data.email,
          type: data.type,
        });
        toast.success("Successfully updated profile!");
        onSubmit?.();
      })}
      className="flex w-full flex-col items-center gap-4"
    >
      <div>
        <h1 className="text-center text-4xl font-bold">Hey There! 👋</h1>
        <p className="text-md max-w-[330px] pt-2 text-center font-medium leading-5 text-gray-500">
          Put on your best smile! Don&apos;t worry, your contact info will only
          be shared with demoists you choose to connect with!
        </p>
      </div>
      <label className="flex w-full flex-col gap-1">
        <span className="font-semibold">Name</span>
        <input
          type="text"
          {...register("name")}
          className="rounded-xl border border-gray-200 p-2 text-lg"
          autoFocus
        />
      </label>
      <label className="flex w-full flex-col gap-1">
        <span className="font-semibold">Email</span>
        <input
          type="email"
          {...register("email")}
          className="rounded-xl border border-gray-200 p-2 text-lg"
        />
      </label>
      <label className="flex w-full flex-col gap-1">
        <span className="font-semibold">I consider myself a...</span>
        <select
          {...register("type")}
          className="appearance-none rounded-xl border border-gray-200 bg-white p-2 text-lg"
        >
          <option value="">Select one...</option>
          {attendeePreselectTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {/* {watch("type") === "Other" && (
          <input
            type="text"
            {...register("customType")}
            className="rounded-xl border border-gray-200 p-2"
          />
        )} */}
      </label>
      <SubmitButton title="Update Profile" pending={false} />
    </form>
  );
}

const attendeePreselectTypes = [
  "Founder",
  "Investor",
  "Engineer",
  "Product Manager",
  "Designer",
  "Other",
];

function selectedType(attendee: Attendee | null) {
  if (!attendee?.type) return "";
  return attendeePreselectTypes.includes(attendee.type)
    ? attendee.type
    : "Other";
}
