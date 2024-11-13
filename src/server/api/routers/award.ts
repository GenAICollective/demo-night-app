import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const awardRouter = createTRPCRouter({
  getVotes: protectedProcedure
    .input(z.string().nullable())
    .query(async ({ input }) => {
      if (!input) {
        return [];
      }
      return db.vote.findMany({
        where: { awardId: input },
        include: {
          attendee: { select: { name: true, type: true } },
        },
      });
    }),
  upsert: protectedProcedure
    .input(
      z.object({
        originalId: z.string().optional(),
        id: z.string().optional(),
        eventId: z.string(),
        name: z.string(),
        description: z.string(),
        votable: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      if (input.originalId) {
        return db.award.update({
          where: { id: input.originalId },
          data: {
            name: input.name,
            description: input.description,
            votable: input.votable,
          },
        });
      } else {
        const index = await db.award.count({
          where: { eventId: input.eventId },
        });
        return db.award.create({
          data: {
            eventId: input.eventId,
            index: index,
            name: input.name,
            description: input.description,
            votable: input.votable,
          },
        });
      }
    }),
  updateWinner: protectedProcedure
    .input(z.object({ id: z.string(), winnerId: z.string() }))
    .mutation(async ({ input }) => {
      return db.award.update({
        where: { id: input.id },
        data: { winnerId: input.winnerId },
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
  setAwards: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        awards: z.array(
          z.object({
            id: z.string().optional(),
            name: z.string(),
            description: z.string(),
            votable: z.boolean().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      return db.$transaction(async (prisma) => {
        await prisma.award.deleteMany({ where: { eventId: input.eventId } });
        await prisma.award.createMany({
          data: input.awards.map((award, index) => ({
            ...award,
            eventId: input.eventId,
            index,
          })),
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
