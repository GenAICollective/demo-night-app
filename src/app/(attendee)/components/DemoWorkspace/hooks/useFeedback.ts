import { type Attendee, type Demo, type Feedback } from "@prisma/client";
import { useEffect, useState } from "react";

import { api } from "~/trpc/react";

export function useFeedback(
  eventId: string,
  attendee: Attendee,
  selectedDemo: Demo,
) {
  const [feedbacks, setFeedbacks] =
    useState<Record<string, Feedback>>(getLocalFeedbacks());
  const { data: feedbacksData } = api.feedback.all.useQuery({
    eventId,
    attendeeId: attendee.id,
  });
  const [feedback, setFeedback] = useState(
    feedbacks[selectedDemo.id] ??
      emptyFeedback(eventId, attendee.id, selectedDemo.id),
  );
  const [debouncedFeedback, setDebouncedFeedback] = useState(feedback);
  const upsertMutation = api.feedback.upsert.useMutation();

  useEffect(() => {
    setLocalFeedbacks(feedbacks);
  }, [feedbacks]);

  useEffect(() => {
    if (feedbacksData) {
      setFeedbacks(feedbacksData);
    }
  }, [feedbacksData]);

  useEffect(() => {
    const newFeedback =
      feedbacks[selectedDemo.id] ??
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
    // Only allow a single feedback to have a star
    if (feedback.star) {
      const feedbacksWithStar = Object.values(feedbacks).filter(
        (f) => f.eventId === feedback.eventId && f.star && f.id !== feedback.id,
      );
      let updatedFeedbacks = feedbacks;
      feedbacksWithStar.forEach((f) => {
        updatedFeedbacks = {
          ...updatedFeedbacks,
          [f.demoId]: { ...f, star: false },
        };
      });
      setFeedbacks(updatedFeedbacks);
    }
  }, [feedback]); // eslint-disable-line react-hooks/exhaustive-deps

  return { feedback, setFeedback };
}

function emptyFeedback(
  eventId: string,
  attendeeId: string,
  demoId: string,
): Feedback {
  return {
    id: crypto.randomUUID(),
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
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function feedbackIsEmpty(feedback: Feedback): boolean {
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

function getLocalFeedbacks(): Record<string, Feedback> {
  if (typeof window !== "undefined") {
    const feedback = localStorage.getItem("feedback");
    if (feedback) return JSON.parse(feedback);
  }
  const feedback = {};
  setLocalFeedbacks(feedback);
  return feedback;
}

function setLocalFeedbacks(feedback: Record<string, Feedback>) {
  if (typeof window === "undefined") return; // SSR guard
  localStorage.setItem("feedback", JSON.stringify(feedback));
}
