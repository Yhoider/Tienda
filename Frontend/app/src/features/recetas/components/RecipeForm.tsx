"use client";

import { useState, type FormEvent } from "react";
import { uploadRecipe } from "../services/recetasService";

type RecipeFormProps = {
  isAuthenticated: boolean;
  onRequireAuthentication: () => void;
};

export function RecipeForm({ isAuthenticated, onRequireAuthentication }: RecipeFormProps) {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    if (!isAuthenticated) {
      onRequireAuthentication();
      return;
    }
    const file = new FormData(formElement).get("receta");
    if (!(file instanceof File) || file.size === 0) {
      setStatus("Selecciona una receta en PDF, JPG o PNG.");
      return;
    }
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setStatus("El archivo debe ser PDF, JPG o PNG y no superar 5 MB.");
      return;
    }
    setStatus("");
    setIsSubmitting(true);
    try {
      await uploadRecipe(file);
      formElement.reset();
      setStatus("Receta recibida. La revisaremos pronto.");
    } catch (reason) {
      setStatus(reason instanceof Error ? reason.message : "No fue posible subir la receta.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <form className="recipe-form" onSubmit={handleSubmit}><label>Adjunta tu receta<input name="receta" type="file" accept="application/pdf,image/jpeg,image/png" required /></label><button className="primary-button" disabled={isSubmitting}>{isSubmitting ? "Subiendo..." : isAuthenticated ? "Subir receta" : "Inicia sesión para subirla"} <span>↗</span></button>{status && <p className="form-status" role="status">{status}</p>}</form>;
}
