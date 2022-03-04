import {ApolloServer} from "apollo-server-express";
import express from "express";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {newDb} from "./db";
import {resolvers} from "./resolvers";
import "graphql-import-node";
import * as schema from "../schema.graphql";

admin.initializeApp();
const db = newDb();
const app = express();


const getIdToken = (headers: any): (string | null) => {
  if (headers.authorization) {
    const [identifier, token] = headers.authorization.split(" ");
    if (identifier === "Bearer") {
      return token;
    }
  }

  return null;
};

const context = async ({req}: any) => {
  const idToken = getIdToken(req.headers);
  if (idToken) {
    try {
      const {uid} = await admin.auth().verifyIdToken(idToken);
      return {userId: uid};
    } catch (error) {
      console.log(`error: ${error}`);
      return {};
    }
  }

  return {};
};

const server = new ApolloServer({typeDefs: schema, resolvers: resolvers(db), context});
server.start().then(() =>
  server.applyMiddleware({app, path: "/"})
);

export const graphql = functions
    .region("asia-southeast2")
    .https
    .onRequest(app);
