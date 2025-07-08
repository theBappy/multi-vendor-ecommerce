import crypto from "crypto";
import { ValidationError } from "@packages/error-handler";
import { NextFunction } from "express";
import redis from "@packages/libs/prisma/redis";
import { sendEmail } from "./send-mail";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (
  data: any,
  userType: "user" | "seller"
) => {
  const { name, email, password, phone_number, country } = data;

  if (
    !name ||
    !email ||
    !password ||
    (userType === "seller" && (!phone_number || !country))
  ) {
    throw new ValidationError(`Missing required fields`);
  }
  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email format!");
  }
};

export const checkOtpRestriction = async (
  email: string,
  next: NextFunction
) => {
  if (await redis.get(`otp_lock:${email}`)) {
    return next(
      new ValidationError(
        "Account locked due to multiple failed attempts! Try again after 30 minutes"
      )
    );
  }
  if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(
      new ValidationError(
        "Too many OTP requests! Please wait 1hr before requesting again."
      )
    );
  }
  if(await redis.get(`otp_cooldown:${email}`)){
    return next(
        new ValidationError("Please wait 1m before requesting a new OTP!")
    )
  }
};

export const trackOtpRequest = async(email: string, next: NextFunction) => {
    const otpRequestKey = `otp_request_count:${email}`
    let otpRequests = parseInt((await redis.get(otpRequestKey)) || '0')
    if(otpRequests >= 2){
        // lock for 1 hour
        await redis.set(`otp_span_lock:${email}`, "locked", "EX", 3600)
        return next(
            new ValidationError("Too many OTP requests. Please wait 1hr before requesting again!")
        )
    }
    await redis.set(otpRequestKey, otpRequests + 1, 'EX', 3600) // tracking otp request for 1hr
}

export const sendOtp = async (
  name: string,
  email: string,
  template: string
) => {
  const otp = crypto.randomInt(1000, 9999).toString();
  await sendEmail(email, "Verify Your Email", template, { name, otp });
  // associate the top with the specif email for 300ms in redis
  await redis.set(`otp:${email}`, otp, "EX", 300);
  await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);
};


