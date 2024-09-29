import { list } from "@keystone-6/core";
import { permissions } from "../auth/access";
import { allowAll } from "@keystone-6/core/access";
import { text } from "@keystone-6/core/fields";
import { document } from "@keystone-6/fields-document";
import { cloudinaryImage } from "@keystone-6/cloudinary";
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
            update: allowAll,
            delete: allowAll,
        },
    },

    ui: {
        hideCreate: (args) => {
            return !permissions.canManageArticle(args);
        },
        hideDelete: (args) => {
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
        link: document({
            label:"Đường dẫn bài blog",
            links: true,
        }),
        image: cloudinaryImage({
            label: "Hình ảnh",
            cloudinary,
          }),
    },
});

export default Article;