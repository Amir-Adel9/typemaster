import { z } from 'zod';

import { router, publicProcedure } from '../trpc';

import { uploadImage } from '../../../utils/cloudinary';

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
      select: {
        id: true,
        displayName: true,
        timesPlayed: true,
        imageURL: true,
        levelExp: true,
        wins: true,
        level: true,
      },
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
  increaseLevel: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.user.update({
        where: { id: input },
        data: { level: { increment: 1 } },
      });
    }),
  increaseLevelExp: publicProcedure
    .input(z.object({ id: z.string(), levelExp: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.user.update({
        where: { id: input.id },
        data: { levelExp: input.levelExp },
      });
    }),
  uploadImage: publicProcedure
    .input(z.object({ id: z.string(), imageBase64: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const imageData = await uploadImage(input.imageBase64);
      await ctx.prisma.user.update({
        where: { id: input.id },
        data: { imageURL: imageData.secure_url },
      });
    }),
});
