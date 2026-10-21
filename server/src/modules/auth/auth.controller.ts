import { clearAuthCookie, setAuthCookie } from "../../utils/authCookies.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { AuthService } from "./auth.service.js";

const register = catchAsync(async (req, res) => {
  const result = await AuthService.register(req.body);
  setAuthCookie(res, result.accessToken);
  sendResponse(res, { statusCode: 201, message: "Account created successfully", data: result });
});

const login = catchAsync(async (req, res) => {
  const result = await AuthService.login(req.body);
  setAuthCookie(res, result.accessToken);
  sendResponse(res, { message: "Logged in successfully", data: result });
});

const logout = catchAsync(async (_req, res) => {
  clearAuthCookie(res);
  sendResponse(res, { message: "Logged out successfully" });
});

const me = catchAsync(async (req, res) => {
  sendResponse(res, { message: "Current user retrieved successfully", data: req.user });
});

export const AuthController = { register, login, logout, me };
