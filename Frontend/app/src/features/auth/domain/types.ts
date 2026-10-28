export type User = {
  id: string;
  nombre: string;
  email: string;
  role: "cliente" | "supervisor" | "admin";
};

export type LoginRequest = { email: string; password: string };
export type RegisterRequest = LoginRequest & { nombre: string };
export type AuthResponse = { token: string; user: User };
