import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text, password } from "@keystone-6/core/fields";

const User = list({
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
      label: "Name",
      validation: {
        isRequired: true,
      },
    }),
    email: text({
      label: "Email",
      validation: {
        isRequired: true,
        match: {
          regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          explanation: "Invalid email",
        },
      },
      isIndexed: "unique",
    }),
    password: password({
      label: "Password",
      validation: {
        isRequired: true,
        length: { min: 5, max: 20 },
      },
    }),
    phone: text({
      label: "Phone",
      validation: {
        isRequired: true,
        match: {
          regex: /^\d{6}$/,
          explanation: "Invalid phone",
        },
      },
    }),
    address: text({
      label: "Address",
    }),
  },
});

export default User;