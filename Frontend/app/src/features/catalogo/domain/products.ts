export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  emoji: string;
  stock: number;
};

export const categories = [
  ["💊", "Analgésicos", "Para sentirte mejor"],
  ["🌿", "Digestivos", "Cuida tu bienestar"],
  ["🌼", "Alergias", "Respira tranquilo"],
  ["✨", "Bienestar", "Tu cuidado diario"],
] as const;
