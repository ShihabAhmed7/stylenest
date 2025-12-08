import { http } from "./http";

// Helper to always use the latest token from localStorage
function authHeaders() {
  const token = localStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* -------- Auth -------- */
export async function adminLogin(email, password) {
  const res = await http.post("/auth/admin/login", { email, password });
  return res.data; // { token, admin: {id,email} }
}

/* -------- Metrics -------- */
export async function getAdminMetrics() {
  const res = await http.get("/admin/metrics", { headers: authHeaders() });
  return res.data;
}

/* -------- Products CRUD -------- */
export async function adminListProducts() {
  const res = await http.get("/admin/products", { headers: authHeaders() });
  return res.data;
}

export async function adminCreateProduct(payload) {
  const res = await http.post("/admin/products", payload, {
    headers: authHeaders(),
  });
  return res.data;
}

export async function adminUpdateProduct(id, payload) {
  const res = await http.put(`/admin/products/${id}`, payload, {
    headers: authHeaders(),
  });
  return res.data;
}

export async function adminDeleteProduct(id) {
  const res = await http.delete(`/admin/products/${id}`, {
    headers: authHeaders(),
  });
  return res.data;
}

/* -------- Categories CRUD -------- */
export async function adminListCategories() {
  const res = await http.get("/admin/categories", { headers: authHeaders() });
  return res.data;
}

export async function adminCreateCategory(name) {
  const res = await http.post(
    "/admin/categories",
    { name },
    { headers: authHeaders() }
  );
  return res.data;
}

export async function adminDeleteCategory(id) {
  const res = await http.delete(`/admin/categories/${id}`, {
    headers: authHeaders(),
  });
  return res.data;
}

/* -------- Orders -------- */
export async function adminListOrders(status = "ALL") {
  const qs = status && status !== "ALL" ? `?status=${status}` : "";
  const res = await http.get(`/admin/orders${qs}`, { headers: authHeaders() });
  return res.data;
}

export async function adminSetOrderStatus(id, status) {
  const res = await http.patch(
    `/admin/orders/${id}/status`,
    { status },
    { headers: authHeaders() }
  );
  return res.data;
}
