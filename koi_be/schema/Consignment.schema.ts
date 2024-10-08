import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text, relationship, integer, select } from "@keystone-6/core/fields";
import { cloudinaryImage } from "@keystone-6/cloudinary";
import { permissions } from "../auth/access";
import "dotenv/config";

export const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  apiKey: process.env.CLOUDINARY_API_KEY ?? "",
  apiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
  folder: `/${process.env.CLOUDINARY_FOLDER ?? "koi_viet"}`,
};

const Consignment = list({
  access: {
    operation: {
      query: allowAll, // Cho phép tất cả mọi người truy vấn danh sách
      create: allowAll, // Cho phép tất cả tạo
      update: allowAll, // Cho phép tất cả cập nhật
      delete: allowAll, // Cho phép tất cả xóa
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
      validation: {
        isRequired: true,
      },
    }),
    // request: relationship({
    //   label: "Yêu cầu",
    //   ref: "Request",
    // }),
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
    medicalHistory: text({
      label: "Lịch sử bệnh",
    }),
    size: integer({
      label: "Size (cm)",
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
    category: relationship({
      label: "Loại",
      ref: "Category",
    }),
    koiStatus: select({
      label: "Trạng thái",
      options: [
        { label: "Available", value: "available" },
        { label: "Sold", value: "sold" },
      ],
      defaultValue: "available",
    }),
  },
});

export default Consignment;
