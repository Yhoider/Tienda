import { api } from "../../common/http";
import type { Product } from "../../catalogo/domain/products";

type OrderResponse = { data: { id: string } };

export async function createOrder(items: Product[], direccionEntrega: string) {
  const quantities = new Map<string, number>();
  for (const item of items) quantities.set(item.id, (quantities.get(item.id) ?? 0) + 1);
  return api.post<OrderResponse>("/pedidos", {
    direccionEntrega,
    items: [...quantities].map(([medicamentoId, cantidad]) => ({ medicamentoId, cantidad })),
  });
}
