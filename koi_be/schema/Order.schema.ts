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
      ui: {
        itemView: {
          fieldPosition: "sidebar",
        },
      },
    }),
    address: text({
      label: "Địa chỉ giao hàng",
      validation: {
        isRequired: true,
      },
    }),
    transaction: text({
      label: "Id giao dịch",
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read" },
      },
    }),
    paymentMethod: select({
      label: "Phương thức thanh toán",
      options: [
        { label: "Đặt cọc (50%)", value: "cod" },
        { label: "Thanh toán hết", value: "all" },
      ],
    }),
    status: select({
      label: "Trạng thái",
      defaultValue: "Thanh toán thành công",
      options: [
        { label: "Thanh toán thành công", value: "Thanh toán thành công" },
        { label: "Hoàn thành đơn hàng", value: "Hoàn thành đơn hàng" },
      ],
      ui: {
        itemView: {
          fieldPosition: "sidebar",
          fieldMode(args) {
            return permissions.canManageOrder(args) ? "edit" : "read";
          },
        },
      },
    }),
    statusHistory: relationship({
      label: "Lịch sử trạng thái",
      ref: "Status.order",
      many: true,
    }),
  },

  hooks: {
    async afterOperation({ operation, resolvedData, item, context }) {
      // Create new status when create Order
      if (operation === "create") {
        await context.query.Status.createOne({
          data: {
            status: "Chờ xác nhận",
            order: { connect: { id: item.id } },
            changedBy: { connect: { id: context.session.itemId } },
          },
        });
      }

      // Create new status when update status of Order
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

        if (resolvedData.status === "Hoàn thành đơn hàng") {
          const orderItems = await context.query.OrderItem.findMany({
            where: {
              order: { id: { equals: item.id } },
            },
            query: "id status",
          });
          console.log(orderItems);

          if (orderItems.length > 0) {
            // Chuẩn bị danh sách cập nhật
            const updates = orderItems.map((orderItem) => ({
              where: { id: orderItem.id }, // Đặt điều kiện với id
              data: { status: "Hoàn thành" }, // Dữ liệu cập nhật
            }));

            // Cập nhật hàng loạt với updateMany
            await context.query.OrderItem.updateMany({
              data: updates, // Gói danh sách cập nhật bên trong `data`
            });
          }
        }
      }
    },

    async beforeOperation({ operation, item, context }) {
      // Delete orderItem when delete Order
      if (operation === "delete") {
        const orderItems = await context.query.OrderItem.findMany({
          where: {
            order: {
              id: { equals: item.id },
            },
          },
          query: "id",
        });
        console.log(orderItems);

        if (orderItems.length > 0) {
          for (const orderItem of orderItems) {
            await context.query.OrderItem.deleteOne({
              where: { id: orderItem.id },
            });
          }
        }

        // Delete status when delete Order
        const statuses = await context.query.Status.findMany({
          where: {
            order: {
              id: { equals: item.id },
            },
          },
          query: "id status",
        });
        console.log(statuses);

        if (statuses.length > 0) {
          for (const status of statuses) {
            await context.query.Status.deleteOne({
              where: { id: status.id },
            });
          }
        }
      }
    },
  },
});

export default Order;
