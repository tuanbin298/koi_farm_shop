import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { integer, relationship, float } from "@keystone-6/core/fields";
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
      return !permissions.canManageProduct(args);
    },
    hideDelete(args) {
      return !permissions.canManageProduct(args);
    },
  },

  fields: {
    cart: relationship({
        ref: "Cart",
        label: "Giỏ hàng",
        many: false,
      }),
    Product: relationship({
      ref: "Product",
      label: "Sản phẩm",
      many: false,
    }),
    price: float({
      label: "Giá",
      validation: { isRequired: true, min: 0 },
    }),
  },
});

export default CartItem;
