import type { Product } from "../../catalogo/domain/products";

type CartDrawerProps = {
  open: boolean;
  items: Product[];
  onClose: () => void;
  onRemove: (index: number) => void;
};

export function CartDrawer({
  open,
  items,
  onClose,
  onRemove,
}: CartDrawerProps) {
  if (!open) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <aside
        className="cart-drawer"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="cart-heading">
          <div>
            <p className="eyebrow">TU COMPRA</p>
            <h2>
              Mi carrito <span>({items.length})</span>
            </h2>
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
                    <small>{item.price}</small>
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
                      total + Number(item.price.replace(/[$.]/g, "")),
                    0
                  )
                  .toLocaleString("es-CO")}
              </strong>
            </div>

            <button
              className="primary-button checkout-button"
              onClick={onClose}
            >
              Continuar compra <span>→</span>
            </button>
          </>
        )}
      </aside>
    </div>
  );
}