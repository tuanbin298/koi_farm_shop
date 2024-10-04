import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { relationship, text, timestamp } from "@keystone-6/core/fields";

const Feedback = list({
  access: {
    operation: {
      query: allowAll,
      create: allowAll,
      update: allowAll,
      delete: allowAll,
    },
  },

  fields: {
    user: relationship({
      label: "Người đánh giá",
      ref: "User",
    }),
    product: relationship({
      label: "Sản phẩm",
      ref: "Product",
    }),
    comment: text({
      label: "Đánh giá",
    }),
    createdAt: timestamp({
      label: "Thời gian đánh giá",
      defaultValue: { kind: "now" },
    }),
  },
});

export default Feedback;
