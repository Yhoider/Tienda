import { API_BASE_URL, AUTH_TOKEN_KEY } from "../../common/config";
import { ApiError, api } from "../../common/http";

export type AdminUser = { id: string; nombre: string; email: string; role: "cliente" | "supervisor" | "admin"; activo: boolean; created_at: string };
export type AdminRecipe = { id: string; estado: string; observaciones: string | null; created_at: string; archivo_url: string; user: { nombre: string; email: string } };
type AdminUserInput = { nombre: string; email: string; password: string; role: AdminUser["role"] };
type ProductInput = { nombre: string; precio: number; descripcion?: string; stock?: number; imagen_url?: string };

export const getAdminUsers = () => api.get<{ data: AdminUser[] }>("/admin/usuarios");
export const createAdminUser = (input: AdminUserInput) => api.post<{ data: AdminUser }>("/admin/usuarios", input);
export const getAdminRecipes = () => api.get<{ data: AdminRecipe[] }>("/admin/recetas");
export const decideRecipe = (id: string, estado: "aprobada" | "rechazada", observaciones: string) => api.patch<{ data: AdminRecipe }>(`/admin/recetas/${id}`, { estado, observaciones });
export const createProduct = (input: ProductInput) => api.post<{ data: { id: string } }>("/medicamentos", input);

export async function openRecipe(id: string) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const response = await fetch(`${API_BASE_URL}/recetas/${id}/archivo`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if (!response.ok) throw new ApiError(response.status, "No fue posible abrir la receta.");
  const fileUrl = URL.createObjectURL(await response.blob());
  window.open(fileUrl, "_blank", "noopener");
  window.setTimeout(() => URL.revokeObjectURL(fileUrl), 60_000);
}
