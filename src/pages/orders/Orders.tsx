import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import OrderStatusBadge from "@components/global/OrderStatusBadge";
import type { SelectChangeEvent } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { productsApi } from "@services/productService";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  loadOrders,
  generateOrders,
  clearOrders,
  selectOrders,
} from "@features/orders/ordersSlice";
import type { ProductLite, OrderRow } from "@types";

const STATUS_LIST: OrderRow["status"][] = [
  "Pending",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const Orders: React.FC = () => {
  const LOCAL_PRODUCTS_KEY = "localProducts_v1";

  const readLocal = (key: string) => {
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState<ProductLite[]>([]);
  const orders = useAppSelector((s) => selectOrders(s));
  const loading = useAppSelector((s) => s.orders.loading as boolean);

  const [count, setCount] = useState<number>(10);
  const [productsLoading, setProductsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const loadProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const data = await productsApi.getProducts("?limit=1000");
      const server = Array.isArray(data?.products) ? data.products : [];
      const local = readLocal(LOCAL_PRODUCTS_KEY);

      const mappedServer: ProductLite[] = server.map((p: any) => ({
        id: String(p.id),
        title: p.title ?? "",
        price: Number(p.price) || 0,
      }));

      const mappedLocal: ProductLite[] = local.map((p: any) => ({
        id: String(p.id),
        title: p.title ?? "",
        price: Number(p.price) || 0,
      }));

      const localIds = new Set(mappedLocal.map((p) => p.id));
      const combined = [
        ...mappedLocal,
        ...mappedServer.filter((p) => !localIds.has(p.id)),
      ];
      setProducts(combined);
    } catch (err) {
      console.error("Failed to load products for orders", err);
      const fallback = readLocal(LOCAL_PRODUCTS_KEY).map((p: any) => ({
        id: String(p.id),
        title: p.title ?? "",
        price: Number(p.price) || 0,
      }));
      setProducts(fallback);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    dispatch(loadOrders());
  }, [loadProducts, dispatch]);

  const handleGenerate = async () => {
    const n = Math.min(20, Math.max(1, Math.floor(count)));
    await dispatch(generateOrders({ products, count: n }));
  };

  const handleClear = async () => {
    await dispatch(clearOrders());
  };

  // (prepared JSON export placeholder)

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: "Order ID", width: 220 },
      { field: "productTitle", headerName: "Product", flex: 1, minWidth: 200 },
      { field: "qty", headerName: "Qty", width: 90, type: "number" },
      { field: "unitPrice", headerName: "Unit $", width: 110, type: "number" },
      { field: "total", headerName: "Total $", width: 120, type: "number" },
      {
        field: "status",
        headerName: "Status",
        width: 140,
        renderCell: (params) => {
          const s = params.value as OrderRow["status"];
          return <OrderStatusBadge status={s} size="small" />;
        },
      },
      { field: "createdAt", headerName: "Created", width: 180 },
    ],
    []
  );

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (!search) return true;
      const t = search.toLowerCase();
      return (
        o.productTitle.toLowerCase().includes(t) ||
        o.id.toLowerCase().includes(t)
      );
    });
  }, [orders, search, statusFilter]);

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <div>
            <Typography variant="h5">Orders</Typography>
            <Typography color="text.secondary">
              Generated dummy orders (local)
            </Typography>
          </div>

          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              size="small"
              type="number"
              label="Count"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              inputProps={{ min: 1, max: 20 }}
              sx={{ width: 110 }}
            />
            <Button
              variant="contained"
              onClick={handleGenerate}
              disabled={loading || productsLoading}
            >
              Generate Orders
            </Button>
            <Button variant="outlined" color="error" onClick={handleClear}>
              Clear Orders
            </Button>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center">
          <TextField
            size="small"
            placeholder="Search by product or order id"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 360 }}
          />
          <Select
            value={statusFilter}
            onChange={(e: SelectChangeEvent) => setStatusFilter(e.target.value)}
            size="small"
          >
            <MenuItem value="all">All Statuses</MenuItem>
            {STATUS_LIST.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        <Paper sx={{ width: "100%", overflowX: "hidden" }}>
          <DataGrid
            density="compact"
            rowHeight={36}
            sx={{
              fontSize: "0.78rem",
              "& .MuiDataGrid-virtualScroller": { overflowX: "hidden" },
              "& .MuiDataGrid-cell": { py: "6px", px: "8px" },
              "& .MuiDataGrid-columnHeader": { px: "8px" },
            }}
            rows={filtered}
            columns={columns}
            loading={loading}
            getRowId={(r) => r.id}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 10 } },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            disableRowSelectionOnClick
          />
        </Paper>
      </CardContent>
    </Card>
  );
};

export default Orders;
