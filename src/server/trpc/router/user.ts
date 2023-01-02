import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const userRouter = router({
  setDisplayName: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const name = await ctx.prisma.user.create({
        data: { displayName: input },
      });
      return name;
    }),
  getAllDisplayNames: publicProcedure.query(async ({ ctx }) => {
    const names = await ctx.prisma.user.findMany({
      select: { displayName: true },
    });
    const filteredNames = names.map((name) => {
      return name.displayName;
    });
    return await filteredNames;
  }),
});
