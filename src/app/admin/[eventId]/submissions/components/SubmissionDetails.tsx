import { type Submission, SubmissionStatus } from "@prisma/client";
import { FlagIcon, StarIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { SUBMISSION_STATUSES, statusTitle } from "~/lib/types/submissionStatus";
import { TAGLINE_MAX_LENGTH } from "~/lib/types/taglineMaxLength";
import { cn, debounce } from "~/lib/utils";
import { api } from "~/trpc/react";

import { statusColor } from "~/components/SubmissionStatusBadge";
import { useModal } from "~/components/modal/provider";

import EmailModal from "./EmailModal";
import { type Event } from "./SubmissionsDashboard";

export default function SubmissionDetails({
  event,
  submission,
  isAdmin,
  onUpdate,
}: {
  event: Event;
  submission: Submission;
  isAdmin: boolean;
  onUpdate: () => void;
}) {
  return (
    <div className="flex w-full flex-col gap-2 overflow-y-scroll">
      <SubmissionReview
        event={event}
        submission={submission}
        isAdmin={isAdmin}
        onUpdate={onUpdate}
      />
      <Submission
        submission={submission}
        isAdmin={isAdmin}
        onUpdate={onUpdate}
      />
    </div>
  );
}

function SubmissionReview({
  event,
  submission,
  isAdmin,
  onUpdate,
}: {
  event: Event;
  submission: Submission;
  isAdmin: boolean;
  onUpdate: () => void;
}) {
  const modal = useModal();
  const updateMutation = api.submission.update.useMutation();
  const convertToDemoMutation = api.submission.convertToDemo.useMutation();
  console.log(
    submission.status,
    submission.flagged,
    submission.rating,
    submission.comment,
  );
  const { register, setValue, watch } = useForm({
    values: {
      id: submission.id,
      status: submission.status,
      flagged: submission.flagged,
      rating: submission.rating,
      comment: submission.comment,
    },
  });
  const status = watch("status");

  const debouncedUpdate = debounce((data: any) => {
    updateMutation
      .mutateAsync({
        eventId: event.id,
        secret: event.secret,
        id: submission.id,
        status: data.status,
        flagged: data.flagged,
        rating: data.rating ? (data.rating as number) : null,
        comment: data.comment,
      })
      .then(onUpdate)
      .catch((error) => {
        toast.error(`Failed to update submission: ${error.message}`);
      });
  }, 1000);

  useEffect(() => {
    const subscription = watch(debouncedUpdate);
    return () => subscription.unsubscribe();
  }, [watch, debouncedUpdate]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const openEmailModal = (status: SubmissionStatus) => {
    modal?.show(<EmailModal submission={submission} status={status} />);
  };

  const convertToDemo = () => {
    convertToDemoMutation
      .mutateAsync(submission.id)
      .then(() => {
        toast.success(`Converted to demo!`);
        onUpdate();
      })
      .catch((error) => {
        toast.error(`Failed to convert to demo: ${error.message}`);
      });
  };

  const actionButton = (status: SubmissionStatus) => {
    switch (status) {
      // TODO:
      // case SubmissionStatus.WAITLISTED:
      // case SubmissionStatus.AWAITING_CONFIRMATION:
      // case SubmissionStatus.REJECTED:
      //   return (
      //     <button
      //       onClick={() => openEmailModal(status)}
      //       className="rounded-xl bg-orange-200 p-2 text-sm font-semibold"
      //     >
      //       Draft Email ✍️
      //     </button>
      //   );
      case SubmissionStatus.CONFIRMED:
        return (
          <button
            onClick={convertToDemo}
            className="rounded-xl bg-orange-200 p-2 text-sm font-semibold"
          >
            Convert to Demo 🧑‍💻
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-gray-100 p-4">
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-row items-center gap-4">
          <label className="flex flex-col gap-1">
            <select
              {...register("status")}
              className={cn(
                "rounded-xl border border-gray-200 p-2 text-sm font-semibold",
                statusColor(status),
                `text-${statusColor(status).replace("bg-", "")}-800`,
              )}
            >
              {SUBMISSION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {statusTitle(status)}
                </option>
              ))}
            </select>
          </label>
          {isAdmin && actionButton(status)}
          <div className="flex flex-col items-start gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("flagged")}
                className="hidden rounded-xl border border-gray-200 p-2"
              />
              <FlagIcon
                className={cn(
                  "h-6 w-6 cursor-pointer transition-all duration-300",
                  watch("flagged")
                    ? "fill-orange-500 text-orange-700"
                    : "text-gray-400",
                )}
                strokeWidth={2.5}
              />
            </label>
          </div>
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <StarIcon
                  key={value}
                  className={cn(
                    "h-[26px] w-[26px] cursor-pointer transition-all duration-300",
                    (watch("rating") ?? 0) >= value
                      ? "fill-yellow-300 text-yellow-500"
                      : "text-gray-400",
                  )}
                  strokeWidth={2.25}
                  onClick={() => {
                    if (watch("rating") === value) {
                      setValue("rating", null);
                    } else {
                      setValue("rating", value);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <label className="flex flex-col gap-1">
          <textarea
            {...register("comment")}
            placeholder="Add a comment..."
            className="max-h-32 min-h-10 rounded-xl border border-gray-200 p-2 placeholder:italic"
            rows={1}
          />
        </label>
      </div>
    </div>
  );
}

function Submission({
  submission,
  isAdmin,
  onUpdate,
}: {
  submission: Submission;
  isAdmin: boolean;
  onUpdate: () => void;
}) {
  const adminUpdateMutation = api.submission.adminUpdate.useMutation();
  const deleteMutation = api.submission.delete.useMutation();
  const { register, watch } = useForm({
    values: submission,
  });

  const debouncedUpdate = debounce((data: any) => {
    if (!isAdmin) return;
    adminUpdateMutation
      .mutateAsync({
        id: data.id,
        name: data.name,
        tagline: data.tagline,
        description: data.description,
        email: data.email,
        url: data.url,
        demoUrl: data.demoUrl,
        pocName: data.pocName,
      })
      .then(onUpdate)
      .catch((error) => {
        toast.error(`Failed to update submission: ${error.message}`);
      });
  }, 1000);

  useEffect(() => {
    const subscription = watch(debouncedUpdate);
    return () => subscription.unsubscribe();
  }, [watch, debouncedUpdate]);

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-gray-100 p-4">
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <label className="flex w-full flex-col gap-1">
            <span className="font-semibold">Startup Name</span>
            <input
              type="text"
              {...register("name")}
              className="rounded-xl border border-gray-200 bg-white p-2"
              disabled={!isAdmin}
            />
          </label>
          <label className="flex w-full flex-col gap-1">
            <span className="font-semibold">Startup Website</span>
            <input
              type="url"
              placeholder="https://yourstartupwebsite.com"
              {...register("url")}
              className="rounded-xl border border-gray-200 bg-white p-2"
              disabled={!isAdmin}
            />
          </label>
        </div>
        <label className="flex flex-col gap-1">
          <div className="flex w-full flex-row items-center justify-start gap-1 font-semibold">
            <span className="font-semibold">Tagline 👋</span>
            {watch("tagline")?.length >= 100 && (
              <span
                className={cn(
                  "text-sm italic",
                  watch("tagline")?.length >= TAGLINE_MAX_LENGTH
                    ? "text-red-500"
                    : "text-gray-400",
                )}
              >
                {`(${watch("tagline").length} / ${TAGLINE_MAX_LENGTH})`}
              </span>
            )}
          </div>
          <textarea
            {...register("tagline")}
            className="max-h-32 min-h-10 rounded-xl border border-gray-200 bg-white p-2"
            rows={2}
            disabled={!isAdmin}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-semibold">Demo Description 🧑‍💻</span>
          <textarea
            {...register("description")}
            className="max-h-64 min-h-10 rounded-xl border border-gray-200 bg-white p-2"
            rows={3}
            disabled={!isAdmin}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-semibold">Demo Link 🔗</span>
          <input
            type="url"
            placeholder="None"
            {...register("demoUrl")}
            className="rounded-xl border border-gray-200 bg-white p-2 placeholder:italic"
            autoComplete="off"
            disabled={!isAdmin}
          />
        </label>
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <label className="flex w-full flex-col gap-1">
            <span className="font-semibold">PoC Name</span>
            <input
              type="text"
              {...register("pocName")}
              className="rounded-xl border border-gray-200 bg-white p-2"
              disabled={!isAdmin}
            />
          </label>
          <label className="flex w-full flex-col gap-1">
            <span className="font-semibold">PoC Email</span>
            <input
              type="email"
              {...register("email")}
              className="rounded-xl border border-gray-200 bg-white p-2"
              disabled={!isAdmin}
            />
          </label>
        </div>
      </div>
      {isAdmin && (
        <div className="flex flex-row gap-4">
          <button
            className="rounded-xl bg-red-200 p-2 font-semibold transition-all hover:bg-red-300 focus:outline-none"
            onClick={() => {
              deleteMutation.mutateAsync(submission.id);
              onUpdate();
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
