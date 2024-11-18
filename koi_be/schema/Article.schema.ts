import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text } from "@keystone-6/core/fields";
import { cloudinaryImage } from "@keystone-6/cloudinary";
import { permissions } from "../auth/access";
import "dotenv/config";

export const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  apiKey: process.env.CLOUDINARY_API_KEY ?? "",
  apiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
  folder: `/${process.env.CLOUDINARY_FOLDER ?? "koi_viet"}`,
};

const Article = list({
  access: {
    operation: {
      query: allowAll,
      create: allowAll,
      update: permissions.canManageArticle,
      delete: allowAll,
    },
  },

  ui: {
    hideCreate(args) {
      return !permissions.canManageArticle(args);
    },
    hideDelete(args) {
      return !permissions.canManageArticle(args);
    },
  },

  fields: {
    name: text({
      label: "Tiêu đề bài blog",
      validation: {
        isRequired: true,
      },
    }),
    content: text({
      label: "Nội dung bài blog",
      validation: {
        isRequired: true,
      },
    }),
    links: text({
      label: "Đường dẫn bài blog",
    }),
    image: cloudinaryImage({
      label: "Hình ảnh",
      cloudinary,
    }),
  },
});

export default Article;
