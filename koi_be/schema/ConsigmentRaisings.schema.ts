import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import {
  text,
  integer,
  float,
  relationship,
  timestamp,
  select,
} from "@keystone-6/core/fields";
import { permissions } from "../auth/access";

const ConsigmentRaising = list({
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
      return !permissions.canManageConsigment(args);
    },
    hideDelete(args) {
      return !permissions.canManageConsigment(args);
    },
  },

  fields: {
    user: relationship({
      label: "Người ký gửi nuôi",
      ref: "User",
    }),
    product: relationship({
      label: "Cá ký gửi nuôi",
      ref: "Product",
      many: false,
    }),
    consignmentDate: timestamp({
      label: "Ngày bắt đầu ký gửi nuôi",
      validation: {
        isRequired: true,
      },
      defaultValue: { kind: "now" },
      ui: {
        itemView: {
          fieldPosition: "sidebar",
        },
      },
    }),
    returnDate: timestamp({
      label: "Ngày kết thúc ký gửi nuôi",
      ui: {
        itemView: {
          fieldPosition: "sidebar",
        },
      },
    }),
    consignmentPrice: float({
      label: "Giá ký gửi nuôi",
      validation: {
        isRequired: true,
      },
    }),
    status: select({
      label: "Trạng thái",
      options: [
        { label: "Đang xử lý", value: "Đang xử lý" },
        { label: "Đang chăm sóc", value: "Đang chăm sóc" },
        { label: "Đang giao hàng", value: "Đang giao hàng" },
        { label: "Đã hoàn thành", value: "Đã hoàn thành" },
      ],
    }),
    description: text({
      label: "Mô tả",
    }),
  },
});

export default ConsigmentRaising;
