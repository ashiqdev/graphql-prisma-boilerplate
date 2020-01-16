const fragment = require("./fragment");
const { loginChecker } = require("../common");

const mutation = {
  async createComment(parent, args, ctx) {
    const user = await loginChecker(ctx);

    const postExists = await ctx.prisma.$exists.post({
      id: args.postId,
      published: true
    });

    if (!postExists) {
      throw new Error("Post is not published yet");
    }

    const comment = await ctx.prisma
      .createComment({
        text: args.text,
        author: {
          connect: {
            id: user.id
          }
        },
        post: {
          connect: {
            id: args.postId
          }
        }
      })
      .$fragment(fragment);
    return comment;
  },

  async updateComment(parent, args, ctx) {
    const user = await loginChecker(ctx);

    const isOwner = await ctx.prisma.$exists.comment({
      id: args.id,
      author: { id: user.id }
    });

    if (!isOwner) {
      throw new Error("You are not allowed to delete this post");
    }

    return ctx.prisma
      .updateComment({
        where: { id: args.id },
        data: {
          text: args.text
        }
      })
      .$fragment(fragment);
  },

  async deleteComment(parent, args, ctx) {
    const user = await loginChecker(ctx);

    const isOwner = await ctx.prisma.$exists.comment({
      id: args.id,
      author: { id: user.id }
    });

    if (!isOwner) {
      throw new Error("You are not allowed to delete this post");
    }

    return ctx.prisma.deleteComment({ id: args.id }).$fragment(fragment);
  }
};

module.exports = mutation;
