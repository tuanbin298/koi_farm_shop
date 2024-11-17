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
      return !permissions.canManageConsignment(args);
    },
    hideDelete(args) {
      return !permissions.canManageConsignment(args);
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
      label: "Mức giá cuối cùng",
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
            return permissions.canManageConsignment(args) ? "edit" : "read";
          },
        },
      },
    }),
  },

  hooks: {
    async beforeOperation({ operation, resolvedData, item, context }) {
      // Generate a slug based on product name when create product
      if (operation === "create") {
        resolvedData.slug = buildSlug(resolvedData.name);
      }

      // Generate a slug base on new of product name when update product
      if (operation === "update") {
        if (resolvedData?.name) {
          resolvedData.slug = buildSlug(resolvedData.name);
        }
      }

      // Delete, throw new error if orderItem contain this consignment sale
      if (operation === "delete") {
        const orderItems = await context.query.OrderItem.findMany({
          where: {
            consignmentSale: {
              id: { equals: item.id },
            },
          },
          query: "id consignmentSale { id name }",
        });
        console.log(orderItems);

        if (orderItems.length > 0) {
          throw new Error(
            "Không thể xoá sản phẩm ký gửi bán có trong đơn hàng"
          );
        }
      }
    },
  },
});

export default ConsignmentSale;
