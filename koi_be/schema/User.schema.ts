import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text, password, relationship } from "@keystone-6/core/fields";
import { filters, permissions } from "../auth/access";

const User = list({
  access: {
    operation: {
      query: allowAll,
      create: allowAll,
      update: allowAll,
      delete: allowAll,
    },
    // filter: {
    //   query: filters.canReadUser,
    // },
  },

  ui: {
    hideCreate(args) {
      return !permissions.canManageUser(args);
    },
    hideDelete(args) {
      return !permissions.canManageUser(args);
    },
  },

  fields: {
    name: text({
      label: "Tên",
      validation: {
        isRequired: true,
      },
    }),
    email: text({
      label: "Email",
      validation: {
        isRequired: true,
        match: {
          regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          explanation: "Invalid email",
        },
      },
      isIndexed: "unique",
    }),
    password: password({
      label: "Password",
      validation: {
        isRequired: true,
        length: { min: 5, max: 20 },
      },
    }),
    phone: text({
      label: "Số điện thoại",
      validation: {
        isRequired: true,
        match: {
          regex: /(03|05|07|08|09|01[2|6|8|9])([0-9]{8})\b/,
          explanation: "Invalid phone",
        },
      },
    }),
    address: text({
      label: "Địa chỉ",
    }),
    role: relationship({
      label: "Quyền hạn",
      ref: "Role.user",
      ui: {
        itemView: {
          fieldMode(args) {
            return permissions.canManageUser(args) ? "edit" : "read";
          },
        },
      },
    }),
    cart: relationship({
      label: "Giỏ hàng của người dùng",
      ref: "CartItem.user",
      many: true,
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read" },
      },
    }),
  },

  hooks: {
    async beforeOperation({ operation, item, context }) {
      if (operation === "delete") {
        // Can't delete user if they have request or order
        const requests = await context.query.Request.findMany({
          where: {
            user: {
              id: { equals: item.id },
            },
          },
          query: "id",
        });

        const orders = await context.query.Order.findMany({
          where: {
            user: {
              id: { equals: item.id },
            },
          },
          query: "id",
        });

        if (requests.length > 0 || orders.length > 0) {
          throw new Error("Không thể xoá người dùng đã có giao dịch");
        }

        // Delete cartItem when delete User
        const cartItems = await context.query.CartItem.findMany({
          where: {
            user: {
              id: { equals: item.id },
            },
          },
          query: "id",
        });
        console.log(cartItems);

        if (cartItems.length > 0) {
          for (const cartItem of cartItems) {
            await context.query.CartItem.deleteOne({
              where: { id: cartItem.id },
            });
          }
        }

        // Delete Feedback when delete User
        const feedbacks = await context.query.Feedback.findMany({
          where: {
            user: {
              id: { equals: item.id },
            },
          },
          query: "id user { id name } comment",
        });
        console.log(feedbacks);

        if (feedbacks.length > 0) {
          for (const feedback of feedbacks) {
            await context.query.Feedback.deleteOne({
              where: { id: feedback.id },
            });
          }
        }
      }
    },
  },
});

export default User;
