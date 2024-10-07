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
//   const sesh = context.session as Session;
//   if (!sesh.itemId) {
//     throw new Error("");
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

//   return sesh;
// }

// export default createInvoice;
