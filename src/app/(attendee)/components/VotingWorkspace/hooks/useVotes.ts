import { type Attendee, type Vote } from "@prisma/client";
import { useEffect, useState } from "react";

import { api } from "~/trpc/react";

export function useVotes(eventId: string, attendee: Attendee) {
  // [awardId: string]: Vote
  const [votes, setVotes] = useState<Record<string, Vote>>(getLocalVotes());
  const { data: votesData } = api.vote.all.useQuery({
    eventId,
    attendeeId: attendee.id,
  });
  const upsertMutation = api.vote.upsert.useMutation();

  useEffect(() => {
    setLocalVotes(votes);
  }, [votes]);

  useEffect(() => {
    if (votesData) {
      setVotes(votesData);
    }
  }, [votesData]);

  const setVote = (awardId: string, demoId: string) => {
    const vote = votes[awardId] ?? emptyVote(eventId, attendee.id, awardId);
    vote.demoId = demoId;
    setVotes({ ...votes, [awardId]: vote });
    upsertMutation.mutate(vote);
  };

  return { votes, setVote };
}

function emptyVote(eventId: string, attendeeId: string, awardId: string): Vote {
  return {
    id: crypto.randomUUID(),
    eventId,
    attendeeId,
    awardId,
    demoId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function getLocalVotes(): Record<string, Vote> {
  if (typeof window !== "undefined") {
    const votes = localStorage.getItem("votes");
    if (votes) return JSON.parse(votes);
  }
  const votes = {};
  setLocalVotes(votes);
  return votes;
}

function setLocalVotes(votes: Record<string, Vote>) {
  if (typeof window === "undefined") return; // SSR guard
  localStorage.setItem("votes", JSON.stringify(votes));
}
