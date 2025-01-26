import {
  type Award,
  type Demo,
  type Event,
  type EventFeedback,
  type Prisma,
} from "@prisma/client";
import { z } from "zod";

import {
  DEFAULT_AWARDS,
  DEFAULT_DEMOS,
  DEFAULT_PARTNERS,
} from "~/lib/defaults";
import * as kv from "~/lib/types/currentEvent";
import { partnersSchema } from "~/lib/types/partner";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

import { type AdminEvent } from "~/app/admin/[eventId]/contexts/DashboardContext";

export type CompleteEvent = Event & {
  demos: PublicDemo[];
  awards: Award[];
  eventFeedback: EventFeedback[];
};

export type PublicDemo = Omit<
  Demo,
  "eventId" | "secret" | "createdAt" | "updatedAt"
>;

export const eventRouter = createTRPCRouter({
  all: publicProcedure
    .input(
      z
        .object({
          limit: z.number().optional(),
          offset: z.number().optional(),
        })
        .optional(),
    )
    .query(async ({ input }): Promise<CompleteEvent[]> => {
      return db.event.findMany({
        where: { date: { lte: new Date() } },
        select: completeEventSelect,
        orderBy: { date: "desc" },
        take: input?.limit,
        skip: input?.offset,
      });
    }),
  getCurrent: publicProcedure.query(() => kv.getCurrentEvent()),
  get: publicProcedure
    .input(z.string())
    .query(async ({ input }): Promise<CompleteEvent | null> => {
      return db.event.findUnique({
        where: { id: input },
        select: completeEventSelect,
      });
    }),
  upsert: protectedProcedure
    .input(
      z.object({
        originalId: z.string().optional(),
        id: z.string().optional(),
        name: z.string().optional(),
        date: z.date().optional(),
        url: z.string().url().optional(),
        partners: partnersSchema.optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const data = {
        id: input.id,
        name: input.name,
        date: input.date,
        url: input.url,
        partners: input.partners,
      };

      if (input.originalId) {
        return db.event
          .update({
            where: { id: input.originalId },
            data,
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
        data: {
          id: data.id!,
          name: data.name!,
          date: data.date!,
          url: data.url!,
          partners: data.partners ?? DEFAULT_PARTNERS,
          demos: {
            create: DEFAULT_DEMOS,
          },
          awards: {
            create: DEFAULT_AWARDS,
          },
        },
      });
    }),
  allAdmin: protectedProcedure.query(() => {
    return db.event.findMany({
      orderBy: { date: "desc" },
    });
  }),
  getAdmin: protectedProcedure
    .input(z.string())
    .query(async ({ input }): Promise<AdminEvent | null> => {
      return db.event.findUnique({
        where: { id: input },
        include: {
          demos: { orderBy: { index: "asc" } },
          attendees: { orderBy: { name: "asc" } },
          awards: { orderBy: { index: "asc" } },
          eventFeedback: { orderBy: { createdAt: "desc" } },
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

const completeEventSelect: Prisma.EventSelect = {
  id: true,
  name: true,
  date: true,
  url: true,
  partners: true,
  demos: {
    orderBy: { index: "asc" },
    select: {
      id: true,
      index: true,
      name: true,
      description: true,
      email: true,
      url: true,
    },
  },
  awards: { orderBy: { index: "asc" } },
};
