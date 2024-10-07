import { mergeSchemas } from "@graphql-tools/schema";
// import createInvoice from "./createInvoice.mutation";

export const extendGraphqlSchema = (schema: any) =>
  mergeSchemas({
    schemas: [schema],
    // Type of data
    typeDefs: `
        type Mutation {
            createInvoice(
                items: [OrderItemCreateInput!]!
                user: String!
                price: Int!
                address: String!
            ) : Order
        }
    `,
    // Place to receive request order from customer
    resolvers: {
      Mutation: {
        // createInvoice,
      },
    },
  });
