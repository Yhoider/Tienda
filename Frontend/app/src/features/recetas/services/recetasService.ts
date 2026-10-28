import { api } from "../../common/http";

export function uploadRecipe(file: File) {
  return api.postRaw<{ data: { id: string; archivo_url: string } }>("/recetas", file, {
    "Content-Type": file.type,
  });
}
