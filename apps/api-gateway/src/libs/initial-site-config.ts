import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const initializeConfig = async () => {
  try {
    const existingConfig = await prisma.site_config.findFirst();
    if (!existingConfig) {
      await prisma.site_config.create({
        data: {
          categories: [
            "Electronics",
            "Fashion",
            "Home & Kitchen",
            "Books & Stationery",
            "Health & Beauty",
            "Sports & Outdoors",
          ],
          subCategories: {
            Electronics: [
              "Smartphones",
              "Laptops",
              "Tablets",
              "Televisions",
              "Cameras",
              "Headphones",
              "Gaming Consoles",
            ],
            Fashion: [
              "Men's Clothing",
              "Women's Clothing",
              "Shoes",
              "Watches",
              "Bags & Accessories",
            ],
            "Home & Kitchen": [
              "Furniture",
              "Kitchen Appliances",
              "Cookware",
              "Bedding",
              "Lighting",
            ],
            "Books & Stationery": [
              "Fiction",
              "Non-fiction",
              "Children's Books",
              "Notebooks",
              "Office Supplies",
            ],
            "Health & Beauty": [
              "Skincare",
              "Hair Care",
              "Makeup",
              "Fragrances",
              "Supplements",
            ],
            "Sports & Outdoors": [
              "Fitness Equipment",
              "Camping Gear",
              "Cycling",
              "Outdoor Apparel",
            ],
          },
        },
      });
    }
  } catch (error) {
    console.error('Error initializing site config:', error)
  }
};

export default initializeConfig