"use client";

import { type Attendee } from "@prisma/client";
import { CircleUserRoundIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ATTENDEE_TYPES, type AttendeeType } from "~/lib/types/attendeeTypes";
import { cn } from "~/lib/utils";

import Button from "~/components/Button";
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
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      name: attendee?.name ?? "",
      email: attendee?.email ?? "",
      linkedin: attendee?.linkedin ?? "",
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
          linkedin: data.linkedin,
          type: data.type,
        });
        toast.success("Profile updated! Hang tight 😎");
        onSubmit?.();
      })}
      className="flex w-full flex-col items-center gap-4 font-medium"
    >
      <div>
        <h1 className="text-center font-kallisto text-4xl font-bold tracking-tight">
          Welcome! 😄
        </h1>
        <p className="text-md max-w-[330px] pt-2 text-center font-medium leading-5 text-gray-500">
          We&apos;re glad you&apos;re here! Don&apos;t worry, your contact info
          will only be shared with demoists you choose to connect with!
        </p>
      </div>
      <label className="flex w-full flex-col gap-1">
        <span className="text-lg font-semibold">Name</span>
        <input
          type="text"
          placeholder="GenAI Collective"
          {...register("name")}
          className="z-30 rounded-xl border-2 border-gray-200 bg-white/60 p-2 text-lg backdrop-blur"
        />
      </label>
      <label className="flex w-full flex-col gap-1">
        <span className="text-lg font-semibold">Email</span>
        <input
          type="email"
          placeholder="hello@genaicollective.ai"
          {...register("email")}
          className="z-10 rounded-xl border-2 border-gray-200 bg-white/60 p-2 text-lg backdrop-blur"
        />
      </label>
      <label className="flex w-full flex-col gap-1">
        <span className="text-lg font-semibold">LinkedIn</span>
        <input
          type="url"
          placeholder="https://www.linkedin.com/in/genaicollective"
          {...register("linkedin")}
          className="z-10 rounded-xl border-2 border-gray-200 bg-white/60 p-2 text-lg backdrop-blur"
        />
      </label>
      <label className="flex w-full flex-col gap-1 pb-2">
        <span className="text-lg font-semibold">I consider myself a...</span>
        <select
          {...register("type")}
          className={cn(
            "z-30 appearance-none rounded-xl border-2 border-gray-200 bg-white/60 p-2 text-lg backdrop-blur",
            watch("type") === "" && "text-gray-400",
          )}
        >
          <option value="">Select one...</option>
          {ATTENDEE_TYPES.map((type) => (
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
      <Button>Update Profile</Button>
    </form>
  );
}

function selectedType(attendee: Attendee | null) {
  if (!attendee?.type) return "";
  return ATTENDEE_TYPES.includes(attendee.type as AttendeeType)
    ? attendee.type
    : "Other";
}
