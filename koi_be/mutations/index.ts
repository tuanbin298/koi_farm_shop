import { mergeSchemas } from "@graphql-tools/schema";
import { createSuccessConsignmentSaleEmail } from "./mail";
import { createSuccessLoginEmail } from "./mail";
// import createInvoice from "./createInvoice.mutation";

export const extendGraphqlSchema = (schema: any) =>
  mergeSchemas({
    schemas: [schema],
    // Define param and type of param
    typeDefs: `
        type Mutation {
            createInvoice(
                items: [OrderItemCreateInput!]!
                user: String!
                price: Int!
                address: String!
            ) : Order
            createSuccessConsignmentSaleEmail(
              to: String!
              consignmentId: String!
            ) : String
            createSuccessLoginEmail(
              to: String!
              userId: String!
            ) : String
        }
    `,

    //  Function receive param and export mutation
    resolvers: {
      Mutation: {
        // createInvoice,
        createSuccessConsignmentSaleEmail,
        createSuccessLoginEmail,
      },
    },
  });
