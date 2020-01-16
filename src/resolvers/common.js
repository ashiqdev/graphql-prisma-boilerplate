const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const nodemailer = require("nodemailer");

const { prisma } = require("../generated/prisma-client");

const { APP_SECRET, MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS } = process.env;

const jwtValidator = token => jwt.verify(token, APP_SECRET);

function signToken({ id, name, email }) {
  return jwt.sign(
    {
      id,
      name,
      email
    },
    APP_SECRET
  );
}

async function loginChecker({ request }, requireAuth=true) {
  const Authorization = request.get("Authorization");
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const userInJwt = jwtValidator(token);
    const user = await prisma.user({ id: userInJwt.id });
    if (!user) {
      throw new Error("Not Authorized");

    }
    return user;
  }
  if(requireAuth) {
    throw new Error('Not Authorized');
  }
  return null;
}

// async function hasPermission(user, target, args) {
//   const isOwner = await prisma.$exists.target({
//     id: args.id,
//     author: {
//       id: user.id
//     }
//   });

//   if (!isOwner) {
//     throw new Error("You are not allowed to update this post");
//   }
//   return isOwner;
// }

async function createHash() {
  const randomBytesPromise = promisify(randomBytes);
  const hash = (await randomBytes(20)).toString("hex");
  return hash;
}

const transport = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS
  }
});

// const transport = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "ashikduit@gmail.com",
//     pass: "ashikJS1"
//   }
// });

module.exports = {
  signToken,
  loginChecker,
  createHash,
  transport
};
