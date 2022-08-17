import { createRouter } from "./context";
import { string, z } from "zod";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";

export const pollRouter = createRouter()
  .mutation("create-poll", {
    input: z.object({
      title: z.string(),
      choice1: z.string(),
      choice2: z.string(),
      expires: z.date().optional(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.poll.create({
        data: {
          id: nanoid(),
          userId: ctx.session?.user?.id,
          title: input.title,
          expires: input.expires ?? new Date(Date.now() + 1000 * 60 * 60 * 24),
          choices: {
            createMany: {
              data: [
                {
                  text: input.choice1,
                },
                {
                  text: input.choice2,
                },
              ],
            },
          },
        },
      });
    },
  })
  .query("get-poll", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const id = input?.id;
      const poll = await ctx.prisma.poll.findFirst({
        where: {
          id,
        },
        include: {
          responses: true,
          choices: true,
        },
      });

      if (!poll) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Poll cannot be found.",
        });
      }

      const collatedResponses = poll.responses.reduce<Record<string, number>>(
        (acc, curr) => {
          acc[curr.choiceId]++;
          return acc;
        },
        poll.choices.reduce<Record<string, number>>((acc, curr) => {
          acc[curr.id] = 0;
          return acc;
        }, {})
      );

      return {
        ...poll,
        responses: collatedResponses,
      };
    },
  })
  .mutation("set-vote", {
    input: z.object({
      pollId: z.string(),
      choiceId: z.string(),
    }),
    async resolve({ ctx, input }) {
      return null;
    },
  })
  .middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        ...ctx,
        // infers that `session` is non-nullable to downstream resolvers
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  })
  .query("get-users-polls", {
    async resolve({ ctx }) {
      return await ctx.prisma.poll.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });
    },
  });
