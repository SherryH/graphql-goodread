// schema: define the shape of the data returned by the query

// not sure why we are fetching the goodreads info into schema, just follow video first
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLList
} = require("graphql");
const fetch = require("node-fetch");
const util = require("util");
const fs = require("fs");
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

const BookType = new GraphQLObjectType({
  name: "BookType",
  fields: () => ({
    //get title
    //isbn
    //authors
    title: {
      type: GraphQLString,
      resolve: json => {
        console.log("Booktype title", JSON.stringify(json));
        return json.title[0];
      }
    },
    isbn: {
      type: GraphQLString
    },
    authors: {
      type: GraphQLString
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "AuthorType",
  fields: () => ({
    name: {
      type: GraphQLString,
      resolve: json => {
        return json.GoodreadsResponse.author[0].name[0];
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve: json => {
        fs.writeFileSync(
          "GoodRead.json",
          JSON.stringify(json.GoodreadsResponse.author[0].books[0].book)
        );
        return json.GoodreadsResponse.author[0].books[0].book;
      }
    }
  })
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "authorQuery",
    fields: () => ({
      //fields can be function or object
      author: {
        type: AuthorType, //authorType has a name field
        args: {
          //input to query authorQuery(id:1234)
          id: {
            type: GraphQLInt
          }
        },
        resolve: (root, args) => {
          return fetch(
            `https://www.goodreads.com/author/show.xml?id=${
              args.id
            }&key=${GOODREADS_API_KEY}`
          )
            .then(res => res.text())
            .then(xml => parseString(xml)); // the output needs to match the AuthorType
        } //returns the output of the goodread author json data
      }
    })
  })
});

module.exports = schema;
