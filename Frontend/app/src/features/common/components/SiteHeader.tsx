import { SearchBar } from "./SearchBar";

type SiteHeaderProps = {
  query: string;
  onQueryChange: (query: string) => void;
  cartCount: number;
  onCartClick: () => void;
  menuOpen: boolean;
  onMenuToggle: () => void;
  onNavigate: () => void;
};

export function SiteHeader({ query, onQueryChange, cartCount, onCartClick, menuOpen, onMenuToggle, onNavigate }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <a className="brand" href="#inicio">
        <span className="brand-mark">+</span>
        <span>Farma<span className="brand-accent">Ya</span></span>
      </a>
      <button className="menu-toggle" onClick={onMenuToggle} aria-label="Abrir menú">☰</button>
      <nav className={menuOpen ? "nav-links is-open" : "nav-links"}>
        <a href="#inicio" onClick={onNavigate}>Inicio</a>
        <a href="#catalogo" onClick={onNavigate}>Medicamentos</a>
        <a href="#recetas" onClick={onNavigate}>Recetas</a>
        <a href="#contacto" onClick={onNavigate}>Contacto</a>
      </nav>
      <SearchBar value={query} onChange={onQueryChange} />
      <div className="header-actions">
        <button aria-label="Cambiar tema">◐</button>
        <button aria-label={`Carrito con ${cartCount} productos`} onClick={onCartClick}>🛒 <b>{cartCount}</b></button>
      </div>
    </header>
  );
}
