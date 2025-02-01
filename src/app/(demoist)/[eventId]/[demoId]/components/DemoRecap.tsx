"use client";

import { ChevronDown, CircleHelp, Download, ShareIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CSVLink } from "react-csv";
import { toast } from "sonner";

import { QUICK_ACTIONS_TITLE, type QuickAction } from "~/lib/types/quickAction";
import { type CompleteDemo } from "~/server/api/routers/demo";

import Button from "~/components/Button";
import { LogoConfetti } from "~/components/Confetti";
import { RATING_EMOJIS } from "~/components/RatingSlider";
import { useModal } from "~/components/modal/provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { FeedbackItem } from "./FeedbackItem";
import InfoModal from "./InfoModal";
import {
  type FilterOption,
  type SortOption,
  filterFeedback,
  sortFeedback,
} from "./feedbackUtils";

export default function DemoRecap({
  demo,
  quickActions,
}: {
  demo: CompleteDemo;
  quickActions: QuickAction[];
}) {
  const [sortOption, setSortOption] = useState<SortOption>("rank-highest");
  const [filterOption, setFilterOption] = useState<FilterOption>("all");

  const processedFeedback = filterFeedback(
    sortFeedback(demo.feedback, sortOption),
    filterOption,
  );

  return (
    <>
      <div className="w-full max-w-xl pt-32">
        <div className="flex w-full flex-col items-center gap-4 p-4 font-medium">
          <div>
            <h1 className="text-center font-kallisto text-4xl font-bold tracking-tight">
              Great demo!! 🤩
            </h1>
            <p className="text-md max-w-[330px] pt-2 text-center font-medium leading-5 text-gray-500">
              Here&apos;s all your feedback and followups!
            </p>
          </div>
          <ActionButtons demo={demo} quickActions={quickActions} />
          <RatingSummary demo={demo} />

          <div className="flex w-full gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex-1">
                  Sort by{" "}
                  {sortOption === "rank-highest"
                    ? "Highest Rank"
                    : "Lowest Rank"}
                  <ChevronDown className="-mt-1" size={20} strokeWidth={3.5} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortOption("rank-highest")}>
                  Highest Rank
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("rank-lowest")}>
                  Lowest Rank
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex-1">
                  Filter:{" "}
                  {filterOption === "all"
                    ? "All"
                    : filterOption === "invest"
                      ? "Want to Invest"
                      : "Email Me"}
                  <ChevronDown className="-mt-1" size={20} strokeWidth={3.5} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterOption("all")}>
                  All Feedback
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterOption("invest")}>
                  Want to Invest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterOption("email")}>
                  Email Me
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {processedFeedback.map((feedback) => (
            <FeedbackItem
              key={feedback.id}
              feedback={feedback}
              quickActions={quickActions}
            />
          ))}
        </div>
      </div>

      <div className="z-3 pointer-events-none fixed inset-0">
        <LogoConfetti />
      </div>
    </>
  );
}

function CSVDownloadButton({
  data,
  headers,
  filename,
}: {
  data: any[];
  headers: { label: string; key: string }[];
  filename: string;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Button className="basis-1/3">
        CSV <Download className="-mt-1" size={20} strokeWidth={3.5} />
      </Button>
    );
  }

  return (
    <CSVLink
      className="z-30 basis-1/3"
      data={data}
      headers={headers}
      filename={filename}
    >
      <Button>
        CSV <Download className="-mt-1" size={20} strokeWidth={3.5} />
      </Button>
    </CSVLink>
  );
}

function ActionButtons({
  demo,
  quickActions,
}: {
  demo: CompleteDemo;
  quickActions: QuickAction[];
}) {
  const modal = useModal();
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("URL to view demo recap copied to clipboard!");
  };

  const showInfoModal = () => {
    modal?.show(<InfoModal quickActions={quickActions} />);
  };

  const headers = useMemo(
    () => [
      { label: "Claps", key: "claps" },
      { label: "Comment", key: "comment" },
      { label: "Tell me more?", key: "tellMeMore" },
      ...quickActions.map((action) => ({
        label: `${action.icon} ${QUICK_ACTIONS_TITLE.replace(
          "...",
          "",
        )} ${action.description.charAt(0).toLowerCase() + action.description.slice(1)}`,
        key: `quickActions.${action.id}`,
      })),
      { label: "Attendee name", key: "attendee.name" },
      { label: "Attendee email", key: "attendee.email" },
      { label: "Attendee linkedin", key: "attendee.linkedin" },
      { label: "Attendee type", key: "attendee.type" },
    ],
    [quickActions],
  );

  const feedback = demo.feedback.map((feedback) => ({
    ...feedback,
    ...quickActions.reduce<Record<string, boolean | undefined>>(
      (acc, action) => {
        acc[`quickActions.${action.id}`] = feedback.quickActions?.includes(
          action.id,
        );
        return acc;
      },
      {},
    ),
  }));

  return (
    <div className="flex w-full flex-row gap-4">
      <Button className="basis-1/3" onClick={copyLink}>
        Share
        <ShareIcon className="-mt-1" size={20} strokeWidth={3.5} />
      </Button>
      <Button className="basis-1/3" onClick={showInfoModal}>
        Help
        <CircleHelp className="-mt-1" size={20} strokeWidth={3.5} />
      </Button>
      <CSVDownloadButton
        data={feedback}
        headers={headers}
        filename={`${demo.name} feedback.csv`}
      />
    </div>
  );
}

function RatingSummary({ demo }: { demo: CompleteDemo }) {
  const numByRating = demo.feedback.reduce(
    (acc, feedback) => {
      if (feedback.rating) {
        acc[feedback.rating] = (acc[feedback.rating] ?? 0) + 1;
      }
      return acc;
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>,
  );

  return (
    <div className="z-10 flex w-full flex-row gap-2 rounded-xl bg-gray-300/50 p-2 shadow-xl backdrop-blur">
      {Object.entries(numByRating).map(([rating, count]) => (
        <div
          key={rating}
          className="flex basis-1/5 flex-col items-center justify-center rounded-xl bg-white/50 py-2"
        >
          <p className="line-clamp-1">{RATING_EMOJIS[Number(rating)]}</p>
          <p className="line-clamp-1 text-xl font-bold">{count}</p>
        </div>
      ))}
    </div>
  );
}
