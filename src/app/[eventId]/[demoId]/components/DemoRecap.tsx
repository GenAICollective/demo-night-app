"use client";

import { Download, Link } from "lucide-react";
import { toast } from "sonner";

import { QUICK_ACTIONS } from "~/lib/types/quickActions";
import { type CompleteDemo } from "~/server/api/routers/demo";

import Button from "~/components/Button";
import { GaicoConfetti } from "~/components/Confetti";
import { RATING_EMOJIS } from "~/components/RatingSlider";

import { FeedbackItem } from "./FeedbackItem";

export default function DemoRecap({ demo }: { demo: CompleteDemo }) {
  return (
    <>
      <div className="absolute bottom-0 max-h-[calc(100dvh-120px)] w-full max-w-xl">
        <div className="flex w-full flex-col items-center gap-4 p-4 font-medium">
          <div>
            <h1 className="text-center font-kallisto text-4xl font-bold tracking-tight">
              Great demo!! 🤩
            </h1>
            <p className="text-md max-w-[330px] pt-2 text-center font-medium leading-5 text-gray-500">
              Here&apos;s all your feedback and followups!
            </p>
          </div>
          <ActionButtons demo={demo} />
          <RatingSummary demo={demo} />
          {demo.feedback.map((feedback) => (
            <FeedbackItem key={feedback.id} feedback={feedback} />
          ))}
        </div>
      </div>

      <div className="z-3 pointer-events-none fixed inset-0">
        <GaicoConfetti />
      </div>
    </>
  );
}

function ActionButtons({ demo }: { demo: CompleteDemo }) {
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("URL copied to clipboard!");
  };

  const downloadCSV = () => {
    const csv = [
      ["Comment", "Rating", "Claps", "Tell me more", "Quick actions"],
      ...demo.feedback.map((feedback) => [
        feedback.comment,
        feedback.rating,
        feedback.claps,
        feedback.tellMeMore,
        feedback.quickActions?.map((id) => QUICK_ACTIONS[id]?.name).join(", "),
      ]),
    ]
      .map((row) => row.map((cell) => (cell ?? "").toString()).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${demo.name}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex w-full flex-row gap-4">
      <Button className="basis-1/2" onClick={copyLink}>
        Link
        <Link className="-mt-1" size={20} strokeWidth={3.5} />
      </Button>
      <Button className="basis-1/2" onClick={() => window.location.reload()}>
        CSV <Download className="-mt-1" size={20} strokeWidth={3.5} />
      </Button>
    </div>
  );
}

function RatingSummary({ demo }: { demo: CompleteDemo }) {
  const numByRating = demo.feedback.reduce(
    (acc, feedback) => {
      if (feedback.rating) {
        acc[feedback.rating] += 1;
      }
      return acc;
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>,
  );

  return (
    <div className="flex w-full flex-row gap-2 rounded-xl bg-gray-300/50 p-2 shadow-xl backdrop-blur">
      {Object.entries(numByRating).map(([rating, count]) => (
        <div
          key={rating}
          className="flex basis-1/5 flex-col items-center justify-center rounded-xl py-2 backdrop-brightness-150"
        >
          <p className="line-clamp-1">{RATING_EMOJIS[Number(rating)]}</p>
          <p className="line-clamp-1 text-xl font-bold">{count}</p>
        </div>
      ))}
    </div>
  );
}
