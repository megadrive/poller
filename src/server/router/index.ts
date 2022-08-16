// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { protectedExampleRouter } from "./protected-example-router";
import { pollRouter } from "./poll";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("poll.", pollRouter)
  .merge("session.", protectedExampleRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
