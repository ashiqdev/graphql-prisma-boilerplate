const postMutation = require("./post/mutation");
const postQuery = require("./post/query");

const resolvers = {
  Mutation: {
    ...postMutation
  },

  Query: {
    ...postQuery
  }
};

module.exports = resolvers;
