import { type Feedback } from "@prisma/client";

export function feedbackScore(feedback: Feedback) {
  let score = feedback.comment ? 1000 : 0;
  score += feedback.comment?.length ?? 0;
  score += (feedback.rating ?? 0) * 5;
  score += feedback.claps ?? 0;
  score += feedback.tellMeMore ? 10 : 0;
  score += feedback.quickActions.length * 20;
  return score;
}
