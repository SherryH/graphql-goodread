const express = require("express");
const graphqlHTTP = require("express-graphql"); //GraphQL HTTP Server Middleware
const { buildSchema } = require("graphql");
const app = express();

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
    pretty: true,
    formatError: error => ({
      message: error.message,
      locations: error.locations,
      stack: error.stack ? error.stack.split("\n") : [],
      path: error.path
    })
  })
);

app.listen("4000");
console.log("listening...");
