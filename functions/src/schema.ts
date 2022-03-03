import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Message {
    from: String
    text: String
  }
  type Query {
    messages : [Message]
  }
`
