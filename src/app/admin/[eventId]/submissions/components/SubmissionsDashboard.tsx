"use client";

import { AnimatePresence } from "framer-motion";
import { ArrowUpRight, ShareIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { statusScore } from "~/lib/types/submissionStatus";
import { api } from "~/trpc/react";

import Button from "~/components/Button";
import EventTitle from "~/components/EventTitle";

import SubmissionDetails from "./SubmissionDetails";
import { SubmissionItem } from "./SubmissionItem";
import CsvButton from "~/app/admin/components/CsvButton";

const CSV_HEADERS = [
  "id",
  "name",
  "tagline",
  "description",
  "email",
  "url",
  "pocName",
  "demoUrl",
];

export type Event = {
  id: string;
  name: string;
  date: Date;
  url: string;
  secret: string;
};

export default function SubmissionsDashboard({
  event: initialEvent,
  isAdmin,
}: {
  event: Event;
  isAdmin: boolean;
}) {
  const { data: event, refetch: refetchEvent } = api.event.get.useQuery(
    initialEvent.id,
  );
  const { data: submissions, refetch: refetchSubmissions } =
    api.submission.all.useQuery({
      eventId: initialEvent.id,
      secret: initialEvent.secret,
    });
  const setSubmissionsMutation = api.submission.setSubmissions.useMutation();
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const refetch = () => {
    refetchEvent();
    refetchSubmissions();
  };

  submissions?.sort((a, b) => {
    if (a.status !== b.status) {
      return statusScore(b.status) - statusScore(a.status);
    }
    if (a.flagged !== b.flagged) {
      return a.flagged ? -1 : 1;
    }
    if ((b.rating ?? 0) !== (a.rating ?? 0)) {
      return (b.rating ?? 0) - (a.rating ?? 0);
    }
    return a.name.localeCompare(b.name);
  });

  const selectedSubmission = submissions?.find((s) => s.id === selectedId);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!submissions || submissions.length === 0) return;
      if (event.key === "Escape") {
        setSelectedId(undefined);
      }
      if (event.key === "ArrowUp" || event.key === "[") {
        setSelectedId((prev) => {
          if (!prev) return submissions[0]?.id;
          const currentIndex = submissions.findIndex((s) => s.id === prev);
          if (currentIndex > 0) return submissions[currentIndex - 1]?.id;
          return prev;
        });
      }
      if (event.key === "ArrowDown" || event.key === "]") {
        setSelectedId((prev) => {
          if (!prev) return submissions[0]?.id;
          const currentIndex = submissions.findIndex((s) => s.id === prev);
          if (currentIndex < submissions.length - 1)
            return submissions[currentIndex + 1]?.id;
          return prev;
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [submissions]);

  const copyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/admin/${initialEvent.id}/submissions?secret=${initialEvent.secret}`,
    );
    toast.success("URL to view submissions copied to clipboard!");
  };

  const description =
    event?.demos.length ?? 0 > 0
      ? `${submissions?.length ?? 0} submissions → ${event?.demos.length ?? 0} demos`
      : `${submissions?.length ?? 0} submissions`;

  const onUploadSubmissions = (rows: Record<string, string>[]) => {
    setSubmissionsMutation
      .mutateAsync({
        eventId: initialEvent.id,
        submissions: rows as any,
      })
      .then(() => {
        toast.success("Submissions updated!");
        refetch();
      })
      .catch((e) => {
        toast.error("Failed to update submissions: " + e.message);
      });
  };

  return (
    <div className="flex size-full max-h-screen min-h-screen flex-1 flex-col gap-2 p-2 text-black">
      <div className="flex w-full items-center justify-between gap-4 pt-2">
        <EventTitle name={initialEvent.name} url={initialEvent.url} />
        <Button
          className="w-40 bg-gray-200 text-gray-500 shadow-none hover:bg-gray-300 hover:text-gray-700"
          onClick={copyLink}
        >
          Share
          <ShareIcon className="-mt-1" size={20} strokeWidth={3.5} />
        </Button>
      </div>
      <div className="flex w-full flex-1 flex-row gap-2 overflow-y-auto">
        <div className="flex min-w-[400px] max-w-[400px] flex-col gap-2">
          <div className="flex max-h-full w-full flex-1 flex-col gap-2 rounded-xl bg-gray-100 p-4">
            <div className="flex flex-row items-center justify-between">
              <h2 className="text-2xl font-bold">Demo Submissions</h2>
              {isAdmin && submissions && (
                <CsvButton
                  style="minimal"
                  data={submissions}
                  headers={CSV_HEADERS}
                  filename="submissions.csv"
                  onUpload={onUploadSubmissions}
                />
              )}
            </div>
            <div className="-mt-1 flex flex-row items-center justify-between text-sm font-semibold text-gray-400">
              {description}
              <Link
                href={`/${initialEvent.id}/submit`}
                className="group flex items-center gap-1 hover:underline"
              >
                View form
                <ArrowUpRight
                  size={16}
                  strokeWidth={2.5}
                  className="rounded-md bg-gray-200 p-[1px] text-gray-400 group-hover:bg-gray-300 group-hover:text-gray-700"
                />
              </Link>
            </div>
            <ul className="flex flex-col gap-2 overflow-y-auto overflow-x-clip">
              <AnimatePresence>
                {submissions?.map((submission, index) => (
                  <SubmissionItem
                    key={submission.id}
                    index={index}
                    isSelected={selectedId === submission.id}
                    submission={submission}
                    onClick={() => setSelectedId(submission.id)}
                  />
                ))}
              </AnimatePresence>
            </ul>
          </div>
          {/* <div className="relative flex w-full flex-col gap-2 rounded-xl bg-gray-100 p-4">
            <ChevronUp className="absolute top-1 z-10 -ml-4 h-8 w-full cursor-pointer" />
            <div className="z-20 flex flex-row items-center justify-between">
              <h2 className="z-0 text-2xl font-bold">Demos</h2>
              <InfoButton
                title="Demos"
                message="These are the finalized demos for the event!"
              />
            </div>
          </div> */}
        </div>
        {selectedSubmission ? (
          <SubmissionDetails
            event={initialEvent}
            submission={selectedSubmission}
            isAdmin={isAdmin}
            onUpdate={refetch}
          />
        ) : (
          <div className="flex size-full items-start justify-center p-6">
            <p className="text-lg font-semibold italic text-gray-300">
              Select a submission to view details
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
