import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const feedbackRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        attendeeId: z.string(),
        demoId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return db.feedback.create({
        data: {
          attendeeId: input.attendeeId,
          demoId: input.demoId,
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        rating: z.number().min(1).max(10).optional(),
        claps: z.number().min(0).optional(),
        star: z.boolean().optional(),
        wantToAccess: z.boolean().optional(),
        wantToInvest: z.boolean().optional(),
        wantToWork: z.boolean().optional(),
        comment: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return db.feedback.update({
        where: {
          id: input.id,
        },
        data: {
          rating: input.rating,
          claps: input.claps,
          star: input.star,
          wantToAccess: input.wantToAccess,
          wantToInvest: input.wantToInvest,
          wantToWork: input.wantToWork,
          comment: input.comment,
        },
      });
    }),
  delete: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    return db.feedback.delete({
      where: {
        id: input,
      },
    });
  }),
});
