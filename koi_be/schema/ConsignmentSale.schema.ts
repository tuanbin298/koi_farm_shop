import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text, integer, select, relationship } from "@keystone-6/core/fields";
import { permissions } from "../auth/access";

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
      label: "Giá",
    }),
    description: text({
      label: "Mô tả",
    }),
    origin: text({
      label: "Nguồn gốc",
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
