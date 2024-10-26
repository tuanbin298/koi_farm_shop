import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text, integer, float, relationship, timestamp, select } from "@keystone-6/core/fields";
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
      label: "Người Ký Gửi Nuôi",
      ref: "User",
    }),
    product: relationship({
      label: "Tên Cá Ký Gửi Nuôi",
      ref: "Product",
      many: false,
    }),
    consignmentDate: timestamp({
      label: "Ngày Bắt Đầu Ký Gửi Nuôi",
      validation: {
        isRequired: true,
      },
      defaultValue: { kind: "now" },
    }),
    returnDate: timestamp({
      label: "Ngày Kết Thúc Ký Gửi Nuôi",
    }),

    consignmentPrice: float({
      label: "Giá Ký Gửi Nuôi",
      validation: {
        isRequired: true,
      },
    }),
    status: select({
      label: "Trạng thái",
      options: [
        { label: "Đang xử lý", value: "Đang xử lý" },
        { label: "Đang Chăm Sóc", value: "Đang Chăm Sóc" },
        { label: "Đang Giao hàng", value: "Đang Giao hàng" },
        { label: "Đã hoàn thành", value: "Đã hoàn thành" },
      ],
    }),
    description: text({
      label: "Mô tả",
    }),
  },
});

export default ConsigmentRaising;
