import { OrderCreateInput, type OrderItemCreateInput } from ".keystone/types";
import { KeystoneContext } from "@keystone-6/core/types";
import { Session } from "../auth/access";

interface Arguments {
  items: [OrderItemCreateInput];
  user: string;
  price: number;
  address: string;
  status: string;
}

async function createInvoice(
  root: any,
  { items, user, price, address, status }: Arguments,
  context: KeystoneContext
): Promise<OrderItemCreateInput> {
  //Check session of user
  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error("You must be logged in to do this !");
  }

  const orderItems = items.map((invoiceItem: any) => {
    const orderItem = {
      product: invoiceItem?.product?.id
        ? { connect: { id: invoiceItem?.product?.id } }
        : null,
      quantity: invoiceItem.quantity,
      price: invoiceItem.price,
    };

    return orderItem;
  });

  const payloadDataOrder: OrderCreateInput = {
    user: user ? { connect: { id: user } } : null,
    items: { create: orderItems },
    price,
    address,
    status,
  };

  const order = await context.query.Order.createOne({
    data: payloadDataOrder,
    query: `
        id
    `,
  });

  return order;
}

export default createInvoice;
