import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text, relationship } from "@keystone-6/core/fields";
import { cloudinaryImage } from "@keystone-6/cloudinary";
import "dotenv/config";

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

  fields: {
    title: text({
      label: "Chú thích",
      defaultValue: "Hình ảnh",
    }),
    image: cloudinaryImage({
      label: "Hình ảnh",
      cloudinary,
    }),
    product: relationship({
      label: "Sản phẩm",
      ref: "ConsignmentSale.photo",
    }),
  },
});

export default Gallery;
