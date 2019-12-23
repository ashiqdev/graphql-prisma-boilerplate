const { GraphQLServer } = require("graphql-yoga");

const resolvers = require("../resolvers");
const { prisma } = require("../generated/prisma-client");

function createServer() {
  return new GraphQLServer({
    typeDefs: "src/schema.graphql",
    resolvers: resolvers,
    resolverValidationOptions: {
      requireResolversForResolveType: false
    },
    context: req => ({ ...req, prisma })
  });
}

module.exports = createServer;
