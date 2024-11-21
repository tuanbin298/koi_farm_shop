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
      return !permissions.canManageConsignment(args);
    },
    hideDelete(args) {
      return !permissions.canManageConsignment(args);
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
    description: text({
      label: "Mô tả",
    }),
    status: select({
      label: "Trạng thái",
      defaultValue: "Đang xử lý",
      options: [
        { label: "Đang xử lý", value: "Đang xử lý" },
        { label: "Đang chăm sóc", value: "Đang chăm sóc" },
        { label: "Kết thúc ký gửi", value: "Kết thúc ký gửi" },
        { label: "Hoàn thành", value: "Hoàn thành" },
      ],
    }),
  },

  hooks: {
    async beforeOperation({ item, context, operation }) {
      // Delete, throw new error if orderItem contain this consignment raising
      if (operation === "delete") {
        const orderItems = await context.query.OrderItem.findMany({
          where: {
            consignmentRaising: {
              id: { equals: item.id },
            },
          },
          query: "id consignmentRaising { id product { id name } }",
        });
        console.log(orderItems);

        if (orderItems.length > 0) {
          throw new Error(
            "Không thể xoá sản phẩm ký gửi nuôi có trong đơn hàng"
          );
        }
      }
    },
  },
});

export default ConsigmentRaising;
