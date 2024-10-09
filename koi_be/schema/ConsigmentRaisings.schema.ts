import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { permissions } from "../auth/access";

const ConsigmentRaising = list({
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
      return !permissions.canManageProduct(args);
    },
    hideDelete(args) {
      return !permissions.canManageProduct(args);
    },
  },

  fields: {},
});

export default ConsigmentRaising;
