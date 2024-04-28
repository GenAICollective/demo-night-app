import { eventRouter } from "~/server/api/routers/event";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

import { awardRouter } from "./routers/award";
import { demoRouter } from "./routers/demo";
import { feedbackRouter } from "./routers/feedback";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  event: eventRouter,
  demo: demoRouter,
  award: awardRouter,
  feedback: feedbackRouter,
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
