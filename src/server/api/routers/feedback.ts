import { type Feedback } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const feedbackRouter = createTRPCRouter({
  all: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        attendeeId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const feedbacks = await db.feedback.findMany({
        where: { eventId: input.eventId, attendeeId: input.attendeeId },
      });
      return feedbacks.reduce(
        (acc, feedback) => {
          acc[feedback.demoId] = feedback;
          return acc;
        },
        {} as Record<string, Feedback>,
      );
    }),
  upsert: publicProcedure
    .input(
      z.object({
        id: z.string(),
        eventId: z.string(),
        attendeeId: z.string(),
        demoId: z.string(),
        rating: z.number().min(1).max(10).optional().nullable(),
        claps: z.number().min(0).optional(),
        star: z.boolean().optional(),
        wantToAccess: z.boolean().optional(),
        wantToInvest: z.boolean().optional(),
        wantToWork: z.boolean().optional(),
        comment: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      return db.feedback.upsert({
        where: { id: input.id },
        create: { ...input },
        update: { ...input },
      });
    }),
  delete: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    return db.feedback.delete({
      where: { id: input },
    });
  }),
});
