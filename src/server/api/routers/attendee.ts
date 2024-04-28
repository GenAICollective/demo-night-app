import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

export const attendeeRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string(), eventId: z.string() }))
    .query(async ({ input }) => {
      const attendee = await db.attendee.findUnique({
        where: { id: input.id },
        include: { events: { select: { id: true } } },
      });
      if (!attendee) {
        return db.attendee.create({
          data: {
            id: input.id,
            events: { connect: { id: input.eventId } },
          },
        });
      }
      if (!attendee.events.some((event) => event.id === input.eventId)) {
        return db.attendee.update({
          where: { id: input.id },
          data: { events: { connect: { id: input.eventId } } },
        });
      }
      return attendee;
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string().nullable(),
        type: z.string().nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      return db.attendee.update({
        where: { id: input.id },
        data: { name: input.name, email: input.email, type: input.type },
      });
    }),
  delete: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    return db.attendee.delete({ where: { id: input } });
  }),
});
