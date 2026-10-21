import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import config from "../config/index.js";
import { Prisma } from "../generated/prisma/client.js";
import AppError from "../utils/AppError.js";

const zodFieldErrors = (error: ZodError) => {
  const errors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "root";
    (errors[key] ??= []).push(issue.message);
  }
  return errors;
};

export const notFound: RequestHandler = (req, _res, next) => {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errors: Record<string, string[]> | undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    errors = zodFieldErrors(err);
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 409;
      message = "A record with these details already exists";
    } else if (err.code === "P2025") {
      statusCode = 404;
      message = "Record not found";
    }
  } else if (err?.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Malformed JSON body";
  }

  if (statusCode >= 500) console.error(err);

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(!config.isProduction && statusCode >= 500 && { stack: err?.stack }),
  });
};

export default globalErrorHandler;
