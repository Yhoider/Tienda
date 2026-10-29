import { API_BASE_URL, AUTH_TOKEN_KEY } from "./config";

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: object | BodyInit | null;
  headers?: HeadersInit;
};

function getToken() {
  return typeof window === "undefined" ? null : localStorage.getItem(AUTH_TOKEN_KEY);
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  const contentType = response.headers.get("content-type") ?? "";
  return contentType.includes("application/json") ? response.json() : response.text();
}

function getErrorMessage(data: unknown) {
  if (typeof data === "object" && data !== null && "error" in data) {
    const error = data.error;
    if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") return error.message;
  }
  return "No fue posible completar la solicitud.";
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!API_BASE_URL) throw new ApiError(0, "Falta configurar NEXT_PUBLIC_API_URL.");

  const headers = new Headers(options.headers);
  const token = getToken();
  const isJson = options.body !== null && typeof options.body === "object" && !(options.body instanceof FormData) && !(options.body instanceof URLSearchParams) && !(options.body instanceof Blob);

  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (isJson && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers, body: isJson ? JSON.stringify(options.body) : options.body });
  const data = await parseBody(response);

  if (!response.ok) throw new ApiError(response.status, getErrorMessage(data));
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: object) => request<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body: object) => request<T>(path, { method: "PATCH", body }),
  postRaw: <T>(path: string, body: BodyInit, headers: HeadersInit) => request<T>(path, { method: "POST", body, headers }),
};
