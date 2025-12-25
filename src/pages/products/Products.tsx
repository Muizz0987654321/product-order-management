import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { productsApi } from "../../services/productService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type ProductRow = {
  id: number;
  sku?: string;
  title?: string;
  price?: number;
  rating?: number;
  stock?: number;
  category?: string;
  brand?: string;
};

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 80 },
  { field: "sku", headerName: "SKU", width: 160 },
  { field: "title", headerName: "Title", width: 240 },
  { field: "price", headerName: "Price", type: "number", width: 100 },
  { field: "rating", headerName: "Rating", type: "number", width: 100 },
  { field: "stock", headerName: "Stock", type: "number", width: 100 },
  { field: "category", headerName: "Category", width: 160 },
  { field: "brand", headerName: "Brand", width: 160 },
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <>
        <IconButton
          size="small"
          color="primary"
          onClick={() => console.log("edit", params.row.id)}
          aria-label={`edit-${params.row.id}`}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() => console.log("delete", params.row.id)}
          aria-label={`delete-${params.row.id}`}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </>
    ),
  },
];

const Products: React.FC = () => {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const data = await productsApi.getProducts("?limit=100");

        const products = data?.products ?? [];
        console.log("Fetched products:", products);
        setRows(
          products.map((p: any) => ({
            id: p.id,
            sku: p.sku,
            title: p.title,
            price: `${p.price}$`,
            rating: p.rating,
            stock: p.stock,
            category: p.category,
            brand: p.brand,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" component="div" sx={{ py: 2 }}>
            Products
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Overview of your products
          </Typography>

          <Paper sx={{ width: "100%", mt: 2 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 10 } },
              }}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick
            />
          </Paper>
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
