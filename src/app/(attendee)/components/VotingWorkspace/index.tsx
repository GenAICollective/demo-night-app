import { useWorkspaceContext } from "../../contexts/WorkspaceContext";
import { type Award, type Demo } from "@prisma/client";

import AwardVoteSelect from "./AwardVoteSelect";
import { type LocalVote, useVotes } from "./hooks/useVotes";

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
        <h1 className="text-center font-kallisto text-4xl font-bold tracking-tight">
          Voting Time! 🗳️
        </h1>
        <div className="mt-4 grid grid-cols-1 gap-8">
          {awards.map((award) => (
            <AwardVoteItem
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

function AwardVoteItem({
  award,
  demos,
  vote,
  setVote,
}: {
  award: Award;
  demos: Demo[];
  vote?: LocalVote;
  setVote: (awardId: string, demoId: string) => void;
}) {
  return (
    <div className="flex flex-col font-medium">
      <h2 className="text-2xl font-bold">{award.name}</h2>
      <p className="text-md pb-2 pl-[2px] text-lg font-semibold italic leading-6 text-gray-500">
        {award.description}
      </p>
      <AwardVoteSelect
        award={award}
        demos={demos}
        vote={vote}
        onSelect={(awardId, demoId) => setVote(awardId, demoId)}
      />
    </div>
  );
}
