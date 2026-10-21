import type { NextFunction, Request, RequestHandler, Response } from "express";

// Express 5 forwards rejected promises on its own; this keeps controllers uniformly typed
// and makes the intent explicit.
export const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default catchAsync;
