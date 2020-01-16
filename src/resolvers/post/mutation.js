const fragment = require("./fragment");
const { loginChecker } = require("../common");

const mutations = {
  async createPost(parent, args, ctx) {
    const user = await loginChecker(ctx);
    const post = await ctx.prisma
      .createPost({
        title: args.title,
        body: args.body,
        published: args.published,
        author: {
          // create: {
          //   name: "test",
          //   email: "test@gmail.com"
          // },
          connect: {
            id: user.id
          }
        }
      })
      .$fragment(fragment);
    return post;
  },

  async deletePost(parent, args, ctx) {
    const user = await loginChecker(ctx);

    const isOwner = await ctx.prisma.$exists.post({
      id: args.id,
      author: { id: user.id }
    });
    if (!isOwner) {
      throw new Error("You are not allowed to delete this post");
    }
    const post = await ctx.prisma.post({ id: args.id });
    if (!post) {
      throw new Error("Post not found");
    }
    return ctx.prisma.deletePost({ id: args.id });
  },

  async updatePost(parent, args, ctx) {
    const user = await loginChecker(ctx);

    const isOwner = await ctx.prisma.$exists.post({
      id: args.id,
      author: { id: user.id }
    });
    if (!isOwner) {
      throw new Error("You are not allowed to update this post or post doesn't exist");
    }

    const isPublished = await ctx.prisma.$exists.post({
      id: args.id,
      published: true
    });

    if (isPublished && args.published === false) {
      await ctx.prisma.deleteManyComments({post: {id: args.id}});
    }

    const data = { ...args };
    delete data.id;
    console.log(data);
    return ctx.prisma
      .updatePost({
        where: { id: args.id },
        data: data
      })
      .$fragment(fragment);
  }
};

module.exports = mutations;
