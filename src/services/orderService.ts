export type ProductLite = {
  id: string;
  title: string;
  price: number;
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

const STATUS_LIST: OrderStatus[] = ["Pending", "Shipped", "Delivered", "Cancelled"];

export function generateFakeOrders(products: ProductLite[], count: number): OrderRow[] {
  const out: OrderRow[] = [];
  if (!products || products.length === 0) return out;
  for (let i = 0; i < count; i++) {
    const p = products[Math.floor(Math.random() * products.length)];
    const qty = Math.floor(Math.random() * 5) + 1;
    const unit = p.price || 0;
    const total = Number((unit * qty).toFixed(2));
    const status = STATUS_LIST[Math.floor(Math.random() * STATUS_LIST.length)];
    out.push({
      id: `order-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      productId: p.id,
      productTitle: p.title,
      qty,
      unitPrice: unit,
      total,
      status,
      createdAt: new Date().toISOString(),
    });
  }
  return out;
}

export function ordersToJson(orders: OrderRow[]) {
  return JSON.stringify(orders, null, 2);
}
