const query = {
  async post(parent, args, ctx) {
    const post = await ctx.prisma.post({ id: args.id });
    return post;
  }
};

module.exports = query;
