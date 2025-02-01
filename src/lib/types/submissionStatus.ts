import { SubmissionStatus } from "@prisma/client";

export function statusTitle(status: SubmissionStatus): string {
  switch (status) {
    case SubmissionStatus.PENDING:
      return "Pending";
    case SubmissionStatus.WAITLISTED:
      return "Waitlisted";
    case SubmissionStatus.AWAITING_CONFIRMATION:
      return "Awaiting Confirmation";
    case SubmissionStatus.CONFIRMED:
      return "Confirmed";
    case SubmissionStatus.CANCELLED:
      return "Cancelled";
    case SubmissionStatus.REJECTED:
      return "Rejected";
    default:
      return "Unknown";
  }
}

export function statusScore(status: SubmissionStatus): number {
  switch (status) {
    case SubmissionStatus.PENDING:
      return 2;
    case SubmissionStatus.WAITLISTED:
      return 3;
    case SubmissionStatus.AWAITING_CONFIRMATION:
      return 4;
    case SubmissionStatus.CONFIRMED:
      return 5;
    case SubmissionStatus.CANCELLED:
      return 1;
    case SubmissionStatus.REJECTED:
      return 0;
  }
}

export const SUBMISSION_STATUSES = [
  SubmissionStatus.PENDING,
  SubmissionStatus.WAITLISTED,
  SubmissionStatus.AWAITING_CONFIRMATION,
  SubmissionStatus.CONFIRMED,
  SubmissionStatus.CANCELLED,
  SubmissionStatus.REJECTED,
] as const;
