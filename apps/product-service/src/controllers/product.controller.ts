import { NotFoundError, ValidationError } from "@packages/error-handler";
import prisma from "@packages/libs/prisma";
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
        new ValidationError("Discount code already exists. Please use a different code.")
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
) =>{
  try {
    const discount_codes = await prisma.discount_codes.findMany({
      where: {
        sellerId: req.seller.id,
      }
    })
    return res.status(200).json({
      success: true,
      discount_codes,
    })
  } catch (error) {
    return next(error)
  }
}

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
      where: {id},
      select: {id: true, sellerId: true}
    })
    if(!discountCode){
      return next(new NotFoundError('Discount code not found!'))
    }
    if(discountCode.sellerId !== sellerId){
      return next(new ValidationError('Unauthorized access!'))
    }

    await prisma.discount_codes.delete({where: { id }})

    return res.status(200).json({message: 'Discount code successfully deleted'})

  } catch (error) {
    return next(error)
    
  }
}