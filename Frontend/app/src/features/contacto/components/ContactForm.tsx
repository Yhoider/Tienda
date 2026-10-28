"use client";

import { useState, type FormEvent } from "react";
import { sendContactMessage } from "../services/contactoService";

export function ContactForm() {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setStatus("");
    setIsSubmitting(true);
    try {
      await sendContactMessage(String(form.get("nombre") ?? ""), String(form.get("correo") ?? ""), String(form.get("mensaje") ?? ""));
      formElement.reset();
      setStatus("Tu mensaje fue enviado. Te responderemos pronto.");
    } catch (reason) {
      setStatus(reason instanceof Error ? reason.message : "No fue posible enviar el mensaje.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <form className="contact-form" onSubmit={handleSubmit}><input name="nombre" placeholder="Tu nombre" required minLength={2} /><input name="correo" type="email" placeholder="Tu correo electrónico" required /><textarea name="mensaje" placeholder="Escribe tu mensaje..." rows={3} required minLength={5} /><button className="primary-button" disabled={isSubmitting}>{isSubmitting ? "Enviando..." : "Enviar mensaje"} <span>→</span></button>{status && <p className="form-status" role="status">{status}</p>}</form>;
}
