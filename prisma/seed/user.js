const bcrypt = require("bcryptjs");

const { prisma } = require("../../src/generated/prisma-client");

const { EMAIL, PASSWORD } = process.env;

const user = {
  email: EMAIL,
  password: PASSWORD,
  name: "Ashik"
};
const createUser = async () => {
  const alreadyExists = await prisma.$exists.user({ email: user.email });
  if (!alreadyExists) {
    return prisma.createUser({
      ...user,
      password: await bcrypt.hash(user.password, 10),
      emailVerified: true
    });
  }
};

module.exports = {createUser}