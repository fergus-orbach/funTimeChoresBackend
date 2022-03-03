import { firestore } from "firebase-admin";
import Firestore = firestore.Firestore;

const fetchAllMessages = async (db: Firestore) => {
  try {
    const snapshot = await db.collection('messages').get()
    return snapshot.docs.map(document => document.data());
  } catch (e) {
    console.log(e)
    throw e
  }
}

const queriesWithDb = (db: Firestore) => ({
  messages: async () => {
    return await fetchAllMessages(db)
  }
})

export const resolvers = (db: Firestore) => ({
  Query: queriesWithDb(db)
})
