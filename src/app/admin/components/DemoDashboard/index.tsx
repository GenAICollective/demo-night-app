import { type Demo, type Feedback } from "@prisma/client";
import { CircleCheck } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

import { env } from "~/env";

const REFRESH_INTERVAL =
  env.NEXT_PUBLIC_NODE_ENV === "development" ? 1_000 : 5_000;

export default function DemoDashboard({
  demos,
  currentDemoId,
  refetchEvent,
}: {
  demos: Demo[];
  currentDemoId: string | null;
  refetchEvent: () => void;
}) {
  const [selectedDemo, setSelectedDemo] = useState<Demo | undefined>(
    demos.find((demo) => demo.id === currentDemoId),
  );
  const { data: feedback, refetch: refetchFeedback } =
    api.demo.getFeedback.useQuery(selectedDemo?.id ?? "", {
      enabled: !!selectedDemo,
      refetchInterval: REFRESH_INTERVAL,
    });

  return (
    <div className="flex size-full flex-row gap-2">
      <div className="flex w-[300px] flex-col gap-2 rounded-xl bg-gray-100 p-4">
        <h2 className="text-2xl font-bold">Demos</h2>
        <ul className="flex flex-col gap-2 overflow-auto">
          {demos.map((demo) => (
            <DemoItem
              key={demo.id}
              demo={demo}
              selectedDemo={selectedDemo}
              setSelectedDemo={setSelectedDemo}
              isCurrent={demo.id === currentDemoId}
              refetchEvent={refetchEvent}
            />
          ))}
        </ul>
      </div>
      <div className="flex flex-1 flex-col gap-2 rounded-xl bg-gray-100 p-4">
        <div className="flex flex-col justify-between">
          <h2 className="line-clamp-1 text-2xl font-bold">
            {selectedDemo?.name
              ? `Feedback for ${selectedDemo.name}`
              : "Feedback"}
          </h2>
          <p className="-mt-1 text-sm font-semibold text-gray-400">
            Total feedback: {feedback?.length}
          </p>
        </div>
        <ul className="flex flex-col gap-2 overflow-auto">
          {feedback?.map((feedback) => (
            <FeedbackItem
              key={feedback.id}
              feedback={feedback}
              refetchFeedback={refetchFeedback}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

function DemoItem({
  demo,
  selectedDemo,
  setSelectedDemo,
  isCurrent,
  refetchEvent,
}: {
  demo: Demo;
  selectedDemo: Demo | undefined;
  setSelectedDemo: (demo: Demo) => void;
  isCurrent: boolean;
  refetchEvent: () => void;
}) {
  const updateCurrentDemoMutation = api.event.updateCurrentDemo.useMutation();
  const updateIndexMutation = api.demo.updateIndex.useMutation();

  return (
    <li className="flex flex-row items-center gap-2">
      <p className="w-[17px] font-bold">{`${demo.index + 1}.`}</p>
      <div
        className={cn(
          "flex flex-1 cursor-pointer flex-row items-center justify-between rounded-xl p-2 font-medium focus:outline-none",
          isCurrent ? "bg-green-200" : "bg-white",
        )}
        onClick={() => {
          setSelectedDemo(demo);
        }}
      >
        <p className="line-clamp-1">{demo.name}</p>
        {selectedDemo?.id === demo.id && (
          <CircleCheck size={14} strokeWidth={3} />
        )}
      </div>
      <div className="flex flex-row gap-2 font-semibold">
        <button
          onClick={() => {
            setSelectedDemo(demo);
            updateCurrentDemoMutation
              .mutateAsync({ id: demo.eventId, demoId: demo.id })
              .then(() => refetchEvent());
          }}
        >
          ⊕
        </button>
        <button
          onClick={() => {
            updateIndexMutation
              .mutateAsync({
                id: demo.id,
                index: demo.index - 1,
              })
              .then(() => refetchEvent());
          }}
        >
          ↑
        </button>
        <button
          onClick={() => {
            updateIndexMutation
              .mutateAsync({
                id: demo.id,
                index: demo.index + 1,
              })
              .then(() => refetchEvent());
          }}
        >
          ↓
        </button>
      </div>
    </li>
  );
}

type FeedbackAndName = Feedback & { attendee: { name: string | null } };

function FeedbackItem({
  feedback,
  refetchFeedback,
}: {
  feedback: FeedbackAndName;
  refetchFeedback: () => void;
}) {
  const deleteMutation = api.feedback.delete.useMutation();

  const summaryString = useMemo(() => {
    const summary: string[] = [];
    if (feedback.star) {
      summary.push("⭐");
    }
    if (feedback.rating) {
      summary.push(
        String.fromCodePoint(0x30 + feedback.rating, 0xfe0f, 0x20e3),
      );
    }
    if (feedback.claps) {
      summary.push(`👏<span class="text-xs"> x${feedback.claps}</span>`);
    }
    if (feedback.wantToAccess) {
      summary.push("📬");
    }
    if (feedback.wantToInvest) {
      summary.push("💰");
    }
    if (feedback.wantToWork) {
      summary.push("👩‍💻");
    }
    return summary.join(" • ");
  }, [feedback]);

  return (
    <li className="flex flex-row gap-2">
      <div className="flex flex-1 flex-col gap-1 rounded-xl bg-white p-2">
        <div className="flex flex-row gap-1">
          <p
            className={cn(
              "font-semibold",
              feedback.attendee.name?.length ?? 0 > 0
                ? "text-black"
                : "italic text-gray-400",
            )}
          >{`${feedback.attendee.name?.length ?? 0 > 0 ? feedback.attendee.name : "Anonymous"}`}</p>
          <p
            className="font-semibold text-gray-400"
            dangerouslySetInnerHTML={{
              __html: `${summaryString ? `• ${summaryString}` : ""}`,
            }}
          />
        </div>
        {feedback.comment && (
          <p className="font-medium italic">{`"${feedback.comment}"`}</p>
        )}
      </div>
      <div className="flex flex-row gap-2">
        <button
          onClick={() => {
            deleteMutation
              .mutateAsync(feedback.id)
              .then(() => refetchFeedback());
          }}
        >
          🗑
        </button>
      </div>
    </li>
  );
}
