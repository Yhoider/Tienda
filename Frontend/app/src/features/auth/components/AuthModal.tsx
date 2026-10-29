"use client";

import { type FormEvent, useState } from "react";
import type { LoginRequest, RegisterRequest, User } from "../domain/types";

type AuthModalProps = {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onLogin: (credentials: LoginRequest) => Promise<User>;
  onRegister: (credentials: RegisterRequest) => Promise<User>;
};

export function AuthModal({ open, loading, onClose, onLogin, onRegister }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const nombre = String(form.get("nombre") ?? "");
    setError("");

    try {
      if (mode === "login") await onLogin({ email, password });
      else await onRegister({ nombre, email, password });
      formElement.reset();
      setError("");
      onClose();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No fue posible autenticarte.");
    }
  }

  const changeMode = (nextMode: "login" | "register") => { setMode(nextMode); setError(""); };

  return (
    <div className={open ? "auth-overlay is-open" : "auth-overlay"} onClick={onClose} aria-hidden={!open}>
      <section className={open ? "auth-modal is-open" : "auth-modal"} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="auth-close" onClick={onClose} aria-label="Cerrar autenticación">×</button>
        <div className="auth-intro"><span className="auth-icon">♙</span><p className="eyebrow">FARMAYA</p><h2 id="auth-title">{mode === "login" ? "Bienvenido de nuevo" : "Crea tu cuenta"}</h2><p>{mode === "login" ? "Ingresa para continuar cuidando tu salud." : "Regístrate y disfruta una experiencia más personal."}</p></div>
        <div className="auth-tabs"><button type="button" className={mode === "login" ? "active" : ""} onClick={() => changeMode("login")}>Iniciar sesión</button><button type="button" className={mode === "register" ? "active" : ""} onClick={() => changeMode("register")}>Registrarme</button></div>
        <form className="auth-form" onSubmit={handleSubmit} key={mode}>
          {mode === "register" && <label>Nombre completo<input name="nombre" placeholder="Tu nombre" autoComplete="name" required /></label>}
          <label>Correo electrónico<input name="email" type="email" placeholder="correo@ejemplo.com" autoComplete="email" required /></label>
          <label>Contraseña<input name="password" type="password" placeholder="••••••••" autoComplete={mode === "login" ? "current-password" : "new-password"} required /></label>
          {mode === "register" && <label className="auth-check"><input type="checkbox" required /> Acepto los términos y condiciones</label>}
          {mode === "login" && <a className="forgot-password" href="#contacto">¿Olvidaste tu contraseña?</a>}
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="primary-button auth-submit" type="submit" disabled={loading}>{loading ? "Procesando..." : mode === "login" ? "Iniciar sesión" : "Crear cuenta"}<span>→</span></button>
        </form>
        <p className="auth-switch">{mode === "login" ? "¿Aún no tienes una cuenta?" : "¿Ya tienes una cuenta?"} <button type="button" onClick={() => changeMode(mode === "login" ? "register" : "login")}>{mode === "login" ? "Regístrate" : "Inicia sesión"}</button></p>
      </section>
    </div>
  );
}
