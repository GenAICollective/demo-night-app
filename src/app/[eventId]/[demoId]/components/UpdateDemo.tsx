"use client";

import { type Demo } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { api } from "~/trpc/react";

import { GaicoConfetti } from "~/components/Confetti";
import SubmitButton from "~/components/SubmitButton";

const DESCRIPTION_MAX_LENGTH = 120;

export function UpdateDemoPage({
  demo,
  secret,
}: {
  demo: Demo;
  secret: string;
}) {
  return (
    <>
      <div className="absolute bottom-0 max-h-[calc(100dvh-120px)] w-full max-w-xl">
        <div className="size-full p-4">
          <UpdateDemoForm demo={demo} secret={secret} />
        </div>
      </div>

      <div className="z-3 pointer-events-none fixed inset-0">
        <GaicoConfetti />
      </div>
    </>
  );
}

export function UpdateDemoForm({
  demo,
  secret,
}: {
  demo: Demo;
  secret: string;
}) {
  const updateDemoMutation = api.demo.update.useMutation();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: demo?.name ?? "",
      description: demo?.description ?? "",
      email: demo?.email ?? "",
      url: demo?.url ?? "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        updateDemoMutation.mutate({
          id: demo.id,
          secret,
          name: data.name,
          description: data.description,
          email: data.email,
          url: data.url,
        });
        toast.success("Successfully updated demo!");
      })}
      className="flex w-full flex-col items-center gap-4 font-medium"
    >
      <div>
        <h1 className="text-center font-kallisto text-4xl font-bold tracking-tight">
          Hey There! 👋
        </h1>
        <p className="text-md max-w-[330px] pt-2 text-center font-medium leading-5 text-gray-500">
          Put on your best smile! Don&apos;t worry, your contact info will only
          be shared with demoists you choose to connect with!
        </p>
      </div>
      <label className="flex w-full flex-col gap-1">
        <span className="text-lg font-semibold">Name</span>
        <input
          type="text"
          placeholder="GenAI Collective"
          {...register("name")}
          className="z-30 rounded-xl border-2 border-gray-200 bg-white/60 p-2 text-lg backdrop-blur"
          required
        />
      </label>
      <label className="flex w-full flex-col gap-1">
        <span className="text-lg font-semibold">Description</span>
        <textarea
          placeholder="Building a community of the brightest minds in AI to discuss, exchange, and innovate."
          {...register("description")}
          className="z-30 rounded-xl border-2 border-gray-200 bg-white/60 p-2 text-lg backdrop-blur"
          required
          maxLength={DESCRIPTION_MAX_LENGTH}
          rows={3}
        />
      </label>
      <label className="flex w-full flex-col gap-1">
        <span className="text-lg font-semibold">Email</span>
        <input
          type="email"
          placeholder="hello@genaicollective.ai"
          {...register("email")}
          className="z-10 rounded-xl border-2 border-gray-200 bg-white/60 p-2 text-lg backdrop-blur"
          required
        />
      </label>
      <label className="flex w-full flex-col gap-1">
        <span className="text-lg font-semibold">URL</span>
        <input
          type="url"
          placeholder="https://genaicollective.ai"
          {...register("url")}
          className="z-10 rounded-xl border-2 border-gray-200 bg-white/60 p-2 text-lg backdrop-blur"
          required
        />
      </label>
      <SubmitButton title="Update Profile" pending={false} />
    </form>
  );
}
