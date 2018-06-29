// schema: define the shape of the data returned by the query

// not sure why we are fetching the goodreads info into schema, just follow video first
const fetch = require("node-fetch");
const GOODREADS_API_KEY = require("./.config.js");
console.log("api key", GOODREADS_API_KEY);
// https://www.goodreads.com/api/index#author.show
// get info about an author by id
fetch(
  `https://www.goodreads.com/author/show.xml?id=4432&key=${GOODREADS_API_KEY}`,
  () => {}
);
