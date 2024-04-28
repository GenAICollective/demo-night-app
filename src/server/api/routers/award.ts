import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const awardRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ eventId: z.string(), name: z.string() }))
    .mutation(async ({ input }) => {
      const index = await db.award.count({
        where: { eventId: input.eventId },
      });
      return db.award.create({
        data: {
          eventId: input.eventId,
          index: index,
          name: input.name,
        },
      });
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ input }) => {
      return db.award.update({
        where: { id: input.id },
        data: { name: input.name },
      });
    }),
  updateIndex: protectedProcedure
    .input(z.object({ id: z.string(), index: z.number() }))
    .mutation(async ({ input }) => {
      return db.$transaction(async (prisma) => {
        const awardToUpdate = await prisma.award.findUnique({
          where: { id: input.id },
          select: { index: true, eventId: true },
        });

        if (!awardToUpdate) {
          throw new Error("Award not found");
        }

        if (awardToUpdate.index === input.index || input.index < 0) {
          return;
        }

        const maxIndex =
          (await prisma.award.count({
            where: { eventId: awardToUpdate.eventId },
          })) - 1;

        if (input.index > maxIndex) {
          return;
        }

        if (awardToUpdate.index < input.index) {
          await prisma.award.updateMany({
            where: {
              eventId: awardToUpdate.eventId,
              index: { gte: awardToUpdate.index, lte: input.index },
              NOT: { id: input.id },
            },
            data: {
              index: { decrement: 1 },
            },
          });
        } else {
          await prisma.award.updateMany({
            where: {
              eventId: awardToUpdate.eventId,
              index: { gte: input.index, lte: awardToUpdate.index },
              NOT: { id: input.id },
            },
            data: {
              index: { increment: 1 },
            },
          });
        }

        return prisma.award.update({
          where: { id: input.id },
          data: { index: input.index },
        });
      });
    }),
  delete: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    return db.$transaction(async (prisma) => {
      const awardToDelete = await prisma.award.findUnique({
        where: { id: input },
        select: { eventId: true, index: true },
      });

      if (!awardToDelete) {
        throw new Error("Award not found");
      }

      await prisma.award.delete({
        where: { id: input },
      });

      await prisma.award.updateMany({
        where: {
          eventId: awardToDelete.eventId,
          index: { gt: awardToDelete.index },
        },
        data: {
          index: { decrement: 1 },
        },
      });
    });
  }),
});
