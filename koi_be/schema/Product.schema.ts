import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text, relationship, integer, float } from "@keystone-6/core/fields";
import { cloudinaryImage } from "@keystone-6/cloudinary";
import { permissions } from "../auth/access";

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
      update: allowAll,
      delete: allowAll,
    },
  },

  ui: {
    hideCreate: (args) => {
      console.log(args.session.data);
      return !permissions.canManageProduct(args);
    },
    hideDelete: (args) => {
      return !permissions.canManageProduct(args);
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
    size: float({
      label: "Kích thước",
      validation: {
        isRequired: true,
      },
    }),
    price: integer({
      label: "Giá",
      validation: {
        isRequired: true,
      },
    }),
    description: text({
      label: "Mô tả",
    }),
    origin: text({
      label: "Nguồn gốc",
      validation: {
        isRequired: true,
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
  },
});

export default Product;
