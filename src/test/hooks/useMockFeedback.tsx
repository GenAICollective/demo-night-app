import { useEffect, useState } from "react";

import { type FeedbackAndAttendee } from "~/app/admin/components/DemosDashboard";

export const useMockFeedback = () => {
  const [feedback, setFeedback] = useState<FeedbackAndAttendee[]>([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFeedback((prevFeedback) => [
        ...prevFeedback,
        {
          id: `id_${Date.now()}`,
          eventId: "eventId",
          attendeeId: "attendeeId",
          demoId: "demoId",
          comment: "New automated feedback",
          rating: Math.floor(Math.random() * 6) + 1,
          star: Math.random() > 0.5,
          claps: Math.floor(Math.random() * 6),
          wantToAccess: Math.random() > 0.5,
          wantToInvest: Math.random() > 0.5,
          wantToWork: Math.random() > 0.5,
          createdAt: new Date(),
          updatedAt: new Date(),
          attendee: {
            name: "Anonymous",
            type:
              [
                "Investor",
                "Founder",
                "Engineer",
                "Product Manager",
                "Designer",
                "Other",
              ].sort(() => Math.random() - 0.5)[0] ?? null,
          },
        },
      ]);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return { feedback, refetch: () => {} };
};
