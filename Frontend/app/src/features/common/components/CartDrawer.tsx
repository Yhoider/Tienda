import { useState } from "react";
import type { Product } from "../../catalogo/domain/products";

type CartDrawerProps = {
  open: boolean;
  items: Product[];
  onClose: () => void;
  onRemove: (index: number) => void;
  isAuthenticated: boolean;
  onRequireAuthentication: () => void;
  onCheckout: (address: string) => Promise<void>;
};

export function CartDrawer({
  open,
  items,
  onClose,
  onRemove,
  isAuthenticated,
  onRequireAuthentication,
  onCheckout,
}: CartDrawerProps) {
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    if (!isAuthenticated) {
      onRequireAuthentication();
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await onCheckout(address);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No fue posible crear el pedido.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={open ? "cart-overlay is-open" : "cart-overlay"} onClick={onClose} aria-hidden={!open}>
      <aside
        className={open ? "cart-drawer is-open" : "cart-drawer"}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="cart-heading">
          <div>
            <p className="eyebrow">TU COMPRA</p>
            <h2>Mi carrito</h2>
          </div>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Cerrar carrito"
          >
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className="empty-cart">
            <span>🛒</span>
            <strong>Tu carrito está vacío</strong>
            <p>Agrega productos para verlos aquí.</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item, index) => (
                <div
                  className="cart-item"
                  key={`${item.name}-${index}`}
                >
                  <span className="cart-item-art">{item.emoji}</span>
                  <div>
                    <strong>{item.name}</strong>
                    <small>${item.price.toLocaleString("es-CO")}</small>
                  </div>
                  <button
                    onClick={() => onRemove(index)}
                    aria-label={`Quitar ${item.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-total">
              <span>Total estimado</span>
              <strong>
                $
                {items
                  .reduce(
                    (total, item) =>
                      total + item.price,
                    0
                  )
                  .toLocaleString("es-CO")}
              </strong>
            </div>

            {isAuthenticated && <label className="checkout-address">Dirección de entrega<input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Calle 10 # 20-30, Bogotá" required minLength={5} /></label>}
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="primary-button checkout-button" onClick={handleCheckout} disabled={isSubmitting || (isAuthenticated && address.trim().length < 5)}>
              {isSubmitting ? "Creando pedido..." : isAuthenticated ? "Confirmar pedido" : "Inicia sesión para comprar"} <span>→</span>
            </button>
          </>
        )}
      </aside>
    </div>
  );
}
