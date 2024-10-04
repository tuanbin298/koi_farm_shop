import config from "../keystone";
import { categories, roles, users, products, articles } from "./data";
import * as PrismaModule from "@prisma/client";
import { getContext } from "@keystone-6/core/context";

export default async function insertSeedData() {
  // perform queries and operations with the database
  const context = getContext(config, PrismaModule);

  await config.db.onConnect?.(context);

  await context.sudo().db.Category.createMany({
    data: categories,
  });

  await context.sudo().db.User.createMany({
    data: users,
  });

  await context.sudo().db.Role.createMany({
    data: roles,
  });

  await context.sudo().db.Article.createMany({
    data: articles,
  });

  const categoryItem = await context.sudo().db.Category.findMany();

  for (const product of products) {
    const category = categoryItem.find(function (item) {
      return item.name === product.category;
    });

    if (category) {
      await context.sudo().db.Product.createOne({
        data: {
          ...product,
          category: { connect: { id: category.id } },
        },
      });
    }
  }
}

insertSeedData();
