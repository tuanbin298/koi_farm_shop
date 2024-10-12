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
    filter: {
      query: (args) => {
        return filters.canReadUser(args);
      },
    },
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
          regex: /^\d{6}$/,
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
    }),
  },
});

export default User;
