import { EventPhase } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

export const eventRouter = createTRPCRouter({
  all: protectedProcedure.query(() => {
    return db.event.findMany({
      select: {
        id: true,
        name: true,
        date: true,
        isCurrent: true,
      },
      orderBy: { date: "desc" },
    });
  }),
  getCurrent: publicProcedure.query(() => {
    return db.event.findFirst({
      where: { isCurrent: true },
    });
  }),
  get: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return db.event.findUnique({
      where: {
        id: input,
      },
      include: {
        demos: { orderBy: { index: "asc" } },
        attendees: true,
        awards: { orderBy: { index: "asc" } },
      },
    });
  }),
  makeCurrent: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return db.$transaction(async (prisma) => {
        await prisma.event.updateMany({
          where: { isCurrent: true },
          data: { isCurrent: false },
        });
        return prisma.event.update({
          where: { id: input },
          data: { isCurrent: true },
        });
      });
    }),
  updatePhase: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        phase: z.enum(["PRE", "DEMO", "VOTING", "RESULTS"]),
      }),
    )
    .mutation(async ({ input }) => {
      return db.event.update({
        where: { id: input.id },
        data: { phase: EventPhase[input.phase] },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        date: z.string().datetime(),
        url: z.string().url(),
      }),
    )
    .mutation(async ({ input }) => {
      return db.event.create({
        data: {
          name: input.name,
          date: input.date,
          url: input.url,
        },
      });
    }),
  delete: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    return db.event.delete({
      where: { id: input },
    });
  }),
});
