import { useDashboardContext } from "../../contexts/DashboardContext";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck } from "lucide-react";
import { useState } from "react";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

import { env } from "~/env";

const REFRESH_INTERVAL =
  env.NEXT_PUBLIC_NODE_ENV === "development" ? 1_000 : 5_000;

export default function VotingDashboard() {
  const { event, refetchEvent } = useDashboardContext();
  const [selectedAwardId, setSelectedAwardId] = useState<string | undefined>(
    event?.awards[0]?.id,
  );
  const updateWinnerMutation = api.award.updateWinner.useMutation();
  const { data: votes } = api.award.getVotes.useQuery(selectedAwardId ?? "", {
    enabled: !!selectedAwardId,
    refetchInterval: REFRESH_INTERVAL,
  });

  if (!event) {
    return null;
  }

  const selectedAward = event.awards.find((a) => a.id === selectedAwardId);

  const votesByDemoId = votes?.reduce(
    (acc, vote) => {
      if (!vote.demoId) {
        return acc;
      }
      if (!acc[vote.demoId]) {
        acc[vote.demoId] = 0;
      }
      acc[vote.demoId]++;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="flex size-full flex-row gap-2">
      <div className="flex w-[300px] flex-col gap-2 rounded-xl bg-gray-100 p-4">
        <h2 className="text-2xl font-bold">Awards</h2>
        <ul className="flex flex-col gap-2 overflow-auto">
          {event.awards.map((award) => (
            <li
              key={award.id}
              title="Select"
              className={cn(
                "flex flex-1 cursor-pointer items-center justify-between rounded-xl bg-white p-2 text-start font-medium focus:outline-none",
                award.winnerId ? "bg-green-200" : "bg-red-200",
              )}
              onClick={() => setSelectedAwardId(award.id)}
            >
              <p className="line-clamp-1">{award.name}</p>
              {selectedAwardId === award.id && (
                <CircleCheck size={14} strokeWidth={3} />
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-1 flex-col gap-2 rounded-xl bg-gray-100 p-4">
        <div className="flex flex-col">
          <h2 className="line-clamp-1 text-2xl font-bold">
            {selectedAward?.name ? `Votes for ${selectedAward.name}` : "Votes"}
          </h2>
          <p className="-mt-1 text-sm font-semibold text-gray-400">
            Total votes: {votes?.length}
          </p>
        </div>
        <ul className="flex max-h-screen flex-col gap-2 overflow-auto">
          <AnimatePresence>
            {Object.entries(votesByDemoId ?? {})
              .sort((a, b) => b[1] - a[1])
              .map(([demoId, votes]) => (
                <motion.li
                  key={demoId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  title="Set as winner"
                  className={cn(
                    "flex flex-1 cursor-pointer items-center justify-between rounded-xl bg-white p-2 text-start font-medium focus:outline-none",
                    selectedAward?.winnerId === demoId && "bg-green-200",
                  )}
                  onClick={() =>
                    updateWinnerMutation
                      .mutateAsync({
                        id: selectedAward?.id ?? "",
                        winnerId: demoId,
                      })
                      .then(refetchEvent)
                  }
                >
                  <div>
                    <p className="line-clamp-1">
                      {`${votes} votes: ${event.demos.find((demo) => demo.id === demoId)?.name}`}
                    </p>
                  </div>
                  {selectedAward?.winnerId === demoId && (
                    <CircleCheck size={14} strokeWidth={3} />
                  )}
                </motion.li>
              ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}
