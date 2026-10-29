type ProductCardProps = {
  name: string;
  description: string;
  price: number;
  category: string;
  emoji: string;
  stock: number;
  imageUrl?: string;
  onAdd: () => void;
};

export function ProductCard({
  name,
  description,
  price,
  category,
  emoji,
  stock,
  imageUrl,
  onAdd,
}: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-art">
        {imageUrl ? <img src={imageUrl} alt={`Imagen de ${name}`} /> : <span aria-hidden="true">{emoji}</span>}
      </div>
      <div className="product-copy">
        <p className="product-category">{category}</p>
        <h3>{name}</h3>
        <p>{description}</p>
        <div className="product-footer">
          <strong>${price.toLocaleString("es-CO")}</strong>
          <button className="small-button" onClick={onAdd} disabled={stock < 1}>
            {stock > 0 ? <>Agregar <span>＋</span></> : "Agotado"}
          </button>
        </div>
      </div>
    </article>
  );
}
