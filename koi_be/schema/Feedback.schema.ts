import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import {
  integer,
  relationship,
  text,
  timestamp,
} from "@keystone-6/core/fields";
import { permissions } from "../auth/access";

const Feedback = list({
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
      return !permissions.canManageFeedback(args);
    },
    hideDelete(args) {
      return !permissions.canManageFeedback(args);
    },
  },

  fields: {
    user: relationship({
      label: "Người đánh giá",
      ref: "User",
    }),
    comment: text({
      label: "Đánh giá",
    }),
    createdAt: timestamp({
      label: "Thời gian đánh giá",
      defaultValue: { kind: "now" },
    }),
    rating: integer({
      label: "Số ngôi sao",
      validation: {
        min: 0,
        max: 5,
      },
    }),
  },
});

export default Feedback;
