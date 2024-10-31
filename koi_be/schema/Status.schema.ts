import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { permissions } from "../auth/access";
import { relationship, text, timestamp } from "@keystone-6/core/fields";

const Status = list({
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
      return !permissions.canManageStatus(args);
    },
    hideDelete(args) {
      return !permissions.canManageStatus(args);
    },
  },

  fields: {
    status: text({
      label: "Trạng thái",
    }),
    changeTime: timestamp({
      label: "Thời gian thay đổi trạng thái",
      defaultValue: { kind: "now" },
    }),
    changedBy: relationship({
      label: "Người thay đổi trạng thái",
      ref: "User",
    }),
    request: relationship({
      label: "Yêu cầu",
      ref: "Request.statusHistory",
      many: false,
    }),
    order: relationship({
      label: "Đơn hàng",
      ref: "Order.statusHistory",
    }),
  },
});

export default Status;
