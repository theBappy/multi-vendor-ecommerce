import { NextFunction, Response } from "express";
import { AuthError, ValidationError, NotFoundError } from "@packages/error-handler";
import prisma from "@packages/libs/prisma";

// Add new address
export const addUserAddress = async (
  req: any, 
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return next(new AuthError("Unauthorized user"));
    }

    const { label, name, street, city, zip, country, isDefault } = req.body;

    // Basic field validation
    if (!label || !name || !street || !city || !zip || !country) {
      return next(new ValidationError("All fields are required"));
    }

    // If the new address is marked as default, unset previous default
    if (isDefault) {
      await prisma.userAddress.updateMany({
        where: {
          userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    // Create new address
    const newAddress = await prisma.userAddress.create({
      data: {
        userId,
        label,
        name,
        street,
        city,
        zip,
        country,
        isDefault: Boolean(isDefault),
      },
    });

    // Success response
    return res.status(201).json({
      success: true,
      address: newAddress,
    });
  } catch (error) {
    return next(error);
  }
};

// delete user address
export const deleteUserAddress = async (
  req: any, 
  res: Response,
  next: NextFunction
) => {
    try{
        const userId = req.user?.id
        const {addressId} = req.params

        if(!addressId){
            return next(new ValidationError('Address ID is required'))
        }
        const existingAddress = await prisma.userAddress.findFirst({
            where: {
                id: addressId,
                userId,
            }
        })
        if(!existingAddress) return next(new NotFoundError('Address not found or unauthorized'))
        await prisma.userAddress.delete({
            where: {
                id: addressId,
            }
        })
        return res.status(200).json({
            success: true,
            message: 'Address deleted successfully'
        })
    }catch(error){
        return next(error)
    }
}

// get user address
export const getUserAddress = async (
  req: any, 
  res: Response,
  next: NextFunction
) => {
    try{
        const userId = req.user?.id
        const addresses = await prisma.userAddress.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return res.status(200).json({
            success: true,
            addresses,
        })
    }catch(error){
        return next(error)
    }
}
