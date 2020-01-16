const fragment = require("./fragment");
const { loginChecker } = require("../common");


const Query = {
  async users(parent, args, ctx) {
    // await loginChecker(ctx);

    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    };

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query
          },
          {
            email_contains: args.query
          }
        ]
      };
    }
    const users = await ctx.prisma.users(opArgs).$fragment(fragment);
    return users;
  },

  async user(parent, args, ctx) {
    await loginChecker(ctx);

    return ctx.prisma.user({ id: args.id }).$fragment(fragment);

  }
};

module.exports = Query;
