import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import type { SubmissionListQuery } from "./submission.interface.js";
import { SubmissionService } from "./submission.service.js";

const create = catchAsync(async (req, res) => {
  const result = await SubmissionService.create(req.user!, req.body);
  sendResponse(res, { statusCode: 201, message: "Project submitted successfully", data: result });
});

const getMine = catchAsync(async (req, res) => {
  const result = await SubmissionService.getMine(req.user!.id);
  sendResponse(res, { message: "Your submissions retrieved successfully", data: result });
});

const list = catchAsync(async (req, res) => {
  const { data, meta } = await SubmissionService.list(req.query as unknown as SubmissionListQuery);
  sendResponse(res, { message: "Submissions retrieved successfully", data, meta });
});

const getStats = catchAsync(async (_req, res) => {
  const result = await SubmissionService.getStats();
  sendResponse(res, { message: "Submission statistics retrieved successfully", data: result });
});

const review = catchAsync(async (req, res) => {
  const result = await SubmissionService.review(req.params.id as string, req.user!, req.body);
  sendResponse(res, { message: `Submission ${result.status.toLowerCase()} successfully`, data: result });
});

export const SubmissionController = { create, getMine, list, getStats, review };
