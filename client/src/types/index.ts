export type Role = "STUDENT" | "MENTOR";

export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Submission {
  id: string;
  projectName: string;
  repoUrl: string;
  liveUrl: string;
  description: string;
  status: SubmissionStatus;
  feedback: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  student: Pick<User, "id" | "name" | "email">;
  reviewedBy: Pick<User, "id" | "name"> | null;
}

export interface SubmissionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export type StatusFilter = SubmissionStatus | "ALL";

export interface SubmissionListParams {
  page: number;
  limit: number;
  status: StatusFilter;
  search: string;
}
