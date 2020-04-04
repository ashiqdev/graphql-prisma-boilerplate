const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect, should } = require("chai");
chai.use(require("chai-as-promised"));

chai.use(chaiHttp);

const dotenv = require("dotenv");
const path = require("path");
const envPath = path.resolve("./.env");

dotenv.config({ path: envPath });

// chai.should();

const { signin } = require("../../resolvers/user/mutation");
const {
  prisma: { deleteManyUsers }
} = require("../../../src/generated/prisma-client");

// multiply array items by 2
const multiplyBy2 = numbers => numbers.map(number => number * 2);
const result = multiplyBy2([1, 2, 3, 4, 5]);

describe("Test Authentication", () => {
  // it("should sign in the user", () => {
  //   const args = {
  //     email: process.env.EMAIL,
  //     password: process.env.PASSWORD
  //   };

  //   return signin(null, args).should.be.fulfilled;
  // });

  it("check if prisma server is open or not", done => {
    chai
      .request("http://localhost:4466")
      .get("/")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("should be an array", () => {
    expect(["1", "2", "3", "4", "5"])
      .to.be.an("array")
      .that.includes("2");
  });

  it("should multiply array items by 2", () => {
    expect(result).to.eql([2, 4, 6, 8, 10]);
  });

  // after(async () => {
  //   await deleteManyUsers();
  // });
});
