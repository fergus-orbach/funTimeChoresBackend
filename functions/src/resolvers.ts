import { firestore } from "firebase-admin";
import { collections } from "./db";
import Firestore = firestore.Firestore;

const verifyUser = (userId: string | undefined) => {
  if(!userId) {
    throw new Error('not authenticated')
  }
}

const fetchAllFrom = async (collection: string, db: Firestore) => {
  try {
    const collectionSnapshot = await db.collection(collection).get()
    return collectionSnapshot.docs.map(document => ({
      id: document.id,
      ...document.data()
    }));
  } catch (e) {
    console.log(e)
    throw e
  }
}

const queriesWithDb = (db: Firestore) => ({
  messages: async () => {
    return await fetchAllFrom('messages', db)
  },
  chores: async () => {
    return await fetchAllFrom(collections.chores, db)
  }
})

const mutationsWithDb = (db: Firestore) => ({
  newChore: async (_: any, { input }: any) => {
    const { id } = await db.collection(collections.chores).add(input)
    return {
      ...input,
      id
    }
  },
  registerUserDevice: async (_: any, { input }: any, { userId }: any) => {
    verifyUser(userId)

    await db.collection(collections.users).doc(userId).set({deviceToken: input.deviceToken}, {merge: true})

    return true
  },
  deregisterUserDevice: async (_: any, {}: any, { userId }: any) => {
    verifyUser(userId)

    await db.collection(collections.users).doc(userId).update({deviceToken: null})

    return true
  }
})

export const resolvers = (db: Firestore) => ({
  Query: queriesWithDb(db),
  Mutation: mutationsWithDb(db)
})
