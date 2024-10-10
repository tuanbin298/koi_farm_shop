import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { relationship, select, text, timestamp } from "@keystone-6/core/fields";
import { permissions } from "../auth/access";

const Request = list({
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
      return !permissions.canManageRequest(args);
    },
    hideDelete(args) {
      return !permissions.canManageRequest(args);
    },
  },

  fields: {
    user: relationship({
      label: "Người gửi yêu cầu ký gửi",
      ref: "User",
    }),
    staff: relationship({
      label: "Nhân viên xử lý yêu cầu",
      ref: "User",
    }),
    createAt: timestamp({
      label: "Thời gian gửi yêu cầu",
      defaultValue: { kind: "now" },
    }),
    description: text({
      label: "Mô tả yêu cầu ký gửi",
    }),
    consignment: relationship({
      label: "Đơn hàng ký gửi",
      ref: "ConsignmentSale",
    }),
    status: select({
      label: "Trạng thái",
      defaultValue: "Chờ xác nhận",
      options: [
        { label: "Chờ xác nhận", value: "Chờ xác nhận" },
        { label: "Xác nhận yêu cầu", value: "Xác nhận yêu cầu" },
      ],
    }),
  },
});

export default Request;
