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
        return (
          name.displayName.charAt(0).toUpperCase() + name.displayName.slice(1)
        );
      });
      if (
        filteredNames.includes(input.charAt(0).toUpperCase() + input.slice(1))
      ) {
        return;
      }
      const enteredName = await ctx.prisma.user.create({
        data: { displayName: input.charAt(0).toUpperCase() + input.slice(1) },
      });
      console.log(input.charAt(0).toUpperCase() + input.slice(1));
      return enteredName;
    }),
  getAllDisplayNames: publicProcedure.query(async ({ ctx }) => {
    const registeredNames = await ctx.prisma.user.findMany({
      select: { displayName: true },
    });
    const filteredNames = registeredNames.map((name) => {
      return (
        name.displayName.charAt(0).toUpperCase() + name.displayName.slice(1)
      );
    });
    return filteredNames;
  }),
  getAllUsersData: publicProcedure.query(async ({ ctx }) => {
    const usersData = await ctx.prisma.user.findMany({
      select: { id: true, displayName: true, timesPlayed: true, wins: true },
    });
    return usersData;
  }),
  increaseTimesPlayed: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.user.update({
        where: { id: input },
        data: { timesPlayed: { increment: 1 } },
      });
    }),
  increaseWins: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.user.update({
        where: { id: input },
        data: { wins: { increment: 1 } },
      });
    }),
});
