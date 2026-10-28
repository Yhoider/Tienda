import { api } from "../../common/http";
import type { CatalogPage, Product } from "../domain/products";

type ApiMedicine = Record<string, unknown>;

function categoryName(value: unknown) {
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && "nombre" in value && typeof value.nombre === "string") return value.nombre;
  return "Cuidado";
}

function parsePrice(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : 0;
}

function emojiForCategory(category: string) {
  const normalized = category.toLowerCase();
  if (normalized.includes("analg")) return "💊";
  if (normalized.includes("digest")) return "🌿";
  if (normalized.includes("alerg")) return "🌼";
  if (normalized.includes("bienestar")) return "✨";
  return "🫧";
}

function unwrapList(payload: unknown): ApiMedicine[] {
  if (Array.isArray(payload)) return payload as ApiMedicine[];
  if (typeof payload !== "object" || payload === null) return [];
  const data = payload as Record<string, unknown>;
  const list = data.data ?? data.medicamentos ?? data.items;
  return Array.isArray(list) ? list as ApiMedicine[] : [];
}

function pagination(payload: unknown) {
  if (typeof payload !== "object" || payload === null || !("pagination" in payload)) return { page: 1, totalPages: 1, total: 0 };
  const value = payload.pagination;
  if (typeof value !== "object" || value === null) return { page: 1, totalPages: 1, total: 0 };
  const data = value as Record<string, unknown>;
  return {
    page: typeof data.page === "number" ? data.page : 1,
    totalPages: typeof data.totalPages === "number" ? data.totalPages : 1,
    total: typeof data.total === "number" ? data.total : 0,
  };
}

export async function getMedicamentos(page = 1, limit = 6, categoria = ""): Promise<CatalogPage> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (categoria) params.set("categoria", categoria);
  const payload = await api.get<unknown>(`/medicamentos?${params}`);
  const items = unwrapList(payload).map((medicine) => {
    const category = categoryName(medicine.categorias ?? medicine.categoria);
    return {
      id: typeof medicine.id === "string" ? medicine.id : "",
      name: typeof medicine.nombre === "string" ? medicine.nombre : "Medicamento",
      description: typeof medicine.descripcion === "string" ? medicine.descripcion : "Producto disponible en FarmaYa.",
      price: parsePrice(medicine.precio),
      category,
      emoji: emojiForCategory(category),
      stock: typeof medicine.stock === "number" ? medicine.stock : 0,
      imageUrl: typeof medicine.imagen_url === "string" && medicine.imagen_url ? medicine.imagen_url : undefined,
    };
  }).filter((medicine) => medicine.id.length > 0);
  return { items, ...pagination(payload) };
}
