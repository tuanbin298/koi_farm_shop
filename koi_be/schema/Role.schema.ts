import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { checkbox, relationship, text } from "@keystone-6/core/fields";
import { permissions } from "../auth/access";

const Role = list({
  access: {
    operation: {
      query: allowAll,
      create: allowAll,
      update: permissions.canManageRole,
      delete: allowAll,
    },
  },

  ui: {
    hideCreate(args) {
      return !permissions.canManageRole(args);
    },
    hideDelete(args) {
      return !permissions.canManageRole(args);
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
    canManageArticle: checkbox({
      label: "Quản lý bài đăng",
      defaultValue: false,
    }),
    canManageOrder: checkbox({
      label: "Quản lý đơn hàng",
      defaultValue: false,
    }),
    canManageFeedback: checkbox({
      label: "Quản lý đánh giá",
      defaultValue: false,
    }),
    canManageCart: checkbox({
      label: "Quản lý giỏ hàng",
      defaultValue: false,
    }),
    canManageConsigment: checkbox({
      label: "Quản lý hàng ký gửi",
      defaultValue: false,
    }),
    canManageRequest: checkbox({
      label: "Quản lý yêu cầu",
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
