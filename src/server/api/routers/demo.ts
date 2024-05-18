import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

export const demoRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string(), secret: z.string() }))
    .query(async ({ input }) => {
      return db.demo.findUnique({
        where: { id: input.id, secret: input.secret },
        include: {
          feedback: true,
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        secret: z.string(),
        name: z.string(),
        description: z.string(),
        email: z.string().email(),
        url: z.string().url(),
      }),
    )
    .mutation(async ({ input }) => {
      return db.demo.update({
        where: { id: input.id, secret: input.secret },
        data: input,
      });
    }),
  getFeedback: protectedProcedure
    .input(z.string().nullable())
    .query(async ({ input }) => {
      if (!input) {
        return [];
      }
      return db.feedback.findMany({
        where: { demoId: input },
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
        email: z.string().email(),
        url: z.string().url(),
      }),
    )
    .mutation(async ({ input }) => {
      if (input.originalId) {
        return db.demo.update({
          where: { id: input.originalId },
          data: {
            id: input.id,
            name: input.name,
            description: input.description,
            email: input.email,
            url: input.url,
          },
        });
      } else {
        const index = await db.demo.count({
          where: { eventId: input.eventId },
        });
        return db.demo.create({
          data: {
            ...input,
            index,
          },
        });
      }
    }),
  updateIndex: protectedProcedure
    .input(z.object({ id: z.string(), index: z.number() }))
    .mutation(async ({ input }) => {
      return db.$transaction(async (prisma) => {
        const demoToUpdate = await prisma.demo.findUnique({
          where: { id: input.id },
          select: { index: true, eventId: true },
        });

        if (!demoToUpdate) {
          throw new Error("Demo not found");
        }

        if (demoToUpdate.index === input.index || input.index < 0) {
          return;
        }

        const maxIndex =
          (await prisma.demo.count({
            where: { eventId: demoToUpdate.eventId },
          })) - 1;

        if (input.index > maxIndex) {
          return;
        }

        if (demoToUpdate.index < input.index) {
          await prisma.demo.updateMany({
            where: {
              eventId: demoToUpdate.eventId,
              index: { gte: demoToUpdate.index, lte: input.index },
              NOT: { id: input.id },
            },
            data: {
              index: { decrement: 1 },
            },
          });
        } else {
          await prisma.demo.updateMany({
            where: {
              eventId: demoToUpdate.eventId,
              index: { gte: input.index, lte: demoToUpdate.index },
              NOT: { id: input.id },
            },
            data: {
              index: { increment: 1 },
            },
          });
        }

        return prisma.demo.update({
          where: { id: input.id },
          data: { index: input.index },
        });
      });
    }),
  delete: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    return db.$transaction(async (prisma) => {
      const demoToDelete = await prisma.demo.findUnique({
        where: { id: input },
        select: { eventId: true, index: true },
      });

      if (!demoToDelete) {
        throw new Error("Demo not found");
      }

      await prisma.demo.delete({
        where: { id: input },
      });

      await prisma.demo.updateMany({
        where: {
          eventId: demoToDelete.eventId,
          index: { gt: demoToDelete.index },
        },
        data: {
          index: { decrement: 1 },
        },
      });
    });
  }),
});
