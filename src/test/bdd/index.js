const chai = require("chai");
const { expect } = require("chai");
chai.use(require("chai-as-promised"));

const dotenv = require("dotenv");
const path = require("path");
const envPath = path.resolve("./.env");

dotenv.config({ path: envPath });

chai.should();

const { signin } = require("../../resolvers/user/mutation");
const {
  prisma: { deleteManyUsers }
} = require("../../../src/generated/prisma-client");

// multiply array items by 2
const multiplyBy2 = numbers => numbers.map(number => number * 2);
const result = multiplyBy2([1, 2, 3, 4, 5]);

const numbers = [1, 2, 3, 4, 5];

const sum = numbers.reduce((a, c) => a + c);

describe("Test Authentication", () => {
  it("should sign in the user", () => {
    const args = {
      email: process.env.EMAIL,
      password: process.env.PASSWORD
    };

    return signin(null, args).should.be.fulfilled;
  });

  it("should be an array", () => {
    expect(["1", "2", "3", "4", "5"])
      .to.be.an("array")
      .that.includes("2");
  });

  it("should multiply array items by 2", () => {
    expect(result).to.eql([2, 4, 6, 8, 10]);
  });

  it("should return the sum of all items of the array", () => {
    expect(sum).to.equal(15);
  });

  after(async () => {
    await deleteManyUsers();
  });
});
