import { type Attendee, type Demo, type Feedback } from "@prisma/client";
import { useEffect, useState } from "react";

import { api } from "~/trpc/react";

export type LocalFeedback = Omit<Feedback, "id" | "createdAt" | "updatedAt">;
export type FeedbackByDemoId = Record<string, LocalFeedback>;

export function useFeedback(
  eventId: string,
  attendee: Attendee,
  selectedDemo: Demo,
) {
  const [feedbackByDemoId, setFeedbackByDemoId] = useState<FeedbackByDemoId>(
    getLocalFeedbackByDemoId(),
  );
  const { data: allFeedbackData } = api.feedback.all.useQuery({
    eventId,
    attendeeId: attendee.id,
  });
  const [feedback, setFeedback] = useState(
    feedbackByDemoId[selectedDemo.id] ??
      emptyFeedback(eventId, attendee.id, selectedDemo.id),
  );
  const [debouncedFeedback, setDebouncedFeedback] = useState(feedback);
  const upsertMutation = api.feedback.upsert.useMutation();

  useEffect(() => {
    setLocalFeedbackByDemoId(feedbackByDemoId);
  }, [feedbackByDemoId]);

  useEffect(() => {
    if (allFeedbackData) {
      setFeedbackByDemoId(allFeedbackData);
    }
  }, [allFeedbackData]);

  useEffect(() => {
    const newFeedback =
      feedbackByDemoId[selectedDemo.id] ??
      emptyFeedback(eventId, attendee.id, selectedDemo.id);
    setFeedback(newFeedback);
    setDebouncedFeedback(newFeedback); // Reset debounced feedback when demo changes
  }, [selectedDemo.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handler = setTimeout(() => {
      if (feedbackIsEmpty(debouncedFeedback)) return;
      upsertMutation.mutate(debouncedFeedback);
    }, 3_000);

    return () => clearTimeout(handler);
  }, [debouncedFeedback]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setDebouncedFeedback(feedback);
    setFeedbackByDemoId({
      ...feedbackByDemoId,
      [selectedDemo.id]: feedback,
    });
    // Only allow a single feedback to have a star
    if (feedback.star) {
      const feedbacksWithStar = Object.values(feedbackByDemoId).filter(
        (f) =>
          f.eventId === feedback.eventId &&
          f.star &&
          f.demoId !== feedback.demoId,
      );
      let updatedFeedbacks = feedbackByDemoId;
      feedbacksWithStar.forEach((f) => {
        updatedFeedbacks = {
          ...updatedFeedbacks,
          [f.demoId]: { ...f, star: false },
        };
      });
      setFeedbackByDemoId(updatedFeedbacks);
    }
  }, [feedback]); // eslint-disable-line react-hooks/exhaustive-deps

  return { feedbackByDemoId: feedbackByDemoId, feedback, setFeedback };
}

function emptyFeedback(
  eventId: string,
  attendeeId: string,
  demoId: string,
): LocalFeedback {
  return {
    eventId,
    attendeeId,
    demoId,
    rating: null,
    claps: 0,
    star: false,
    wantToAccess: false,
    wantToInvest: false,
    wantToWork: false,
    comment: null,
  };
}

function feedbackIsEmpty(feedback: LocalFeedback): boolean {
  return (
    feedback.rating === null &&
    feedback.claps === 0 &&
    feedback.star === false &&
    feedback.wantToAccess === false &&
    feedback.wantToInvest === false &&
    feedback.wantToWork === false &&
    feedback.comment === null
  );
}

function getLocalFeedbackByDemoId(): FeedbackByDemoId {
  if (typeof window !== "undefined") {
    const feedback = localStorage.getItem("feedback");
    if (feedback) return JSON.parse(feedback);
  }
  const feedback = {};
  setLocalFeedbackByDemoId(feedback);
  return feedback;
}

function setLocalFeedbackByDemoId(feedbackByDemoId: FeedbackByDemoId) {
  console.log("setLocalFeedbackByDemoId", feedbackByDemoId);
  if (typeof window === "undefined") return; // SSR guard
  localStorage.setItem("feedback", JSON.stringify(feedbackByDemoId));
}
