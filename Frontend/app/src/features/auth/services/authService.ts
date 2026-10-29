import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../../common/config";
import { ApiError, api } from "../../common/http";
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "../domain/types";

type RawAuthResponse = { token?: string; accessToken?: string; user?: User; usuario?: User; data?: RawAuthResponse };

function normalizeAuthResponse(response: RawAuthResponse): AuthResponse {
  const payload = response.data ?? response;
  const token = payload.token ?? payload.accessToken;
  const user = payload.user ?? payload.usuario;
  if (!token || !user) throw new ApiError(0, "La respuesta de autenticación no contiene token o usuario.");
  return { token, user };
}

function saveSession({ token, user }: AuthResponse) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export async function login(credentials: LoginRequest) {
  const response = normalizeAuthResponse(await api.post<RawAuthResponse>("/auth/login", credentials));
  saveSession(response);
  return response;
}

export async function register(user: RegisterRequest) {
  const response = normalizeAuthResponse(await api.post<RawAuthResponse>("/auth/register", user));
  saveSession(response);
  return response;
}

export function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getSavedUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(AUTH_USER_KEY) ?? "null");
    if (!parsed || typeof parsed !== "object") return null;
    const user = parsed as Partial<User>;
    return typeof user.id === "string" && typeof user.nombre === "string" && typeof user.email === "string" && (user.role === "cliente" || user.role === "supervisor" || user.role === "admin") ? user as User : null;
  } catch { return null; }
}
