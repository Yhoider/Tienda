"use client";

import { useMemo, useState } from "react";
import { CartDrawer } from "./src/features/common/components/CartDrawer";
import { SectionHeading } from "./src/features/common/components/SectionHeading";
import { SiteHeader } from "./src/features/common/components/SiteHeader";
import { AuthModal } from "./src/features/auth/components/AuthModal";
import { useAuth } from "./src/features/auth/hooks/useAuth";
import { ContactForm } from "./src/features/contacto/components/ContactForm";
import { categories, type Product } from "./src/features/catalogo/domain/products";
import { ProductCard } from "./src/features/catalogo/components/ProductCard";
import { useMedicamentos } from "./src/features/catalogo/hooks/useMedicamentos";
import { createOrder } from "./src/features/pedidos/services/pedidosService";
import { RecipeForm } from "./src/features/recetas/components/RecipeForm";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const auth = useAuth();
  const { medicamentos, error: catalogError, isLoading: isCatalogLoading } = useMedicamentos();
  const filters = useMemo(
    () => ["Todos", ...new Set(medicamentos.map((product) => product.category))],
    [medicamentos],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return medicamentos.filter((product) => {
      const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
      const matchesQuery = !normalizedQuery || `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, medicamentos, query]);

  const addToCart = (product: Product) => setCartItems((items) => [...items, product]);
  const removeFromCart = (index: number) => setCartItems((items) => items.filter((_, itemIndex) => itemIndex !== index));
  const closeMenu = () => setMenuOpen(false);
  const checkout = async (direccionEntrega: string) => {
    await createOrder(cartItems, direccionEntrega.trim());
    setCartItems([]);
    setCartOpen(false);
  };

  return (
    <div className={darkMode ? "storefront dark-mode" : "storefront"}>
      <SiteHeader query={query} onQueryChange={setQuery} cartCount={cartItems.length} onCartClick={() => setCartOpen(true)} menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((open) => !open)} onNavigate={closeMenu} darkMode={darkMode} onThemeToggle={() => setDarkMode((enabled) => !enabled)} onAuthClick={() => setAuthOpen(true)} onLogout={auth.logout} user={auth.user} />
      <main>
        <section className="hero" id="inicio">
          <div className="hero-content"><p className="eyebrow">TU SALUD, MÁS FÁCIL</p><h1>Encuentra lo que necesitas para cuidar tu <em>salud</em></h1><p>Compra productos de salud de forma rápida y sencilla. Estamos contigo en cada paso de tu bienestar.</p><a className="primary-button" href="#catalogo">Ver medicamentos <span>→</span></a></div>
          <div className="hero-visual"><div className="sun-orb" /><div className="hero-bottle">✚</div><div className="hero-note">Cuidado<br /><strong>para ti</strong> ✨</div></div>
        </section>

        <section className="category-strip"><SectionHeading eyebrow="EXPLORA POR CATEGORÍA" title="Todo para sentirte bien" /><div className="category-grid">{categories.map(([icon, title, sub]) => <button className="category-card" key={title} onClick={() => { setActiveCategory(title); document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" }); }}><span className="category-icon">{icon}</span><strong>{title}</strong><small>{sub}</small></button>)}</div></section>

        <section className="catalog-section" id="catalogo"><div className="catalog-header"><SectionHeading eyebrow="CATÁLOGO" title="Medicamentos y productos" description={query ? `Resultados para “${query}”` : "Seleccionados pensando en tu bienestar."} /><div className="filter-pills">{filters.map((category) => <button className={activeCategory === category ? "active" : ""} key={category} onClick={() => setActiveCategory(category)}>{category}</button>)}</div></div>{isCatalogLoading ? <div className="no-results"><strong>Cargando catálogo...</strong></div> : catalogError ? <div className="no-results"><strong>No pudimos cargar el catálogo</strong><p>{catalogError}</p></div> : filteredProducts.length ? <div className="product-grid">{filteredProducts.map((product) => <ProductCard key={product.id} {...product} onAdd={() => addToCart(product)} />)}</div> : <div className="no-results"><span>⌕</span><strong>No encontramos productos</strong><p>Prueba con otro nombre o categoría.</p><button className="small-button" onClick={() => { setQuery(""); setActiveCategory("Todos"); }}>Ver todo el catálogo</button></div>}</section>

        <section className="prescription" id="recetas"><div><p className="eyebrow">RECETAS MÉDICAS FÁCIL</p><h2>Carga tu receta sin complicaciones</h2><p>Algunos medicamentos requieren receta médica. Envíanos el archivo y nosotros nos encargamos del resto.</p><div className="trust-row"><span>✓ <b>Seguro</b></span><span>⚡ <b>Rápido</b></span><span>♡ <b>Fácil</b></span></div></div><RecipeForm isAuthenticated={Boolean(auth.user)} onRequireAuthentication={() => setAuthOpen(true)} /></section>

        <section className="contact-section" id="contacto"><SectionHeading eyebrow="CONTACTO" title="¿Necesitas ayuda?" description="Escríbenos y te ayudaremos con tu solicitud." /><ContactForm /></section>
      </main>
      <footer><div className="brand"><span className="brand-mark">+</span><span>Farma<span className="brand-accent">Ya</span></span></div><p>Tu salud, más fácil.</p><div className="footer-links"><a href="#catalogo">Medicamentos</a><a href="#recetas">Recetas</a><a href="#contacto">Ayuda</a></div><small>© 2026 FarmaYa. Todos los derechos reservados.</small></footer>
      <CartDrawer open={cartOpen} items={cartItems} onClose={() => setCartOpen(false)} onRemove={removeFromCart} isAuthenticated={Boolean(auth.user)} onRequireAuthentication={() => { setCartOpen(false); setAuthOpen(true); }} onCheckout={checkout} />
      <AuthModal open={authOpen} loading={auth.isLoading} onClose={() => setAuthOpen(false)} onLogin={auth.login} onRegister={auth.register} />
    </div>
  );
}
