import { api } from "../../common/http";

export function sendContactMessage(nombre: string, correo: string, mensaje: string) {
  return api.post<{ data: { id: string } }>("/contacto", { nombre, correo, mensaje });
}
