type ProductCardProps = {
  name: string;
  description: string;
  price: string;
  category: string;
  emoji: string;
  onAdd: () => void;
};

export function ProductCard({
  name,
  description,
  price,
  category,
  emoji,
  onAdd,
}: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-art" aria-hidden="true">
        <span>{emoji}</span>
      </div>
      <div className="product-copy">
        <p className="product-category">{category}</p>
        <h3>{name}</h3>
        <p>{description}</p>
        <div className="product-footer">
          <strong>{price}</strong>
          <button className="small-button" onClick={onAdd}>
            Agregar <span>＋</span>
          </button>
        </div>
      </div>
    </article>
  );
}