import type { RequestHandler } from "express";
import type { ZodType } from "zod";

interface RequestSchemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

// Parses and replaces req.body/query/params with the validated (and coerced/trimmed) values.
// Zod errors are formatted by the global error handler.
export const validateRequest =
  (schemas: RequestSchemas): RequestHandler =>
  (req, _res, next) => {
    if (schemas.body) req.body = schemas.body.parse(req.body ?? {});
    // Express 5 exposes req.query as a getter, so it has to be redefined rather than assigned.
    if (schemas.query) {
      Object.defineProperty(req, "query", {
        value: schemas.query.parse(req.query),
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }
    if (schemas.params) req.params = schemas.params.parse(req.params) as typeof req.params;
    next();
  };

export default validateRequest;
