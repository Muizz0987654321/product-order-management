import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { productsApi } from "@services/productService";

type ProductRow = {
  id: string;
  sku?: string;
  title?: string;
  price?: number;
  rating?: number;
  stock?: number;
  category?: string;
  brand?: string;
  active?: boolean;
  source?: "server" | "local";
};

const LS_KEY = "localProducts_v1";

const safeParse = (raw: string | null) => {
  try {
    const p = raw ? JSON.parse(raw) : [];
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
};

const readLocal = (): ProductRow[] => safeParse(localStorage.getItem(LS_KEY));
const writeLocal = (items: ProductRow[]) =>
  localStorage.setItem(LS_KEY, JSON.stringify(items));

const mapServer = (p: any): ProductRow => ({
  id: String(p.id),
  sku: p.sku ?? "",
  title: p.title ?? "",
  price: Number(p.price) || 0,
  rating: Number(p.rating) || 0,
  stock: Number(p.stock) || 0,
  category: p.category ?? "",
  brand: p.brand ?? "",
  active: p.active != null ? Boolean(p.active) : true,
  source: "server",
});

const mapLocal = (p: any): ProductRow => ({
  id: String(p.id),
  sku: p.sku ?? "",
  title: p.title ?? "",
  price: Number(p.price) || 0,
  rating: Number(p.rating) || 0,
  stock: Number(p.stock) || 0,
  category: p.category ?? "",
  brand: p.brand ?? "",
  active: p.active != null ? Boolean(p.active) : true,
  source: "local",
});

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async () => {
    const data = await productsApi.getProducts("?limit=1000");
    const server = Array.isArray(data?.products) ? data.products : [];
    const local = readLocal();

    const mappedServer = server.map(mapServer);
    const mappedLocal = local.map(mapLocal);
    const localIds = new Set(mappedLocal.map((p) => p.id));
    const combined = [
      ...mappedLocal,
      ...mappedServer.filter((p: ProductRow) => !localIds.has(p.id)),
    ];
    return combined as ProductRow[];
  }
);

export const createProduct = createAsyncThunk(
  "products/create",
  async (payload: Partial<ProductRow>) => {
    try {
      // Attempt server create (DummyJSON will return created object but doesn't persist)
      const res = await productsApi.createProduct(payload as any);
      // Use server response if available, but persist locally as well
      const created = res && res.id ? res : payload;
      const local = readLocal();
      const id = `local-${Date.now()}`;
      const item: ProductRow = { ...(created as any), id: String(id), source: "local" } as any;
      const next = [item, ...local];
      writeLocal(next);
      return item;
    } catch (err) {
      // fallback: persist locally
      const local = readLocal();
      const id = `local-${Date.now()}`;
      const item: ProductRow = { ...(payload as any), id: String(id), source: "local" } as any;
      const next = [item, ...local];
      writeLocal(next);
      return item;
    }
  }
);

export const updateLocalProduct = createAsyncThunk(
  "products/updateLocal",
  async ({ id, changes }: { id: string; changes: Partial<ProductRow> }) => {
    const local = readLocal();
    const next = local.map((p) => (String(p.id) === String(id) ? { ...p, ...changes } : p));
    writeLocal(next);
    return { id, changes } as { id: string; changes: Partial<ProductRow> };
  }
);

export const deleteLocalProduct = createAsyncThunk(
  "products/deleteLocal",
  async (id: string) => {
    const local = readLocal();
    const next = local.filter((p) => String(p.id) !== String(id));
    writeLocal(next);
    return id;
  }
);

type ProductsState = {
  items: ProductRow[];
  loading: boolean;
  error?: string | null;
};

const initialState: ProductsState = { items: [], loading: false, error: null };

const slice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<ProductRow[]>) {
      state.items = action.payload;
    },
    clearProducts(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchProducts.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchProducts.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message ?? String(a.error);
      })
      .addCase(createProduct.fulfilled, (s, a) => {
        s.items = [a.payload, ...s.items];
      })
      .addCase(deleteLocalProduct.fulfilled, (s, a) => {
        const id = a.payload as string;
        s.items = s.items.filter((p) => String(p.id) !== String(id));
      })
      .addCase(updateLocalProduct.fulfilled, (s, a) => {
        const { id, changes } = a.payload;
        s.items = s.items.map((p) => (String(p.id) === String(id) ? { ...p, ...changes } : p));
      });
  },
});

export const { setProducts, clearProducts } = slice.actions;

// Selectors (untyped to avoid circular imports) — consumers can type RootState themselves
export const selectProducts = (state: any) => state.products.items as ProductRow[];
export const selectProductsLoading = (state: any) => state.products.loading as boolean;

export const selectFilteredProducts = (
  state: any,
  opts: { search?: string; category?: string; priceRange?: [number, number] }
) => {
  let items: ProductRow[] = state.products.items || [];
  const { search, category, priceRange } = opts || {};
  if (search) {
    const s = String(search).toLowerCase();
    items = items.filter((p) => (p.title || "").toLowerCase().includes(s));
  }
  if (category && category !== "all") items = items.filter((p) => p.category === category);
  if (Array.isArray(priceRange) && priceRange.length === 2) {
    const [low, high] = priceRange;
    items = items.filter((p) => {
      const price = Number(p.price) || 0;
      return price >= low && price <= high;
    });
  }
  return items;
};

export default slice.reducer;
