import { type Submission, type SubmissionStatus } from "@prisma/client";

import { statusTitle } from "~/lib/types/submissionStatus";

import Button from "~/components/Button";
import { useModal } from "~/components/modal/provider";

export default function EmailModal({
  submission,
  status,
}: {
  submission: Submission;
  status: SubmissionStatus;
}) {
  const modal = useModal();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        modal?.hide();
      }}
      className="flex w-full flex-col items-center gap-8 font-medium"
    >
      <div>
        <h1 className="line-clamp-1 text-center font-kallisto text-4xl font-bold tracking-tight">
          Email Draft ✍️
        </h1>
        <p className="text-md max-w-[330px] pt-2 text-center font-medium leading-5 text-gray-500">
          Here&apos;s a draft email to send to the demoist with status{" "}
          {statusTitle(status).toLowerCase()}. Please adapt it as needed!
        </p>
        <label className="flex w-full flex-col gap-1">
          <span className="font-semibold">To</span>
          <input
            type="text"
            value={submission.email}
            className="rounded-xl border border-gray-200 bg-white p-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-semibold">Subject</span>
          <input
            type="text"
            className="rounded-xl border border-gray-200 bg-white p-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-semibold">Body</span>
          <textarea
            className="max-h-64 min-h-10 rounded-xl border border-gray-200 bg-white p-2"
            rows={3}
          />
        </label>
      </div>
      <Button pending={false}>Done</Button>
    </form>
  );
}
