import { useWorkspaceContext } from "../../contexts/WorkspaceContext";
import { type Award, type Demo, type Vote } from "@prisma/client";

import { useVotes } from "./hooks/useVotes";

export default function VotingWorkspace({
  awards,
  demos,
}: {
  awards: Award[];
  demos: Demo[];
}) {
  const { currentEvent, attendee } = useWorkspaceContext();
  const { votes, setVote } = useVotes(currentEvent.id, attendee);

  return (
    <div className="flex size-full flex-1 flex-col items-center justify-center gap-2 p-4">
      <div className="absolute bottom-0 w-full max-w-xl p-4">
        <h1 className="text-2xl font-semibold">
          Vote for your favorite demos!
        </h1>
        <div className="mt-4 grid grid-cols-1 gap-4">
          {awards.map((award) => (
            <AwardVote
              key={award.id}
              award={award}
              demos={demos}
              vote={votes[award.id]}
              setVote={setVote}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AwardVote({
  award,
  demos,
  vote,
  setVote,
}: {
  award: Award;
  demos: Demo[];
  vote?: Vote;
  setVote: (awardId: string, demoId: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">{award.name}</h2>
      <select
        value={vote?.demoId ?? ""}
        onChange={(e) => setVote(award.id, e.target.value)}
        className="w-full rounded-xl border border-gray-200 p-2"
      >
        <option value="">Select</option>
        {demos.map((demo) => (
          <option key={demo.id} value={demo.id}>
            {demo.name}
          </option>
        ))}
      </select>
    </div>
  );
}
