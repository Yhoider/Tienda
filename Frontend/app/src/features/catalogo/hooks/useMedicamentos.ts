"use client";

import { useEffect, useState } from "react";
import type { CatalogPage } from "../domain/products";
import { getMedicamentos } from "../services/medicamentosService";

export function useMedicamentos(page: number, categoria: string) {
  const [catalog, setCatalog] = useState<CatalogPage>({ items: [], page: 1, totalPages: 1, total: 0 });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError("");
    getMedicamentos(page, 6, categoria)
      .then((nextCatalog) => { if (active) setCatalog(nextCatalog); })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "No fue posible cargar el catálogo."))
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [page, categoria]);

  return { ...catalog, error, isLoading };
}
