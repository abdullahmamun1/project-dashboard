import { Prisma } from "../../generated/prisma/client.js";
import { SubmissionStatus } from "../../generated/prisma/enums.js";
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import type { PaginationMeta } from "../../utils/sendResponse.js";
import type { SafeUser } from "../user/user.interface.js";
import type {
  CreateSubmissionInput,
  ReviewSubmissionInput,
  SubmissionListQuery,
  SubmissionStats,
} from "./submission.interface.js";

// Per-student quota, checked against the database so it holds across serverless instances.
export const SUBMISSION_LIMIT = 5;
export const SUBMISSION_WINDOW_MS = 60 * 60 * 1000;

const submissionSelect = {
  id: true,
  projectName: true,
  repoUrl: true,
  liveUrl: true,
  description: true,
  status: true,
  feedback: true,
  reviewedAt: true,
  createdAt: true,
  updatedAt: true,
  student: { select: { id: true, name: true, email: true } },
  reviewedBy: { select: { id: true, name: true } },
} satisfies Prisma.SubmissionSelect;

const isUniqueViolation = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";

const assertWithinRateLimit = async (studentId: string) => {
  const since = new Date(Date.now() - SUBMISSION_WINDOW_MS);
  const recent = await prisma.submission.count({ where: { studentId, createdAt: { gte: since } } });

  if (recent >= SUBMISSION_LIMIT) {
    throw new AppError(429, `You can submit at most ${SUBMISSION_LIMIT} projects per hour. Please try again later.`);
  }
};

/**
 * Duplicate rules: a repository belongs to the first student who submitted it, and it can have
 * only one active (pending or approved) submission. After a rejection, the same student may
 * resubmit it.
 */
const assertNotDuplicate = async (studentId: string, repoUrl: string) => {
  const previous = await prisma.submission.findMany({
    where: { repoUrl },
    select: { studentId: true, status: true },
  });

  if (previous.some((submission) => submission.studentId !== studentId)) {
    throw new AppError(409, "This repository has already been submitted by another student", {
      repoUrl: ["This repository has already been submitted by another student"],
    });
  }

  const active = previous.find((submission) => submission.status !== SubmissionStatus.REJECTED);
  if (active) {
    const message =
      active.status === SubmissionStatus.APPROVED
        ? "This repository has already been approved"
        : "This repository is already submitted and waiting for review";
    throw new AppError(409, message, { repoUrl: [message] });
  }
};

const create = async (student: SafeUser, input: CreateSubmissionInput) => {
  await assertWithinRateLimit(student.id);
  await assertNotDuplicate(student.id, input.repoUrl);

  try {
    return await prisma.submission.create({
      data: { ...input, studentId: student.id },
      select: submissionSelect,
    });
  } catch (error) {
    // Two identical requests racing past the checks above: the partial unique index catches it.
    if (isUniqueViolation(error)) {
      throw new AppError(409, "This repository is already submitted and waiting for review", {
        repoUrl: ["This repository is already submitted and waiting for review"],
      });
    }
    throw error;
  }
};

const getMine = (studentId: string) =>
  prisma.submission.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
    select: submissionSelect,
  });

const list = async ({ page, limit, status, search, sortOrder }: SubmissionListQuery) => {
  const where: Prisma.SubmissionWhereInput = {
    ...(status && { status }),
    ...(search && {
      OR: [
        { projectName: { contains: search, mode: "insensitive" } },
        { student: { name: { contains: search, mode: "insensitive" } } },
        { student: { email: { contains: search, mode: "insensitive" } } },
      ],
    }),
  };

  const [data, total] = await prisma.$transaction([
    prisma.submission.findMany({
      where,
      orderBy: [{ createdAt: sortOrder }, { id: sortOrder }],
      skip: (page - 1) * limit,
      take: limit,
      select: submissionSelect,
    }),
    prisma.submission.count({ where }),
  ]);

  const meta: PaginationMeta = { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
  return { data, meta };
};

const getStats = async (): Promise<SubmissionStats> => {
  const groups = await prisma.submission.groupBy({ by: ["status"], _count: { _all: true } });
  const countOf = (status: SubmissionStatus) => groups.find((group) => group.status === status)?._count._all ?? 0;

  const pending = countOf(SubmissionStatus.PENDING);
  const approved = countOf(SubmissionStatus.APPROVED);
  const rejected = countOf(SubmissionStatus.REJECTED);

  return { total: pending + approved + rejected, pending, approved, rejected };
};

const review = async (id: string, mentor: SafeUser, { status, feedback }: ReviewSubmissionInput) => {
  // Conditional update: only a PENDING submission can be reviewed, so two mentors acting at the
  // same time can't both succeed or overwrite each other's decision.
  const { count } = await prisma.submission.updateMany({
    where: { id, status: SubmissionStatus.PENDING },
    data: { status, feedback: feedback ?? null, reviewedAt: new Date(), reviewedById: mentor.id },
  });

  if (count === 0) {
    const existing = await prisma.submission.findUnique({ where: { id }, select: { status: true } });
    if (!existing) throw new AppError(404, "Submission not found");
    throw new AppError(409, `This submission has already been ${existing.status.toLowerCase()}`);
  }

  return prisma.submission.findUniqueOrThrow({ where: { id }, select: submissionSelect });
};

export const SubmissionService = { create, getMine, list, getStats, review };
