// Type of data, every in this type is session return from db
export type Session = {
  itemId: string;
  listKey: string;
  data: {
    name: string;
    role: {
      id: string;
      name: string;
      canManageUser: boolean;
      canManageProduct: boolean;
      canManageRole: boolean;
      canManageArticle: boolean;
      canManageOrder: boolean;
      canManageFeedback: boolean;
      canManageCart: boolean;
      canManageConsignment: boolean;
      canManageRequest: boolean;
      canManageStatus: boolean;
      canManageGallery: boolean;
    };
  };
};

// Use this type as parameter in function
type AccessArgs = {
  session?: Session;
};

// Permission
export const permissions = {
  canManageUser: ({ session }: AccessArgs) =>
    session?.data.role?.canManageUser ?? false,
  canManageRole: ({ session }: AccessArgs) =>
    session?.data.role?.canManageRole ?? false,
  canManageProduct: ({ session }: AccessArgs) =>
    session?.data.role?.canManageProduct ?? false,
  canManageArticle: ({ session }: AccessArgs) =>
    session?.data.role?.canManageArticle ?? false,
  canManageOrder: ({ session }: AccessArgs) =>
    session?.data.role?.canManageOrder ?? false,
  canManageFeedback: ({ session }: AccessArgs) =>
    session?.data.role?.canManageFeedback ?? false,
  canManageCart: ({ session }: AccessArgs) =>
    session?.data.role?.canManageCart ?? false,
  canManageConsignment: ({ session }: AccessArgs) =>
    session?.data.role?.canManageConsignment ?? false,
  canManageRequest: ({ session }: AccessArgs) =>
    session?.data.role?.canManageRequest ?? false,
  canManageStatus: ({ session }: AccessArgs) =>
    session?.data.role?.canManageStatus ?? false,
  canManageGallery: ({ session }: AccessArgs) =>
    session?.data.role?.canManageGallery ?? false,
};

export const filters = {
  canReadUser: ({ session }: AccessArgs) => {
    if (!session) {
      return false;
    }

    if (session.data.role?.canManageUser) {
      return true;
    }

    return { id: { equals: session.itemId } };
  },
};
