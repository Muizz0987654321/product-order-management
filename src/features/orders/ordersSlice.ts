import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { generateFakeOrders } from "@services/orderService";
import type { ProductLite } from "@types";

type OrderRow = {
  id: string;
  productId: string;
  productTitle: string;
  qty: number;
  unitPrice: number;
  total: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
};

const LS_KEY = "localOrders_v1";

const safeParse = (raw: string | null) => {
  try {
    const p = raw ? JSON.parse(raw) : [];
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
};
const readLocal = (): OrderRow[] => safeParse(localStorage.getItem(LS_KEY));
const writeLocal = (items: OrderRow[]) =>
  localStorage.setItem(LS_KEY, JSON.stringify(items));

export const loadOrders = createAsyncThunk("orders/load", async () => {
  const saved = readLocal();
  return saved as OrderRow[];
});

export const generateOrders = createAsyncThunk(
  "orders/generate",
  async (payload: { products: ProductLite[]; count: number }) => {
    const { products, count } = payload;
    // generateFakeOrders returns OrderRow[] compatible shape
    const normalized = (products || []).map((p) => ({
      id: String(p.id),
      title: String(p.title ?? ""),
      price: Number(p.price) || 0,
    }));
    const generated = generateFakeOrders(normalized, count) as any[];
    // Prepend to saved orders
    const saved = readLocal();
    const next = [...generated, ...saved];
    writeLocal(next);
    return next as OrderRow[];
  }
);

export const clearOrders = createAsyncThunk("orders/clear", async () => {
  writeLocal([]);
  return [] as OrderRow[];
});

type OrdersState = {
  items: OrderRow[];
  loading: boolean;
  error?: string | null;
};

const initialState: OrdersState = { items: [], loading: false, error: null };

const slice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b
      .addCase(loadOrders.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(loadOrders.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(loadOrders.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message ?? String(a.error);
      })
      .addCase(generateOrders.pending, (s) => {
        s.loading = true;
      })
      .addCase(generateOrders.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(clearOrders.fulfilled, (s, a) => {
        s.items = a.payload;
      });
  },
});

// Selectors
export const selectOrders = (state: any) => state.orders.items as OrderRow[];
export const selectOrdersByStatus = (state: any, status: string) =>
  state.orders.items.filter((o: OrderRow) => (status === "all" ? true : o.status === status));

export default slice.reducer;
