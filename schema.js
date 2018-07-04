// schema: define the shape of the data returned by the query

// not sure why we are fetching the goodreads info into schema, just follow video first
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt
} = require("graphql");
const fetch = require("node-fetch");
const util = require("util");
const GOODREADS_API_KEY = require("./.config.js").GOODREADS_API_KEY;
var parseString = util.promisify(require("xml2js").parseString);

console.log("api key", GOODREADS_API_KEY);
// https://www.goodreads.com/api/index#author.show
// get info about an author by id
// fetch(
//   `https://www.goodreads.com/author/show.xml?id=4432&key=${GOODREADS_API_KEY}`
// )
//   .then(res => res.text())
//   .then(xml => {
//     return parseString(xml);
//   })
//   .then(json => console.log(JSON.stringify(json)));

const AuthorType = new GraphQLObjectType({
  name: "AuthorType",
  fields: () => ({
    name: GraphQLString
  })
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "authorQuery",
    fields: () => ({
      //fields can be function or object
      author: {
        type: AuthorType, //authorType has a name field
        args: { //input to query authorQuery(id:1234)
          id: {
            type: GraphQLInt 
          }
        },
        resolver: ()=>() //returns the output of the goodread author json data
      }
    })
  })
});

module.exports = schema;
