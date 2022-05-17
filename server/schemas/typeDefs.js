const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    email: String!
    bookCount: Int
    savedBooks: [Book]

    # This is a method provided by mongoose.js
    # See https://mongoosejs.com/docs/api/model.html#model_Model.save
  }

  type Book {
    bookId: ID!
    title: String!
    description: String
    image: String
    link: String
    authors: [String]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput): User
    removeBook(bookId: ID!): User
  }

  input BookInput {
    bookId: String!
    title: String!
    description: String!
    image: String
    link: String
    authors: [String]
  }
`;

module.exports = typeDefs;
