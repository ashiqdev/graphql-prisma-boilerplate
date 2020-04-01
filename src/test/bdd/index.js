const chai = require("chai");
const { expect } = require("chai");
chai.use(require("chai-as-promised"));

const dotenv = require("dotenv");
const path = require("path");
const envPath = path.resolve("./.env");

dotenv.config({ path: envPath });

chai.should();

const { signin, signup } = require("../../resolvers/user/mutation");
const {
  prisma: { deleteManyUsers }
} = require("../../../src/generated/prisma-client");

// multiply array items by 2
const multiplyBy2 = numbers => numbers.map(number => number * 2);
const result = multiplyBy2([1, 2, 3, 4, 5]);

const numbers = [1, 2, 3, 4, 5];

const sum = numbers.reduce((a, c) => a + c);

describe("Test Authentication", () => {
  it("should sign up the user", () => {
    const signUpargs = {
      name: "Naimur Rahman",
      email: "test@test.com",
      password: "123456"
    };

    return signup(null, signUpargs).should.be.fulfilled;
  });

  it("should sign in the user", () => {
    const signInargs = {
      email: "test@test.com",
      password: "123456"
    };

    return signin(null, signInargs).should.be.fulfilled;
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
