import * as admin from "firebase-admin";

export const collections = {
  users: "users",
  chores: "chores",
};

export const newDb = () => admin.firestore();
