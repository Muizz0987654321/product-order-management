const BASE = "https://dummyjson.com";

async function request(path: string, opts?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, opts);
  const text = await res.text();
  // Try to parse JSON when possible
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (err) {
    data = text;
  }

  if (!res.ok) {
    const err = new Error(`Request failed: ${res.status} ${res.statusText}`);
    (err as any).status = res.status;
    (err as any).body = data;
    throw err;
  }

  return data;
}

export const productsApi = {
  getProducts: (params = "") => request(`/products${params}`),

  getProductById: (id: number) => request(`/products/${id}`),

  updateProduct: (id: number, payload: any) =>
    request(`/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  createProduct: (payload: any) =>
    request(`/products/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
};
