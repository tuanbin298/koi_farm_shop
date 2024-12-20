import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text, relationship, integer, select } from "@keystone-6/core/fields";
import { permissions } from "../auth/access";
import "dotenv/config";
import buildSlug from "../utils/buildSlug";

const Product = list({
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
      console.log(args.session.data);
      return !permissions.canManageProduct(args);
    },
    hideDelete(args) {
      return !permissions.canManageProduct(args);
    },
  },

  fields: {
    name: text({
      label: "Cá Koi",
      isIndexed: "unique",
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
    sex: select({
      label: "Giới tính",
      defaultValue: "Sex",
      options: [
        { label: "Đực", value: "Đực" },
        { label: "Cái", value: "Cái" },
      ],
    }),
    size: select({
      label: "Kích thước",
      defaultValue: "Size",
      options: [
        { label: "20cm", value: "20cm" },
        { label: "30cm", value: "30cm" },
        { label: "40cm", value: "40cm" },
        { label: "50cm", value: "50cm" },
        { label: "60cm", value: "60cm" },
        { label: "70cm", value: "70cm" },
      ],
    }),
    price: integer({
      label: "Giá",
      validation: {
        isRequired: true,
        min: 0,
      },
    }),
    description: text({
      label: "Mô tả",
    }),
    origin: text({
      label: "Nguồn cung",
      validation: {
        isRequired: true,
      },
    }),
    generic: text({
      label: "Chủng loại",
    }),
    slug: text({
      label: "Đường dẫn sản phẩm",
      isIndexed: "unique",
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "hidden" },
      },
    }),
    photo: relationship({
      label: "Hình ảnh",
      ref: "Gallery.ownProduct",
    }),
    category: relationship({
      label: "Loại",
      ref: "Category",
    }),
    status: select({
      label: "Trạng thái",
      options: [
        { label: "Có sẵn", value: "Có sẵn" },
        { label: "Không có sẵn", value: "Không có sẵn" },
      ],
      ui: {
        itemView: {
          fieldPosition: "sidebar",
          fieldMode(args) {
            return permissions.canManageProduct(args) ? "edit" : "read";
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

      // Delete, throw new error if orderItem contain this product
      if (operation === "delete") {
        const orderItems = await context.query.OrderItem.findMany({
          where: {
            product: {
              id: { equals: item.id },
            },
          },
          query: "id product { id name }",
        });
        console.log(orderItems);

        if (orderItems.length > 0) {
          throw new Error("Không thể xoá sản phẩm có trong đơn hàng");
        }
      }
    },
  },
});

export default Product;
