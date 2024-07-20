import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

export const submissionRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        name: z.string(),
        tagline: z.string(),
        description: z.string(),
        email: z.string().email(),
        url: z.string().url(),
        pocName: z.string(),
        demoUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return db.submission.create({
        data: input,
      });
    }),
  all: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return db.submission.findMany({
        where: { eventId: input.eventId },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        email: z.string().email().optional(),
        url: z.string().url().optional(),
        pocName: z.string().optional(),
        demoUrl: z.string().optional(),
        tagline: z.string().optional(),
        status: z
          .enum([
            "PENDING",
            "WAITLISTED",
            "AWAITING_CONFIRMATION",
            "CONFIRMED",
            "CANCELLED",
            "REJECTED",
          ])
          .optional(),
        rating: z.number().optional(),
        comment: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return db.submission.update({
        where: { id },
        data,
      });
    }),
  delete: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    return db.submission.delete({
      where: { id: input },
    });
  }),
});
