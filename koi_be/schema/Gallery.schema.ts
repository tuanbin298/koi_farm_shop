import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text, relationship } from "@keystone-6/core/fields";
import { cloudinaryImage } from "@keystone-6/cloudinary";
import "dotenv/config";
import { permissions } from "../auth/access";

export const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  apiKey: process.env.CLOUDINARY_API_KEY ?? "",
  apiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
  folder: `/${process.env.CLOUDINARY_FOLDER ?? "koi_viet"}`,
};

const Gallery = list({
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
      return !permissions.canManageGallery(args);
    },
    hideDelete(args) {
      return !permissions.canManageGallery(args);
    },
  },

  fields: {
    title: text({
      label: "Chú thích",
      defaultValue: "Hình ảnh",
    }),
    image: cloudinaryImage({
      label: "Hình ảnh",
      cloudinary,
    }),
    ownProduct: relationship({
      label: "Sản phẩm từ trang trại",
      ref: "Product.photo",
      many: true,
    }),
    product: relationship({
      label: "Sản phẩm ký gửi",
      ref: "ConsignmentSale.photo",
    }),
  },
});

export default Gallery;
