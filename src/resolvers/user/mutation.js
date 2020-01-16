const bcrypt = require("bcryptjs");
const path = require("path");
const moment = require('moment');


const {sendEmailVerification} = require('../mail_templates/index');


const fragment = require("./fragment");
const { createHash, transport, signToken, loginChecker } = require("../common");
const { verifyEmailTemplate } = require("../mail_templates");
const { ADMIN_MAIL } = process.env;


const Mutation = {
  async signup(parent, args, ctx) {
    const emailTaken = await ctx.prisma.$exists.user({ email: args.email });
    if (emailTaken) {
      throw new Error("Email is already taken");
    }
    const password = await bcrypt.hash(args.password, 10);
    const data = { ...args };

    const emailToken = await createHash();
    const emailTokenExpiry = Date.now() + 3600000;

    const newUser = await ctx.prisma.createUser({
      ...data,
      password,
      emailToken,
      emailTokenExpiry
    });
    return sendEmailVerification(newUser);
  },

  async verifyEmail(parent, args, ctx) {
    const { emailToken, email } = args;
    const [user] = await ctx.prisma.users({
      where: {
        emailToken,
        emailTokenExpiry_gte: Date.now() - 3600000
      }
    });

    if (!user) {
      throw new Error("The link is either invalid or expired");
    }

    const verifiedUser = await ctx.prisma.updateUser({
      where: { id: user.id },
      data: {
        emailVerified: true,
        email: email || user.email,
        emailToken: "",
        emailTokenExpiry: Date.now()
      }
    });

    return {
      token: signToken(verifiedUser),
      user: verifiedUser
    };
  },

  async signin(parent, args, ctx) {
    const { email, password } = args;
    const user = await ctx.prisma.user({ email });
    if (!user) {
      throw new Error("No user found with this email");
    }


    if (!user.emailVerified) {
      throw new Error("You have to verify your email first");
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new Error("Invalid Password");
    }

    return {
      token: signToken(user),
      user
    };
  },

  async sendVerification(parent, args, ctx) {
    const emailToken = await createHash();
    const emailTokenExpiry = Date.now() + 3600000; // 1 hour from now

    await prisma.updateUser({
      where: { email: args.email },
      data: { emailToken, emailTokenExpiry }
    });

    return sendEmailVerification({ email: args.email, emailToken });
  },

  async updateUser(parent, args, ctx) {
    const user = await loginChecker(ctx);
    const data = { ...args };
    return ctx.prisma
      .updateUser({
        where: { id: user.id },
        data: data
      })
      .$fragment(fragment);
  },

  async deleteUser(parent, args, ctx) {
    await loginChecker(ctx);
    return ctx.prisma.deleteUser({ id: args.id }).$fragment(fragment);
  }
};

module.exports = Mutation;
