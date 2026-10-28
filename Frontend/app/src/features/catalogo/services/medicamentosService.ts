import { api } from "../../common/http";
import type { Product } from "../domain/products";

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

export async function getMedicamentos(page = 1, limit = 20): Promise<Product[]> {
  const payload = await api.get<unknown>(`/medicamentos?page=${page}&limit=${limit}`);
  return unwrapList(payload).map((medicine) => {
    const category = categoryName(medicine.categorias ?? medicine.categoria);
    return {
      id: typeof medicine.id === "string" ? medicine.id : "",
      name: typeof medicine.nombre === "string" ? medicine.nombre : "Medicamento",
      description: typeof medicine.descripcion === "string" ? medicine.descripcion : "Producto disponible en FarmaYa.",
      price: parsePrice(medicine.precio),
      category,
      emoji: emojiForCategory(category),
      stock: typeof medicine.stock === "number" ? medicine.stock : 0,
    };
  }).filter((medicine) => medicine.id.length > 0);
}
