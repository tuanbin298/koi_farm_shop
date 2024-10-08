import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { integer, relationship, timestamp } from "@keystone-6/core/fields";
import { permissions } from "../auth/access";

const Cart = list({
  access: {
    operation: {
      query: allowAll,
      create: allowAll,
      update: allowAll,
      delete: allowAll,
    },
  },

  ui: {
    hideCreate(args) {
      return !permissions.canManageProduct(args);
    },
    hideDelete(args) {
      return !permissions.canManageProduct(args);
    },
  },

  fields: {
    user: relationship({
        label: "Người mua",
        ref: "User",
      }),
    quantity: integer({
        label: "Số lượng",
        validation: {
          isRequired: true,
        },
      }),
    createAt: timestamp({
        label: "Ngày tạo giỏ hàng",
        defaultValue: { kind: "now" },
      }),
  },
});

export default Cart;
