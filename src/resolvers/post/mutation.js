const mutations = {
  async createPost(parent, args, ctx) {
    const post = await ctx.prisma.createPost({
      title: args.title,
      body: args.body,
      published: args.published
    });
    return post;
  }
};

module.exports = mutations;
