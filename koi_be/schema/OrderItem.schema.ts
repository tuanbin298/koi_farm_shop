import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { checkbox, integer, relationship } from "@keystone-6/core/fields";

const OrderItem = list({
  access: {
    operation: {
      query: allowAll,
      create: allowAll,
      update: allowAll,
      delete: allowAll,
    },
  },

  fields: {
    order: relationship({
      label: "Đơn hàng",
      ref: "Order",
      many: false,
    }),
    product: relationship({
      label: "Sản phẩm",
      ref: "Product",
      many: false,
    }),
    quantity: integer({
      label: "Số lượng",
      validation: {
        isRequired: true,
      },
    }),
    price: integer({
      label: "Gía",
      validation: {
        isRequired: true,
      },
    }),
    isStored: checkbox({
      label: "Ký gửi nuôi",
      defaultValue: false,
    }),
  },
});

export default OrderItem;
