const { AuthenticationError } = require("apollo-server-express");
// const { saveBook } = require("../../client/src/utils/API");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("You must be logged in");
      }
      const userData = await User.findOne({ _id: context.user._id }).select(
        "-__v -password"
      );
      return userData;
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return {
        token,
        user,
      };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Invalid credentials");
      }
      // check if password is correct - changed to isCorrectPassword
      const isValid = await user.isCorrectPassword(password);
      if (!isValid) {
        throw new AuthenticationError("Invalid credentials");
      }
      const token = signToken(user);
      return {
        token,
        user,
      };
    },
    saveBook: async (parent, { bookData }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You must be logged in");
      }
      const updatedUser = await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $push: { savedBooks: bookData } },
        { new: true }
      );
      return updatedUser;
    },
    removeBook: async (parent, { bookId }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You must be logged in");
      }
      const updatedUser = await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
      return updatedUser;
    },
  },
};

module.exports = resolvers;
