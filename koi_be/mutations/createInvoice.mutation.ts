// import { type OrderItemCreateInput } from ".keystone/types";
// import { KeystoneContext } from "@keystone-6/core/types";
// import { Session } from "../auth/access";

// interface Arguments {
//   items: [OrderItemCreateInput];
//   user: string;
//   price: number;
//   address: string;
// }

// async function createInvoice(
//   root: any,
//   { items, user, price, address }: Arguments,
//   context: KeystoneContext
// ): Promise<OrderItemCreateInput> {
//   //Check session of user
//   const sesh = context.session as Session;
//   if (!sesh.itemId) {
//     throw new Error("You must be logged in to do this !");
//   }

//   const orderItems = items.map((invoiceItem: any) => {
//     const orderItem = {
//       product: invoiceItem?.product?.id
//         ? { connect: { id: invoiceItem?.product?.id } }
//         : null,
//       quantity: invoiceItem.quantity,
//       price: invoiceItem.price,
//     };

//     return orderItem;
//   });

//   const payloadDataOrder: OrderItemCreateInput = {
//     price,
//     items: { create: orderItems },
//     user: user ? { connect: { id: user } } : null,
//   };

//   const order = await context.query.Order.createOne({
//     data: payloadDataOrder,
//     query: `
//         id
//     `,
//   });

//   return order;
// }

// export default createInvoice;
