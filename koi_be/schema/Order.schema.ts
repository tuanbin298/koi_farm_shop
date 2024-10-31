import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import {
  integer,
  relationship,
  select,
  text,
  timestamp,
} from "@keystone-6/core/fields";
import { permissions } from "../auth/access";

const Order = list({
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
      return !permissions.canManageOrder(args);
    },
    hideDelete(args) {
      return !permissions.canManageOrder(args);
    },
  },

  fields: {
    user: relationship({
      label: "Người mua",
      ref: "User",
    }),
    items: relationship({
      label: "Sản phẩm trong đơn hàng",
      ref: "OrderItem",
      many: true,
    }),
    price: integer({
      label: "Tổng tiền",
    }),
    createAt: timestamp({
      label: "Thời gian thanh toán",
      defaultValue: { kind: "now" },
    }),
    address: text({
      label: "Địa chỉ giao hàng",
      validation: {
        isRequired: true,
      },
    }),
    status: select({
      label: "Trạng thái",
      defaultValue: "Chờ xác nhận",
      options: [
        { label: "Chờ xác nhận", value: "Chờ xác nhận" },
        { label: "Xác nhận đơn hàng", value: "Xác nhận đơn hàng" },
        {
          label: "Hoàn tất thanh toán",
          value: "Hoàn tất thanh toán",
        },
        { label: "Huỷ đơn hàng", value: "Huỷ đơn hàng" },
      ],
    }),
    statusHistory: relationship({
      label: "Lịch sử trạng thái",
      ref: "Status.order",
      many: true,
    }),
  },

  hooks: {
    async afterOperation({ operation, resolvedData, item, context }) {
      if (operation === "create") {
        await context.query.Status.createOne({
          data: {
            status: "Chờ xác nhận",
            order: { connect: { id: item.id } },
            changedBy: { connect: { id: context.session.itemId } },
          },
        });
      }

      if (
        operation === "update" &&
        resolvedData.status &&
        resolvedData !== item.status
      ) {
        await context.query.Status.createOne({
          data: {
            status: resolvedData.status,
            order: { connect: { id: item.id } },
            changedBy: { connect: { id: context.session.itemId } },
          },
        });
      }
    },
  },
});

export default Order;
