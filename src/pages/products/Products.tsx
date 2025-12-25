import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";

type Row = {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  age?: number | null;
};

const rows: Row[] = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "firstName", headerName: "First name", width: 150 },
  { field: "lastName", headerName: "Last name", width: 150 },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 90,
    align: "right",
    headerAlign: "right",
  },
  {
    field: "fullName",
    headerName: "Full name",
    width: 200,
    sortable: false,
    valueGetter: (params) =>
      `${params.row.firstName ?? ""} ${params.row.lastName ?? ""}`,
  },
];

const Products: React.FC = () => {
  return (
    <div>
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Products
          </Typography>
          <Typography color="text.secondary">
            Overview of your products
          </Typography>

          <Paper sx={{ width: "100%", mt: 2 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 5 } },
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
