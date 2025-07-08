import { NextFunction, Request, Response } from "express";
import { checkOtpRestriction, sendOtp, trackOtpRequest, validateRegistrationData } from "../utils/auth.helper";
import { ValidationError } from "@packages/error-handler";
import prisma from "@packages/libs/prisma";

// register a new user
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
        validateRegistrationData(req.body, 'user')
    const {name, email} = req.body

    const existingUser = await prisma.users.findUnique({where: email})
    if(existingUser){
        return next(new ValidationError('User already exists with these email!'))
    }

    await checkOtpRestriction(email, next)
    await trackOtpRequest(email, next)
    await sendOtp(email, name, 'user-activation-mail')

    res.status(200).json({
        message: 'OTP has been sent to email. Please verify your account.'
    })
    } catch (error) {
        return next(error)
    }

};
