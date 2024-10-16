import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text, integer, select } from "@keystone-6/core/fields";
import { cloudinaryImage } from "@keystone-6/cloudinary";
import { permissions } from "../auth/access";
import "dotenv/config";

export const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  apiKey: process.env.CLOUDINARY_API_KEY ?? "",
  apiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
  folder: `/${process.env.CLOUDINARY_FOLDER ?? "koi_viet"}`,
};

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
      validation: {
        isRequired: true,
      },
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
      label: "Giá được xác định bởi hệ thống",
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
    generic: text({
      label: "Chủng loại",
    }),
    image: cloudinaryImage({
      label: "Hình ảnh",
      cloudinary,
    }),
    category: text({
      label: "Loại",
    }),
    status: select({
      label: "Trạng thái",
      defaultValue: "Còn hàng",
      options: [
        { label: "Còn hàng", value: "Còn hàng" },
        { label: "Đã bán", value: "Đã bán" },
      ],
    }),
  },
});

export default ConsignmentSale;
