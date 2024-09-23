import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text, relationship, integer, float } from "@keystone-6/core/fields";
import { cloudinaryImage } from "@keystone-6/cloudinary";

const Product = list({
  access: {
    operation: {
      query: allowAll,
      create: allowAll,
      update: allowAll,
      delete: allowAll,
    },
  },

  fields: {
    name: text({
      label: "Cá Koi",
      validation: {
        isRequired: true,
      },
    }),
    age: integer({
        label: "Tuổi",
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
    description : text({
        label: "Mô tả",
        validation: {
          isRequired: true,
        },
    }),
    origin : text({
        label: "Nguồn gốc",
        validation: {
          isRequired: true,
        },
    }),
    // image : cloudinaryImage({
    //     label: "Hình ảnh"
        
    // }),
    category : relationship({
        label: "Nguồn gốc",
        ref: "",
    }),
  },
});

export default Product;
