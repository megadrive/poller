import { createProtectedRouter } from "./protected-router";

// Example router with queries that can only be hit if the user requesting is signed in
export const protectedExampleRouter = createProtectedRouter().query(
  "get-session",
  {
    resolve({ ctx }) {
      return ctx.session;
    },
  }
);
