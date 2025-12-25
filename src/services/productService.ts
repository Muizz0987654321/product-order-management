const BASE = "https://dummyjson.com";

export const productsApi = {
  getProducts: (params: string) =>
    fetch(`${BASE}/products${params}`).then(res => res.json()),

  getProductById: (id: number) =>
    fetch(`${BASE}/products/${id}`).then(res => res.json()),

  updateProduct: (id: number, payload: any) =>
    fetch(`${BASE}/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(res => res.json()),
};
