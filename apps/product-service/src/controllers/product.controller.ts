import {
  AuthError,
  NotFoundError,
  ValidationError,
} from "@packages/error-handler";
import { imagekit } from "@packages/libs/imagekit";
import prisma from "@packages/libs/prisma";
import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

// get product category
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const config = await prisma.site_config.findFirst();

    if (!config)
      return res.status(404).json({ message: "Categories not found" });

    return res.status(200).json({
      categories: config.categories,
      subCategories: config.subCategories,
    });
  } catch (error) {
    return next(error);
  }
};

// create discount codes
export const createDiscountCodes = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { public_name, discountType, discountValue, discountCode } = req.body;
    const sellerId = req.seller?.id;

    if (!sellerId) {
      return next(new ValidationError("Seller not authenticated"));
    }

    const normalizedCode = discountCode.trim().toUpperCase();
    const parsedValue = parseFloat(discountValue);

    if (isNaN(parsedValue) || parsedValue <= 0) {
      return next(new ValidationError("Discount value must be a valid number"));
    }

    const isDiscountCodeExist = await prisma.discount_codes.findUnique({
      where: { discountCode: normalizedCode },
    });

    if (isDiscountCodeExist) {
      return next(
        new ValidationError(
          "Discount code already exists. Please use a different code."
        )
      );
    }

    const discount_code = await prisma.discount_codes.create({
      data: {
        public_name,
        discountType,
        discountValue: parsedValue,
        discountCode: normalizedCode,
        sellerId,
      },
    });

    res.status(201).json({
      success: true,
      discount_code,
    });
  } catch (error) {
    console.error("Create Discount Error:", error);
    next(error);
  }
};

// get discount codes
export const getDiscountCodes = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const discount_codes = await prisma.discount_codes.findMany({
      where: {
        sellerId: req.seller.id,
      },
    });
    return res.status(200).json({
      success: true,
      discount_codes,
    });
  } catch (error) {
    return next(error);
  }
};

// delete discount codes
export const deleteDiscountCodes = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const sellerId = req.seller?.id;

    const discountCode = await prisma.discount_codes.findUnique({
      where: { id },
      select: { id: true, sellerId: true },
    });
    if (!discountCode) {
      return next(new NotFoundError("Discount code not found!"));
    }
    if (discountCode.sellerId !== sellerId) {
      return next(new ValidationError("Unauthorized access!"));
    }

    await prisma.discount_codes.delete({ where: { id } });

    return res
      .status(200)
      .json({ message: "Discount code successfully deleted" });
  } catch (error) {
    return next(error);
  }
};

// upload product image
export const uploadProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileName } = req.body;

    const response = await imagekit.upload({
      file: fileName,
      fileName: `product-${Date.now()}.jpg`,
      folder: "/products",
    });
    res.status(201).json({
      file_url: response.url,
      fileId: response.fileId,
    });
  } catch (error) {
    next(error);
  }
};

// delete product image
export const deleteProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileId } = req.body;
    const response = await imagekit.deleteFile(fileId);
    res.status(200).json({
      success: true,
      response,
    });
  } catch (error) {
    next(error);
  }
};

// create product
export const createProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      short_description,
      detailed_description,
      warranty,
      custom_specifications,
      slug,
      tags,
      cash_on_delivery,
      brand,
      video_url,
      category,
      colors = [],
      sizes = [],
      discountCodes,
      stock,
      sale_price,
      regular_price,
      subCategory,
      customProperties = {},
      images = [],
    } = req.body;

    if (
      !title ||
      !slug ||
      !short_description ||
      !category ||
      !subCategory ||
      !sale_price ||
      !images ||
      !tags ||
      !regular_price ||
      !stock
    ) {
      return next(new ValidationError("Missing required fields."));
    }
    if (!req.seller.id) {
      return next(new AuthError("Only seller can create products!"));
    }
    const slugChecking = await prisma.products.findUnique({
      where: {
        slug,
      },
    });
    if (slugChecking)
      return next(
        new ValidationError("Slug already exist! Please use a different slug!")
      );

    const newProduct = await prisma.products.create({
      data: {
        title,
        short_description,
        detailed_description,
        warranty,
        cashOnDelivery: cash_on_delivery,
        slug,
        shopId: req.seller?.shop?.id,
        tags: Array.isArray(tags) ? tags : tags.split(","),
        brand,
        video_url,
        category,
        subCategory,
        colors: colors || [],
        discount_codes: discountCodes.map((codeId: string) => codeId),
        sizes: sizes || [],
        stock: parseInt(stock),
        sale_price: parseFloat(sale_price),
        regular_price: parseFloat(regular_price),
        custom_properties: customProperties || {},
        custom_specifications: custom_specifications || {},
        images: {
          create: images
            .filter((img: any) => img && img.fileId && img.file_url)
            .map((img: any) => ({
              file_id: img.fileId,
              url: img.file_url,
            })),
        },
      },
      include: { images: true },
    });
    res.status(201).json({
      success: true,
      newProduct,
    });
  } catch (error) {
    next(error);
  }
};
// get all products
export const getShopProducts = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prisma.products.findMany({
      where: {
        shopId: req?.seller?.shop?.id,
      },
      include: {
        images: true,
      },
    });
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// delete a product
export const deleteProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const shopId = req.seller?.shop?.id;

    const product = await prisma.products.findUnique({
      where: { id: productId },
      select: { id: true, shopId: true, isDeleted: true },
    });

    if (!product) {
      return next(new ValidationError("Product not found"));
    }

    if (product.shopId !== shopId) {
      return next(new ValidationError("Unauthorized action"));
    }

    if (product.isDeleted) {
      return next(new ValidationError("Product is already deleted"));
    }

    const deletedAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours later

    const deletedProduct = await prisma.products.update({
      where: { id: productId },
      data: {
        isDeleted: true,
        deletedAt,
      },
    });

    return res.status(200).json({
      message:
        "Product is scheduled for deletion in 24 hours. You can restore it within this time.",
      deletedAt: deletedProduct.deletedAt,
    });
  } catch (error) {
    return next(error);
  }
};

// restore product in 24 hours
export const restoreProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const shopId = req.seller?.shop?.id;

    const product = await prisma.products.findUnique({
      where: { id: productId },
      select: { id: true, shopId: true, isDeleted: true },
    });

    if (!product) {
      return next(new ValidationError("Product not found"));
    }

    if (product.shopId !== shopId) {
      return next(new ValidationError("Unauthorized action"));
    }

    if (!product.isDeleted) {
      return res
        .status(400)
        .json({ message: "Product is not in a deleted state" });
    }

    await prisma.products.update({
      where: { id: productId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });

    return res.status(200).json({ message: "Product restored successfully" });
  } catch (error) {
    return next(error);
  }
};

// get all products
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const type = req.query.type;

    const now = new Date();

    const baseFilter = {
      isDeleted: false,
      // AND: [
      //   {
      //     OR: [
      //       { starting_date: null },
      //       { starting_date: { lte: now } }, // started on or before now
      //     ],
      //   },
      //   {
      //     OR: [
      //       { ending_date: null },
      //       { ending_date: { gte: now } }, // ends on or after now
      //     ],
      //   },
      // ],
    };

    const orderBy: Prisma.productsOrderByWithRelationInput =
      type === "latest" ? { createdAt: "desc" } : { totalSales: "desc" };

    const [products, total, top10products] = await Promise.all([
      prisma.products.findMany({
        skip,
        take: limit,
        include: {
          images: true,
          shop: true,
        },
        where: baseFilter,
        orderBy,
      }),
      prisma.products.count({ where: baseFilter }),
      prisma.products.findMany({
        take: 10,
        where: baseFilter,
        orderBy,
      }),
    ]);

    res.status(200).json({
      products,
      top10By: type === "latest" ? "latest" : "topSales",
      top10products,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};


// get product details 
export const getProductDetails = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try{

    const product = await prisma.products.findUnique({
      where: {
        slug: req.params.slug!,
      },
      include: {
        images: true,
        shop: true,
      },
    })
    res.status(201).json({
      success: true,
      product,
    })

  }catch(error){
    next(error)
  }
}


// get filtered offers
export const getFilteredProducts = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try{
    const {
      priceRange = [0, 10000],
      categories = [],
      colors = [],
      sizes = [],
      page = 1,
      limit = 12,
    } = req.query

  const parsedPriceRange = typeof priceRange === 'string' ? priceRange.split(',').map(Number) : [0, 10000]

  const parsedPage = Number(page)
  const parsedLimit = Number(limit)

  const skip = (parsedPage - 1) * parsedLimit

  const filters : Record<string, any> = {
    sale_price: {
      gte: parsedPriceRange[0],
      lte: parsedPriceRange[1]
    }
  }
  if(categories && (categories as string[]).length > 0){
    filters.category = {
      in: Array.isArray(categories) ? categories :String(categories).split(',')
    }
  }

  if(colors && (colors as string[]).length >0){
    filters.colors = {
      hasSome: Array.isArray(colors) ? colors : [colors]
    }
  }

  if(sizes && (sizes as string[]).length >0){
    filters.sizes = {
      hasSome: Array.isArray(sizes) ? sizes : [sizes]
    }
  }

  const [products, total] = await Promise.all([
    prisma.products.findMany({
      where: filters,
      skip,
      take: parsedLimit,
      include: {
        images: true,
        shop: true,
      },
    }),
    prisma.products.count({where: filters})
  ])
  const totalPages = Math.ceil(total / parsedLimit)

  res.json({
    products,
    pagination: {
      total,
      page: parsedPage,
      totalPages,
    }
  })
  }catch(error){
    next(error)
  }
}

// get filtered offers
export const getFilteredOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      priceRange = [0, 10000],
      categories = [],
      colors = [],
      sizes = [],
      page = 1,
      limit = 12,
    } = req.query;

    const parsedPriceRange =
      typeof priceRange === "string"
        ? priceRange.split(",").map(Number)
        : [0, 10000];

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    const filters: Record<string, any> = {
      sale_price: {
        gte: parsedPriceRange[0],
        lte: parsedPriceRange[1],
      },
      starting_date: {
        not: null, 
      },
    };

    if (categories && (categories as string[]).length > 0) {
      filters.category = {
        in: Array.isArray(categories)
          ? categories
          : String(categories).split(","),
      };
    }

    if (colors && (colors as string[]).length > 0) {
      filters.colors = {
        hasSome: Array.isArray(colors) ? colors : [colors],
      };
    }

    if (sizes && (sizes as string[]).length > 0) {
      filters.sizes = {
        hasSome: Array.isArray(sizes) ? sizes : [sizes],
      };
    }

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where: filters,
        skip,
        take: parsedLimit,
        include: {
          images: true,
          shop: true,
        },
      }),
      prisma.products.count({ where: filters }),
    ]);

    const totalPages = Math.ceil(total / parsedLimit);

    res.json({
      products,
      pagination: {
        total,
        page: parsedPage,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};


// get filtered events
export const getFilteredEvents = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try{
    const {
      priceRange = [0, 10000],
      categories = [],
      colors = [],
      sizes = [],
      page = 1,
      limit = 12,
    } = req.query

  const parsedPriceRange = typeof priceRange === 'string' ? priceRange.split(',').map(Number) : [0, 10000]

  const parsedPage = Number(page)
  const parsedLimit = Number(limit)

  const skip = (parsedPage - 1) * parsedLimit

  const filters : Record<string, any> = {
    sale_price: {
      gte: parsedPriceRange[0],
      lte: parsedPriceRange[1]
    },
    NOT: {
      starting_date: null,
    }
  }
  if(categories && (categories as string[]).length > 0){
    filters.category = {
      in: Array.isArray(categories) ? categories :String(categories).split(',')
    }
  }

  if(colors && (colors as string[]).length >0){
    filters.colors = {
      hasSome: Array.isArray(colors) ? colors : [colors]
    }
  }

  if(sizes && (sizes as string[]).length >0){
    filters.colors = {
      hasSome: Array.isArray(sizes) ? sizes : [sizes]
    }
  }

  const [products, total] = await Promise.all([
    prisma.products.findMany({
      where: filters,
      skip,
      take: parsedLimit,
      include: {
        images: true,
        shop: true,
      },
    }),
    prisma.products.count({where: filters})
  ])
  const totalPages = Math.ceil(total / parsedLimit)

  res.json({
    products,
    pagination: {
      total,
      page: parsedPage,
      totalPages,
    }
  })
  }catch(error){
    next(error)
  }
}

// get filtered shops
export const getFilteredShops = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try{
    const {
      categories = [],
      countries = [],
      page = 1,
      limit = 12,
    } = req.query


  const parsedPage = Number(page)
  const parsedLimit = Number(limit)
  const skip = (parsedPage - 1) * parsedLimit

  const filters : Record<string, any> = {}
  
  if(categories && (categories as string[]).length > 0){
    filters.category = {
      in: Array.isArray(categories) ? categories : String(categories).split(',')
    }
  }

  if(countries && (countries as string[]).length >0){
    filters.colors = {
      in: Array.isArray(countries) ? countries : String(countries).split(',')
    }
  }

  const [shops, total] = await Promise.all([
    prisma.products.findMany({
      where: filters,
      skip,
      take: parsedLimit,
      include: {
        sellers: true,
        followers: true,
        products: true,
      },
    }),
    prisma.products.count({where: filters})
  ])
  const totalPages = Math.ceil(total / parsedLimit)

  res.json({
    shops,
    pagination: {
      total,
      page: parsedPage,
      totalPages,
    }
  })
  }catch(error){
    next(error)
  }
}

// search const search Products 
export const searchProducts = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = req.query.q as string;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const products = await prisma.products.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            short_description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};

// fetch the corresponding shop details
export const topShops = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Step 1: Aggregate total sales per shop from orders
    const topShopsData = await prisma.orders.groupBy({
      by: ['shopId'],
      _sum: {
        total: true,
      },
      orderBy: {
        _sum: {
          total: 'desc',
        },
      },
      take: 10,
    });

    // Step 2: Fetch the corresponding shop details
    const shopIds = topShopsData.map((item) => item.shopId);
    const shops = await prisma.shops.findMany({
      where: {
        id: {
          in: shopIds,
        },
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        coverBanner: true,
        address: true,
        ratings: true,
        followers: true,
        category: true,
      },
    });

    // Step 3: Merge sales data with shop data
    const enrichedShops = shopIds.map((shopId) => {
      const shop = shops.find((s) => s.id === shopId);
      const salesData = topShopsData.find((s) => s.shopId === shopId);

      return {
        ...shop,
        totalSales: salesData?._sum.total ?? 0,
      };
    });

    return res.status(200).json({ shops: enrichedShops });
  } catch (error) {
    console.error('Error fetching top shops:', error);
    return next(error);
  }
};


