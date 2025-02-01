import { type Demo, type Feedback } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

type BaseFeedback = {
  id: string;
  rating: number | null;
  claps: number;
  comment: string | null;
};

type FeedbackAttribution = {
  tellMeMore: boolean;
  quickActions: string[];
  attendee: {
    name: string | null;
    email: string | null;
    linkedin: string | null;
    type: string | null;
  };
};

export type DemoFeedback = BaseFeedback & Partial<FeedbackAttribution>;

export type CompleteDemo = Demo & {
  feedback: DemoFeedback[];
};

export type FeedbackAndAttendee = Feedback & {
  attendee: { name: string | null; type: string | null };
};

export const demoRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string(), secret: z.string() }))
    .query(async ({ input }) => {
      const demo = await db.demo.findUnique({
        where: { id: input.id, secret: input.secret },
        include: {
          feedback: {
            include: {
              attendee: true,
            },
          },
        },
      });
      if (!demo) {
        throw new Error("Demo not found");
      }
      const allFeedback: DemoFeedback[] = [];
      for (const feedback of demo.feedback) {
        if (feedback.tellMeMore || feedback.quickActions.length > 0) {
          allFeedback.push({
            id: feedback.id,
            claps: feedback.claps,
            comment: feedback.comment,
            rating: feedback.rating,
            tellMeMore: feedback.tellMeMore,
            quickActions: feedback.quickActions,
            attendee: {
              name: feedback.attendee?.name,
              email: feedback.attendee?.email,
              linkedin: feedback.attendee?.linkedin,
              type: feedback.attendee.type,
            },
          });
        } else {
          allFeedback.push({
            id: feedback.id,
            claps: feedback.claps,
            comment: feedback.comment,
            rating: feedback.rating,
          });
        }
      }
      return { ...demo, feedback: allFeedback };
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
    .query(async ({ input }): Promise<FeedbackAndAttendee[]> => {
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
        votable: z.boolean(),
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
            votable: input.votable,
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
  setDemos: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        demos: z.array(
          z.object({
            id: z.string().optional(),
            name: z.string(),
            description: z.string(),
            email: z.string(),
            url: z.string(),
            votable: z.boolean(),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      return db.$transaction(async (prisma) => {
        await prisma.demo.deleteMany({
          where: { eventId: input.eventId },
        });
        await prisma.demo.createMany({
          data: input.demos.map((demo, index) => ({
            ...demo,
            eventId: input.eventId,
            index,
          })),
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
