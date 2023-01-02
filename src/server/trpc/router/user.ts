import { z } from 'zod';

import { router, publicProcedure } from '../trpc';

export const userRouter = router({
  setDisplayName: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const registeredNames = await ctx.prisma.user.findMany({
        select: { displayName: true },
      });
      const filteredNames = registeredNames.map((name) => {
        return name.displayName;
      });
      if (filteredNames.includes(input)) {
        return;
      }
      const enteredName = await ctx.prisma.user.create({
        data: { displayName: input },
      });
      return enteredName;
    }),
  getAllDisplayNames: publicProcedure.query(async ({ ctx }) => {
    const registeredNames = await ctx.prisma.user.findMany({
      select: { displayName: true },
    });
    const filteredNames = registeredNames.map((name) => {
      return name.displayName;
    });
    return await filteredNames;
  }),
});
