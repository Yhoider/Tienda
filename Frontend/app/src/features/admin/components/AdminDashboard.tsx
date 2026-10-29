"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getSavedUser } from "../../auth/services/authService";
import { createAdminUser, createProduct, decideRecipe, getAdminRecipes, getAdminUsers, openRecipe, type AdminRecipe, type AdminUser } from "../services/adminService";

type Section = "resumen" | "usuarios" | "productos" | "recetas";

export function AdminDashboard() {
  const [section, setSection] = useState<Section>("resumen");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [recipes, setRecipes] = useState<AdminRecipe[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const user = getSavedUser();

  async function loadData() {
    setLoading(true);
    try {
      const [usersResponse, recipesResponse] = await Promise.all([getAdminUsers(), getAdminRecipes()]);
      setUsers(usersResponse.data);
      setRecipes(recipesResponse.data);
    } catch (reason) { setMessage(reason instanceof Error ? reason.message : "No fue posible cargar el panel."); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (user?.role === "admin") void loadData(); }, [user?.role]);

  async function submitUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setMessage("");
    try {
      await createAdminUser({ nombre: String(form.get("nombre")), email: String(form.get("email")), password: String(form.get("password")), role: String(form.get("role")) as AdminUser["role"] });
      formElement.reset();
      setMessage("Usuario creado correctamente.");
      await loadData();
    } catch (reason) { setMessage(reason instanceof Error ? reason.message : "No fue posible crear el usuario."); }
  }

  async function submitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setMessage("");
    try {
      await createProduct({ nombre: String(form.get("nombre")), precio: Number(form.get("precio")), descripcion: String(form.get("descripcion") || "") || undefined, stock: Number(form.get("stock")), imagen_url: String(form.get("imagen_url") || "") || undefined });
      formElement.reset();
      setMessage("Producto añadido al catálogo.");
    } catch (reason) { setMessage(reason instanceof Error ? reason.message : "No fue posible crear el producto."); }
  }

  async function reviewRecipe(recipe: AdminRecipe, estado: "aprobada" | "rechazada") {
    setMessage("");
    try {
      await decideRecipe(recipe.id, estado, notes[recipe.id] ?? "");
      setMessage(`Receta ${estado}.`);
      await loadData();
    } catch (reason) { setMessage(reason instanceof Error ? reason.message : "No fue posible actualizar la receta."); }
  }

  if (!user || user.role !== "admin") return <main className="admin-access"><h1>Acceso restringido</h1><p>Este panel está disponible sólo para administradores.</p><a className="primary-button" href="/">Volver a la tienda</a></main>;

  const pendingRecipes = recipes.filter((recipe) => recipe.estado === "pendiente");
  return <main className="admin-shell"><aside className="admin-sidebar"><a className="brand" href="/"><span className="brand-mark">+</span><span>Farma<span className="brand-accent">Ya</span></span></a><p className="admin-label">PANEL ADMINISTRATIVO</p>{([['resumen', 'Resumen'], ['usuarios', 'Usuarios'], ['productos', 'Productos'], ['recetas', 'Recetas']] as const).map(([key, label]) => <button key={key} className={section === key ? "active" : ""} onClick={() => setSection(key)}>{label}{key === "recetas" && pendingRecipes.length > 0 ? <b>{pendingRecipes.length}</b> : null}</button>)}<a className="admin-back" href="/">← Volver a la tienda</a></aside><section className="admin-content"><header><div><p className="eyebrow">ADMINISTRACIÓN</p><h1>{section === "resumen" ? `Hola, ${user.nombre}` : section[0].toUpperCase() + section.slice(1)}</h1></div><span className="admin-role">Administrador</span></header>{message && <p className="admin-message" role="status">{message}</p>}{loading ? <div className="admin-loading">Cargando información...</div> : <>{section === "resumen" && <div className="admin-summary"><article><span>Usuarios</span><strong>{users.length}</strong><small>cuentas registradas</small></article><article><span>Recetas pendientes</span><strong>{pendingRecipes.length}</strong><small>por revisar</small></article><article><span>Productos</span><strong>+</strong><small>agrega productos al catálogo</small><button onClick={() => setSection("productos")}>Añadir producto</button></article></div>}{section === "usuarios" && <div className="admin-grid"><form className="admin-card admin-form" onSubmit={submitUser}><h2>Crear usuario</h2><label>Nombre<input name="nombre" required minLength={2} /></label><label>Correo<input name="email" type="email" required /></label><label>Contraseña<input name="password" type="password" required minLength={8} /></label><label>Rol<select name="role" defaultValue="supervisor"><option value="cliente">Cliente</option><option value="supervisor">Supervisor</option><option value="admin">Administrador</option></select></label><button className="primary-button">Crear usuario</button></form><div className="admin-card admin-table"><h2>Usuarios registrados</h2><table><thead><tr><th>Nombre</th><th>Rol</th><th>Estado</th></tr></thead><tbody>{users.map((item) => <tr key={item.id}><td>{item.nombre}<small>{item.email}</small></td><td><span className="admin-tag">{item.role}</span></td><td>{item.activo ? "Activo" : "Inactivo"}</td></tr>)}</tbody></table></div></div>}{section === "productos" && <form className="admin-card admin-form product-form" onSubmit={submitProduct}><h2>Añadir producto</h2><label>Nombre<input name="nombre" required /></label><label>Precio (COP)<input name="precio" type="number" min="0" required /></label><label>Stock<input name="stock" type="number" min="0" defaultValue="0" required /></label><label>URL de imagen<input name="imagen_url" type="url" placeholder="https://..." /></label><label className="admin-wide">Descripción<textarea name="descripcion" rows={4} /></label><button className="primary-button">Guardar producto</button></form>}{section === "recetas" && <div className="admin-recipes">{recipes.length === 0 ? <div className="admin-card">No hay recetas para revisar.</div> : recipes.map((recipe) => <article className="admin-card recipe-review" key={recipe.id}><div><span className={`recipe-status ${recipe.estado}`}>{recipe.estado}</span><h2>{recipe.user.nombre}</h2><p>{recipe.user.email}</p><small>{new Date(recipe.created_at).toLocaleDateString("es-CO")}</small></div><div className="recipe-actions"><button onClick={() => openRecipe(recipe.id).catch((reason) => setMessage(reason instanceof Error ? reason.message : "No fue posible abrir la receta."))}>Ver archivo</button>{recipe.estado === "pendiente" ? <><textarea value={notes[recipe.id] ?? ""} onChange={(event) => setNotes((current) => ({ ...current, [recipe.id]: event.target.value }))} placeholder="Observación opcional" rows={2} /><div><button className="reject" onClick={() => reviewRecipe(recipe, "rechazada")}>Rechazar</button><button className="approve" onClick={() => reviewRecipe(recipe, "aprobada")}>Aprobar</button></div></> : <p>{recipe.observaciones || "Sin observaciones"}</p>}</div></article>)}</div>}</>}</section></main>;
}
