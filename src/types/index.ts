export type Product = {
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

export type ProductLite = {
  id: string;
  title?: string;
  price?: number;
};

export type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";

export type OrderRow = {
  id: string;
  productId: string;
  productTitle: string;
  qty: number;
  unitPrice: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
};
