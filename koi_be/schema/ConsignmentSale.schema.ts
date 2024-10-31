import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text, integer, select, relationship } from "@keystone-6/core/fields";
import { permissions } from "../auth/access";
import buildSlug from "../utils/buildSlug";

const ConsignmentSale = list({
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
    name: text({
      label: "Cá Koi",
      validation: {
        isRequired: true,
      },
    }),
    birth: integer({
      label: "Năm sinh",
      validation: {
        isRequired: true,
      },
    }),
    sex: text({
      label: "Giới tính",
      validation: {
        isRequired: true,
      },
    }),
    medical: text({
      label: "Lịch sử bệnh",
    }),
    size: integer({
      label: "Kích thước",
      validation: {
        isRequired: true,
        min: 20,
        max: 100,
      },
    }),
    price: integer({
      label: "Giá",
    }),
    description: text({
      label: "Mô tả",
    }),
    generic: text({
      label: "Chủng loại",
    }),
    photo: relationship({
      label: "Hình ảnh",
      ref: "Gallery.product",
    }),
    category: text({
      label: "Loại",
    }),
    estimatedPrice: text({
      label: "Giá được xác định bởi hệ thống",
      validation: {
        isRequired: true,
      },
    }),
    slug: text({
      label: "Đường dẫn sản phẩm",
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "hidden" },
      },
    }),
    request: relationship({
      label: "Yêu cầu",
      ref: "Request.consignment",
    }),
    status: select({
      label: "Trạng thái",
      defaultValue: "Không có sẵn",
      options: [
        { label: "Có sẵn", value: "Có sẵn" },
        { label: "Không có sẵn", value: "Không có sẵn" },
      ],
      ui: {
        itemView: {
          fieldPosition: "sidebar",
          fieldMode(args) {
            return permissions.canManageConsigment(args) ? "edit" : "read";
          },
        },
      },
    }),
  },

  hooks: {
    beforeOperation: {
      create: async ({ resolvedData }) => {
        // Generate a slug based on product name
        resolvedData.slug = buildSlug(resolvedData.name);
      },
      update: async ({ resolvedData }) => {
        if (resolvedData?.name) {
          // Generate a slug base on new of product name
          resolvedData.slug = buildSlug(resolvedData.name);
        }
      },
    },
  },
});

export default ConsignmentSale;
