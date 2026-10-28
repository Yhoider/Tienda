"use client";

import { useState } from "react";
import { SearchBar } from "./SearchBar";
import type { User } from "../../auth/domain/types";

type SiteHeaderProps = {
  query: string;
  onQueryChange: (query: string) => void;
  cartCount: number;
  onCartClick: () => void;
  menuOpen: boolean;
  onMenuToggle: () => void;
  onNavigate: () => void;
  darkMode: boolean;
  onThemeToggle: () => void;
  onAuthClick: () => void;
  onLogout: () => void;
  user: User | null;
};

export function SiteHeader({ query, onQueryChange, cartCount, onCartClick, menuOpen, onMenuToggle, onNavigate, darkMode, onThemeToggle, onAuthClick, onLogout, user }: SiteHeaderProps) {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  function handleLogout() {
    setAccountMenuOpen(false);
    onLogout();
  }

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
        <button aria-label={darkMode ? "Activar modo claro" : "Activar modo oscuro"} onClick={onThemeToggle}>{darkMode ? "☀" : "◐"}</button>
        <button aria-label={`Carrito con ${cartCount} productos`} onClick={onCartClick}>🛒 <b>{cartCount}</b></button>
      </div>
      {user ? <div className="account-menu"><button className="account-button is-authenticated" aria-expanded={accountMenuOpen} aria-haspopup="menu" onClick={() => setAccountMenuOpen((open) => !open)}><small>{user.nombre}</small><span aria-hidden="true">⌄</span></button>{accountMenuOpen && <div className="account-dropdown" role="menu"><button role="menuitem" onClick={handleLogout}>Cerrar sesión</button></div>}</div> : <button className="account-button" aria-label="Iniciar sesión" onClick={onAuthClick}><span>♙</span><small>Ingresar</small></button>}
    </header>
  );
}
