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
  currentAwardIndex: number | null;
};

function getCurrentEvent(): Promise<CurrentEvent | null> {
  return kv.get("currentEvent");
}

function updateCurrentEvent(event: Event) {
  const currentEvent: CurrentEvent = {
    id: event.id,
    name: event.name,
    phase: event.phase,
    currentDemoId: event.currentDemoId,
    currentAwardIndex: event.currentAwardIndex,
  };
  return kv.set("currentEvent", currentEvent);
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
  upsert: protectedProcedure
    .input(
      z.object({
        originalId: z.string().optional(),
        id: z.string().optional(),
        name: z.string(),
        date: z.string().datetime(),
        url: z.string().url(),
      }),
    )
    .mutation(async ({ input }) => {
      if (input.originalId) {
        return db.event.update({
          where: { id: input.originalId },
          data: {
            id: input.id,
            name: input.name,
            date: new Date(input.date),
            url: input.url,
          },
        });
      }
      return db.event.create({
        data: { ...input },
      });
    }),
  all: protectedProcedure.query(() => {
    return db.event.findMany({
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
        attendees: { orderBy: { name: "asc" } },
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
  removeCurrent: protectedProcedure.mutation(async () => {
    return db.event
      .updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false },
      })
      .then(() => kv.del("currentEvent"));
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
    .input(z.object({ id: z.string(), demoId: z.string().nullable() }))
    .mutation(async ({ input }) => {
      return db.event
        .update({
          where: { id: input.id },
          data: { currentDemoId: input.demoId },
        })
        .then(updateCurrentEvent);
    }),
  updateCurrentAwardIndex: protectedProcedure
    .input(z.object({ id: z.string(), index: z.number().nullable() }))
    .mutation(async ({ input }) => {
      return db.event
        .update({
          where: { id: input.id },
          data: { currentAwardIndex: input.index },
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
