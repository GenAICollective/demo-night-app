import { type Vote } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const voteRouter = createTRPCRouter({
  all: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        attendeeId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const votes = await db.vote.findMany({
        where: { eventId: input.eventId, attendeeId: input.attendeeId },
      });
      return votes.reduce(
        (acc, vote) => {
          acc[vote.awardId] = vote;
          return acc;
        },
        {} as Record<string, Vote>,
      );
    }),
  upsert: publicProcedure
    .input(
      z.object({
        id: z.string(),
        eventId: z.string(),
        attendeeId: z.string(),
        awardId: z.string(),
        demoId: z.string().nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      return db.vote.upsert({
        where: { id: input.id },
        create: { ...input },
        update: { ...input },
      });
    }),
  delete: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    return db.vote.delete({
      where: { id: input },
    });
  }),
});
