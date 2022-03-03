import { ApolloServer } from 'apollo-server-express';
const express = require("express");
import * as admin from 'firebase-admin';
import * as functions from "firebase-functions";
import { resolvers } from "./resolvers";
import { typeDefs } from "./schema";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

admin.initializeApp()
const db = admin.firestore()
const app = express();


const server = new ApolloServer({typeDefs, resolvers: resolvers(db)});
server.start().then(res =>
  server.applyMiddleware({app, path: '/'})
)

export const graphql = functions
  .region('asia-southeast2')
  .https
  .onRequest(app);
