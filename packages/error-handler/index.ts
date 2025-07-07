// Base App Error
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details: any;

  constructor(
    message: string,
    statusCode: number,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this);
  }
}

// Not Found Error
export class NotFoundError extends AppError {
  constructor(message = "Resources not found") {
    super(message, 404);
  }
}

// Validation Error (e.g., Joi/Zod/Form)
export class ValidationError extends AppError {
  constructor(message = "Invalid request data", details?: any) {
    super(message, 400, true, details);
  }
}

// Authentication Error
export class AuthError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

// Forbidden Access Error
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden access") {
    super(message, 403);
  }
}

// Vendor Action Error (specific to multi-vendor)
export class VendorActionError extends AppError {
  constructor(message = "Unauthorized vendor action") {
    super(message, 403);
  }
}

// Database Error
export class DatabaseError extends AppError {
  constructor(message = "Database error", details?: any) {
    super(message, 500, true, details);
  }
}

// Rate Limiting Error
export class RateLimitError extends AppError {
  constructor(message = "Too many requests, please try again later!") {
    super(message, 429);
  }
}

// Conflict Error (e.g., Duplicate Resources)
export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, 409);
  }
}

// Payment Error
export class PaymentError extends AppError {
  constructor(message = "Payment required or failed", details?: any) {
    super(message, 402, true, details);
  }
}

// Service Unavailable Error
export class ServiceUnavailableError extends AppError {
  constructor(message = "Service temporarily unavailable. Please try again later.") {
    super(message, 503);
  }
}

// Bad Request Error (for non-schema bad requests)
export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}
