import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Stack, Box } from "@mui/material";
import FilterPanel from "@components/global/FilterPanel";
import ConfirmationDialog from "@components/global/ConfirmationDialog";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  fetchProducts,
  deleteLocalProduct,
  selectFilteredProducts,
  selectProducts,
  selectProductsLoading,
} from "@features/products/productsSlice";
import type { Product } from "@types";

const Products: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const allProducts = useAppSelector((s) => selectProducts(s));
  const loading = useAppSelector((s) => selectProductsLoading(s));

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<
    "success" | "info" | "warning" | "error"
  >("success");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const searchTimer = useRef<number | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const r of allProducts) {
      if (r.category) set.add(r.category);
    }
    return Array.from(set).sort();
  }, [allProducts]);

  const [minPrice, maxPrice] = useMemo(() => {
    if (!allProducts || !allProducts.length) return [0, 0];
    const prices = allProducts.map((r) => Number(r.price) || 0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return [Math.floor(min), Math.ceil(max)];
  }, [allProducts]);

  const handleRefresh = useCallback(async () => {
    setSearch("");
    setCategoryFilter("all");
    setPriceRange([minPrice, maxPrice]);
    await dispatch(fetchProducts());
  }, [dispatch, minPrice, maxPrice]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // initialize priceRange when rows change (preserve user selection when possible)
  useEffect(() => {
    setPriceRange((prev) => {
      if (
        (prev[0] === 0 && prev[1] === 0) ||
        prev[0] < minPrice ||
        prev[1] > maxPrice
      ) {
        return [minPrice, maxPrice];
      }
      return [Math.max(prev[0], minPrice), Math.min(prev[1], maxPrice)];
    });
  }, [minPrice, maxPrice]);

  // simple client-side filtering via selector (server-side search can be added later)
  useEffect(() => {
    if (searchTimer.current) {
      window.clearTimeout(searchTimer.current);
      searchTimer.current = null;
    }
    // debounce UX only to avoid rapid selector updates
    searchTimer.current = window.setTimeout(() => {
      // no-op; filtering happens via selector below
    }, 100) as unknown as number;

    return () => {
      if (searchTimer.current) {
        window.clearTimeout(searchTimer.current);
        searchTimer.current = null;
      }
    };
  }, [search]);

  // show toast passed via navigation state (create/update flows)
  useEffect(() => {
    const toast = (location.state as any)?.toast;
    if (toast?.message) {
      setSnackMsg(toast.message);
      setSnackSeverity(toast.severity ?? "success");
      setSnackOpen(true);
      // clear navigation state so message doesn't reappear
      navigate(location.pathname, { replace: true, state: undefined });
    }
  }, [location, navigate]);

  const handleDelete = useCallback((row: Product | null) => {
    if (!row) return;
    if (row.source !== "local") {
      setSnackMsg(
        "DummyJSON items are read-only. Only locally added items can be deleted."
      );
      setSnackSeverity("info");
      setSnackOpen(true);
      return;
    }
    setConfirmTarget(row);
    setConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    const row = confirmTarget;
    if (!row) return;
    await dispatch(deleteLocalProduct(row.id));
    setConfirmOpen(false);
    setConfirmTarget(null);
    setSnackMsg("Product deleted");
    setSnackSeverity("success");
    setSnackOpen(true);
    // refresh list from server/local
    dispatch(fetchProducts());
  }, [confirmTarget, dispatch]);

  const handleCancelDelete = useCallback(() => {
    setConfirmOpen(false);
    setConfirmTarget(null);
  }, []);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 90 },
      { field: "sku", headerName: "SKU", width: 100 },
      { field: "title", headerName: "Title", flex: 1, minWidth: 160 },
      { field: "price", headerName: "Price", type: "number", width: 90 },
      { field: "rating", headerName: "Rating", type: "number", width: 90 },
      { field: "stock", headerName: "Stock", type: "number", width: 90 },
      { field: "category", headerName: "Category", width: 120 },
      { field: "brand", headerName: "Brand", width: 120 },
      {
        field: "active",
        headerName: "Status",
        width: 120,
        valueGetter: (params) => (params.row.active ? "Active" : "Inactive"),
        renderCell: (params) => (
          <Box sx={{ color: params.row.active ? "green" : "gray" }}>
            {params.row.active ? "Active" : "Inactive"}
          </Box>
        ),
      },
      {
        field: "source",
        headerName: "Source",
        width: 110,
        valueGetter: (params) => params.row.source ?? "server",
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const row = params.row as Product;
          const isLocal = row.source === "local";

          return (
            <>
              <IconButton
                size="small"
                color="primary"
                onClick={() => {
                  navigate(`/products/create-update/${row.id}`);
                }}
                aria-label={`edit-${row.id}`}
              >
                <EditIcon fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                color="error"
                disabled={!isLocal}
                onClick={() => handleDelete(row)}
                aria-label={`delete-${row.id}`}
                title={isLocal ? "Delete local product" : "Read-only (server)"}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </>
          );
        },
      },
    ],
    [handleDelete, navigate]
  );

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ my: 2 }}
          spacing={2}
        >
          <div>
            <Typography variant="h5">Products</Typography>
          </div>

          <Stack direction="row" spacing={1} alignItems="center">
            <FilterPanel
              search={search}
              onSearch={(v) => setSearch(v)}
              category={categoryFilter}
              categories={categories}
              onCategory={(c) => setCategoryFilter(c)}
              priceRange={priceRange}
              min={minPrice}
              max={maxPrice}
              onPriceRange={(r) => setPriceRange(r)}
              onReset={handleRefresh}
            />

            <Button
              variant="outlined"
              onClick={handleRefresh}
              disabled={loading}
            >
              Refresh
            </Button>

            <Button
              variant="contained"
              component={Link}
              to="/products/create-update/new"
              sx={{
                backgroundColor: "gray",
                "&:hover": { backgroundColor: "gray" },
              }}
            >
              Add
            </Button>
          </Stack>
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
            rows={useAppSelector((s) =>
              selectFilteredProducts(s, {
                search,
                category: categoryFilter,
                priceRange,
              })
            )}
            columns={columns}
            loading={loading}
            getRowId={(r: any) => r.id}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 10 } },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            disableRowSelectionOnClick
          />
        </Paper>
        <ConfirmationDialog
          open={confirmOpen}
          title="Delete Product"
          message={`Delete "${
            confirmTarget?.title || confirmTarget?.sku || confirmTarget?.id
          }"?`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
        <Snackbar
          open={snackOpen}
          autoHideDuration={5000}
          onClose={() => setSnackOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackOpen(false)}
            severity={snackSeverity}
            sx={{ width: "100%", bottom: "8px", position: "relative" }}
          >
            {snackMsg}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default Products;
