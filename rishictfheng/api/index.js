const express = require("express");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const path = require('path');
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();
const port = process.env.PORT || 3000;
// Set EJS as the templating engine
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

// Define GraphQL Schema
const schema = buildSchema(`
  type Query {
    placeholder: String
  }

  type Mutation {
    processInput(input: String!): String
  }
`);

// Define Resolvers
const root = {
    processInput: ({ input }) => {
        if(input=='ERROR'){
            return `Congratulations! You've unlocked the next level.`;
        }else{
            return input;
        }
    }
};

// GraphQL Middleware
app.use(
  "/api/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Enables GraphiQL UI for testing queries
  })
);

// Set the directory where EJS files will be stored
app.set("views", path.join(__dirname, "../views"));

app.get("/", (req, res) => {
    res.render("rishi"); // This will render the rishi.ejs file from the "views" directory
  });

// Export the app for Vercel
module.exports = app;

// Only listen directly if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
        console.log(`GraphQL playground available at http://localhost:${port}/graphql`);
    });
}