import type { Response } from "express";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ResponsePayload<T> {
  statusCode?: number;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

export const sendResponse = <T>(res: Response, { statusCode = 200, message, data, meta }: ResponsePayload<T>) => {
  res.status(statusCode).json({
    success: true,
    message,
    data: data ?? null,
    ...(meta && { meta }),
  });
};

export default sendResponse;
