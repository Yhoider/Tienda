"use client";

import { useEffect, useState } from "react";
import type { Product } from "../domain/products";
import { getMedicamentos } from "../services/medicamentosService";

export function useMedicamentos() {
  const [medicamentos, setMedicamentos] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMedicamentos()
      .then(setMedicamentos)
      .catch((reason) => setError(reason instanceof Error ? reason.message : "No fue posible cargar el catálogo."))
      .finally(() => setIsLoading(false));
  }, []);

  return { medicamentos, error, isLoading };
}
