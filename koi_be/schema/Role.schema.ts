import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { checkbox, relationship, text } from "@keystone-6/core/fields";

const Role = list({
  access: {
    operation: {
      query: allowAll,
      create: allowAll,
      update: allowAll,
      delete: allowAll,
    },
  },

  fields: {
    name: text({
      label: "Quyền hạn",
      validation: {
        isRequired: true,
      },
    }),
    canManageUser: checkbox({
      label: "Quản lý người dùng",
      defaultValue: false,
    }),
    canManageProduct: checkbox({
      label: "Quản lý sản phẩm",
      defaultValue: false,
    }),
    canManageRole: checkbox({
      label: "Quản lý quyền hạn",
      defaultValue: false,
    }),
    user: relationship({
      label: "Người dùng",
      ref: "User.role",
      many: true,
    }),
  },
});

export default Role;
