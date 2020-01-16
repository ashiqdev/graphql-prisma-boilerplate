const fragment = require("./fragment");
const { loginChecker } = require("../common");

const query = {
  async posts(parent, args, ctx) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      where: {
        published: true
      }
    };

    if (args.query) {
      opArgs.where.OR = [
        { title_contains: args.query },
        { body_contains: args.query }
      ];
    }

    const posts = await ctx.prisma.posts(opArgs).$fragment(fragment);
    return posts;
  },

  async myPosts(parent, args, ctx) {
    const user = await loginChecker(ctx);
    const opArgs = {
      where: { author: { id: user.id } },
      first: args.first,
      skip: args.skip,
      after: args.after
    };
    if (opArgs.query) {
      opArgs.where.OR = [
        { title_contains: args.query },
        { body_contains: args.query }
      ];
    }
    return ctx.prisma.posts(opArgs).$fragment(fragment);
  },

  async post(parent, args, ctx) {
    const user = await loginChecker(ctx, false);
    // user is the author of the post
    // OR
    // post is published
    const posts = await ctx.prisma.posts({
      where: {
        id: args.id,
        OR: [{ published: true }, { author: { id: user && user.id } }]
      }
    });

    console.log(posts);

    if (posts.length === 0) {
      throw new Error("No Post found");
    }
    return posts[0];
  }
};

module.exports = query;
