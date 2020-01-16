const { GraphQLServer, PubSub } = require("graphql-yoga");

const resolvers = require("../resolvers");
const { prisma } = require("../generated/prisma-client");

const pubsub = new PubSub();

function createServer() {
  return new GraphQLServer({
    typeDefs: "src/schema.graphql",
    resolvers: resolvers,
    resolverValidationOptions: {
      requireResolversForResolveType: false
    },
    context: req => ({ ...req, prisma, pubsub })
  });
}

module.exports = createServer;
