import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text, relationship, integer, select } from "@keystone-6/core/fields";
import { cloudinaryImage } from "@keystone-6/cloudinary";
import { permissions } from "../auth/access";
import "dotenv/config";
import buildSlug from "../utils/buildSlug";

export const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  apiKey: process.env.CLOUDINARY_API_KEY ?? "",
  apiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
  folder: `/${process.env.CLOUDINARY_FOLDER ?? "koi_viet"}`,
};

const Product = list({
  access: {
    operation: {
      query: allowAll,
      create: allowAll,
      update: permissions.canManageProduct,
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
    image: cloudinaryImage({
      label: "Hình ảnh",
      cloudinary,
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
            return permissions.canManageRequest(args) ? "edit" : "read";
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

export default Product;
