"use client";

import { type Submission } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, LinkIcon, ShareIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { api } from "~/trpc/react";

import Button from "~/components/Button";
import EventTitle from "~/components/EventTitle";
import { useModal } from "~/components/modal/provider";

import { SubmissionItem } from "./SubmissionItem";
import { UpdateSubmissionModal } from "./UpdateSubmissionModal";
import InfoButton from "~/app/admin/components/InfoButton";

type Event = {
  id: string;
  name: string;
  date: Date;
  url: string;
  secret: string;
};

export default function SubmissionsDashboard({
  event,
  isAdmin,
}: {
  event: Event;
  isAdmin: boolean;
}) {
  const { data: submissions, refetch } = api.submission.all.useQuery({
    eventId: event.id,
    secret: event.secret,
  });
  const modal = useModal();
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("URL to view submissions copied to clipboard!");
  };

  return (
    <div className="flex size-full flex-1 flex-col items-center justify-center gap-2 p-2 text-black">
      <div className="flex w-full items-center justify-between gap-4 pt-2">
        <EventTitle name={event.name} url={event.url} />
        <Button
          className="w-40 bg-gray-200 text-gray-500 shadow-none hover:bg-gray-300 hover:text-gray-700"
          onClick={copyLink}
        >
          Share
          <ShareIcon className="-mt-1" size={20} strokeWidth={3.5} />
        </Button>
      </div>
      <div className="flex w-full flex-1 flex-row justify-between gap-2">
        <div className="flex min-w-[300px] max-w-[300px] flex-col gap-2 rounded-xl bg-gray-100 p-4">
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-2xl font-bold">Submissions</h2>
            <InfoButton
              title="Submissions"
              message="Click on a submission to review details and select finalists for the demo night!"
            />
          </div>
          <ul className="flex flex-col gap-2 overflow-y-auto overflow-x-clip">
            <AnimatePresence>
              {submissions?.map((submission, index) => (
                <SubmissionItem
                  key={submission.id}
                  index={index}
                  submission={submission}
                  onClick={() => setSelectedSubmission(submission)}
                  refetch={refetch}
                />
              ))}
            </AnimatePresence>
          </ul>
        </div>
        <div className="flex size-full flex-1 flex-col items-start justify-start gap-2 rounded-xl bg-gray-100 p-4">
          <SubmissionDetails
            submission={selectedSubmission}
            onUpdate={() => refetch()}
          />
        </div>
      </div>
    </div>
  );
}

const DESCRIPTION_MAX_LENGTH = 1000;

function SubmissionDetails({
  submission,
  onUpdate,
}: {
  submission: Submission | null;
  onUpdate: (submission: Submission) => void;
}) {
  const updateMutation = api.submission.update.useMutation();
  const { register, handleSubmit, watch } = useForm({
    defaultValues: submission ?? {},
  });

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
            toast.success(
              `Successfully ${submission ? "updated" : "created"} submission!`,
            );
            onUpdate(result);
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
