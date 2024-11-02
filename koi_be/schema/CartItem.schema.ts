import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { checkbox, integer, relationship } from "@keystone-6/core/fields";
import { permissions } from "../auth/access";

const CartItem = list({
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
      return !permissions.canManageCart(args);
    },
    hideDelete(args) {
      return !permissions.canManageCart(args);
    },
  },

  fields: {
    user: relationship({
      label: "Người dùng",
      ref: "User.cart",
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
    quantity: integer({
      label: "Số lượng",
      defaultValue: 1,
      validation: {
        isRequired: true,
      },
    }),
    product: relationship({
      label: "Sản phẩm",
      ref: "Product",
      many: true,
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
    consignmentProduct: relationship({
      label: "Sản phẩm ký gửi",
      ref: "ConsignmentSale",
      many: true,
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
    isStored: checkbox({
      label: "Ký gửi nuôi",
    }),
  },
});

export default CartItem;
