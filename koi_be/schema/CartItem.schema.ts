import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { integer, relationship } from "@keystone-6/core/fields";
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
    cart: relationship({
      ref: "Cart",
      label: "Giỏ hàng",
      many: false,
    }),
    product: relationship({
      label: "Sản phẩm",
      ref: "Product",
      many: true,
    }),
    price: integer({
      label: "Giá",
    }),
  },
});

export default CartItem;
