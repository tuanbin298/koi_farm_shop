import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";

const OrderItem = list({
  access: {
    operation: {
      query: allowAll,
      create: allowAll,
      update: allowAll,
      delete: allowAll,
    },
  },

  fields: {},
});

export default OrderItem;
