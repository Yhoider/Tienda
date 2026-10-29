export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  emoji: string;
  stock: number;
  imageUrl?: string;
};

export type CatalogPage = {
  items: Product[];
  page: number;
  totalPages: number;
  total: number;
};

export const categories = [
  ["💊", "Analgésicos", "Para sentirte mejor"],
  ["🩹", "Antiinflamatorios", "Alivio para el dolor"],
  ["🌼", "Antialérgicos", "Respira tranquilo"],
  ["🌿", "Digestivos", "Cuida tu bienestar"],
  ["✨", "Vitaminas", "Tu cuidado diario"],
] as const;

export const catalogFilters = ["Todos", ...categories.map(([, name]) => name)];
