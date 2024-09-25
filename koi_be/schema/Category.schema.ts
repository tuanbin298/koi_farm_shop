import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text } from "@keystone-6/core/fields";
import { document } from "@keystone-6/fields-document";

const Category = list({
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
      label: "Loại cá",
      validation: {
        isRequired: true,
      },
    }),
    description: document({
      label: "Mô tả về loại cá",
      formatting: true,
      layouts: [
        [1, 1],
        [1, 1, 1],
      ],
    }),
  },
});

export default Category;
