const fragment = require("./fragment");
const { loginChecker } = require("../common");

const query = {
  async comments(parernt, args, ctx) {
    await loginChecker(ctx);

    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after
    }

    const comments = await ctx.prisma.comments(opArgs).$fragment(fragment);
    return comments;
  },

  async comment(parent, args, ctx) {
    const user = await loginChecker(ctx);
    if (!user) {
      throw new Error("Not Authorized");
    }
    const comment = await ctx.prisma
      .comment({ id: args.id })
      .$fragment(fragment);
    return comment;
  }
};

module.exports = query;
