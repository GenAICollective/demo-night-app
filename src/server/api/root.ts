import { eventsRouter } from "~/server/api/routers/events";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

import { awardsRouter } from "./routers/awards";
import { demosRouter } from "./routers/demos";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  events: eventsRouter,
  demos: demosRouter,
  awards: awardsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
