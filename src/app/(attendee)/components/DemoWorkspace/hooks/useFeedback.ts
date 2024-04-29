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
  const { data: feedbacksData, refetch } = api.feedback.all.useQuery({
    eventId,
    attendeeId: attendee.id,
  });
  const [feedback, setFeedback] = useState<Feedback | null>(
    feedbacks[selectedDemo.id] ?? null,
  );
  const createMutation = api.feedback.create.useMutation();
  const updateMutation = api.feedback.update.useMutation();

  useEffect(() => {
    setLocalFeedbacks(feedbacks);
  }, [feedbacks]);

  useEffect(() => {
    if (feedbacksData) {
      setFeedbacks(feedbacksData);
    }
  }, [feedbacksData]);

  useEffect(() => {
    if (!feedback) {
      createMutation
        .mutateAsync({
          eventId,
          attendeeId: attendee.id,
          demoId: selectedDemo.id,
        })
        .then((newFeedback) => {
          setFeedback(newFeedback);
          feedbacks[selectedDemo.id] = newFeedback;
          setLocalFeedbacks(feedbacks);
        });
    } else {
      updateMutation.mutate(feedback);
    }
  }, [feedback]); // eslint-disable-line react-hooks/exhaustive-deps

  return { feedback, setFeedback, refetch };
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
