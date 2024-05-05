import { type Event } from "@prisma/client";
import { z } from "zod";

import * as kv from "~/lib/currentEvent";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

export const eventRouter = createTRPCRouter({
  getCurrent: publicProcedure.query(() => kv.getCurrentEvent()),
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
        return db.event
          .update({
            where: { id: input.originalId },
            data: {
              id: input.id,
              name: input.name,
              date: new Date(input.date),
              url: input.url,
            },
          })
          .then(async (res: Event) => {
            const currentEvent = await kv.getCurrentEvent();
            if (currentEvent?.id === input.originalId) {
              kv.updateCurrentEvent(res);
            }
            return res;
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
    .input(z.string().nullable())
    .mutation(async ({ input }) => {
      if (!input) {
        return kv.updateCurrentEvent(null);
      }
      const event = await db.event.findUnique({
        where: { id: input },
      });
      if (!event) {
        throw new Error("Event not found");
      }
      return kv.updateCurrentEvent(event);
    }),
  updateCurrentState: protectedProcedure
    .input(
      z.object({
        phase: z.nativeEnum(kv.EventPhase).optional(),
        currentDemoId: z.string().optional().nullable(),
        currentAwardId: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      return kv.updateCurrentEventState(input);
    }),
  delete: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    return db.event
      .delete({
        where: { id: input },
      })
      .then(async () => {
        const currentEvent = await kv.getCurrentEvent();
        if (input === currentEvent?.id) {
          return kv.updateCurrentEvent(null);
        }
      });
  }),
});
