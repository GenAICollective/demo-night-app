import { type Event, EventPhase } from "@prisma/client";
import { kv } from "@vercel/kv";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

export type CurrentEvent = {
  id: string;
  name: string;
  phase: EventPhase;
  currentDemoId: string | null;
};

function getCurrentEvent(): Promise<CurrentEvent | null> {
  return kv.get("currentEvent");
}

function updateCurrentEvent(event: Event) {
  return kv.set("currentEvent", {
    id: event.id,
    name: event.name,
    phase: event.phase,
    currentDemoId: event.currentDemoId,
  });
}

export const eventRouter = createTRPCRouter({
  getCurrent: publicProcedure.query(() => getCurrentEvent()),
  get: publicProcedure.input(z.string()).query(async ({ input }) => {
    return db.event.findUnique({
      where: { id: input },
      include: {
        demos: { orderBy: { index: "asc" } },
        awards: { orderBy: { index: "asc" } },
      },
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
  getAdmin: protectedProcedure.input(z.string()).query(async ({ input }) => {
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
  updateCurrent: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return db
        .$transaction(async (prisma) => {
          await prisma.event.updateMany({
            where: { isCurrent: true },
            data: { isCurrent: false },
          });
          return prisma.event.update({
            where: { id: input },
            data: { isCurrent: true },
          });
        })
        .then(updateCurrentEvent);
    }),
  updatePhase: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        phase: z.enum(["PRE", "DEMO", "VOTING", "RESULTS"]),
      }),
    )
    .mutation(async ({ input }) => {
      return db.event
        .update({
          where: { id: input.id },
          data: { phase: EventPhase[input.phase] },
        })
        .then(updateCurrentEvent);
    }),
  updateCurrentDemo: protectedProcedure
    .input(z.object({ id: z.string(), demoId: z.string() }))
    .mutation(async ({ input }) => {
      return db.event
        .update({
          where: { id: input.id },
          data: { currentDemoId: input.demoId },
        })
        .then(updateCurrentEvent);
    }),
  delete: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    return db.event
      .delete({
        where: { id: input },
      })
      .then(async () => {
        const currentEvent = await getCurrentEvent();
        if (input === currentEvent?.id) {
          return kv.del("currentEvent");
        }
      });
  }),
});
