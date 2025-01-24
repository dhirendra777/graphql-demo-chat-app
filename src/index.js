const typeDefs = require("./schema");
const resolvers = require("./resolvers");

const port = 4000;
const { createServer, createPubSub } = require("@graphql-yoga/node");
const pubsub = createPubSub();

const server = createServer({
  schema: {
    typeDefs,
    resolvers: resolvers,
  },
  context: {
    pubsub,
  },
});

server.start();
console.log(`Yo! server is up at http://localhost:${port}/graphql`);
