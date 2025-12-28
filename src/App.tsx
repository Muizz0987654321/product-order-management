import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Topbar from "./components/layouts/Topbar";
import Sidebar, { drawerWidth } from "./components/layouts/Sidebar";
import Dashboard from "./pages/dashboard/Dashboard";
import Orders from "./pages/orders/Orders";
import Products from "./pages/products/Products";
import CreateUpdate from "./pages/products/CreateUpdate";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const theme = createTheme();

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: "flex" }}>
          <Topbar />
          <Sidebar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              ml: { sm: `${drawerWidth}px` },
            }}
          >
            <Toolbar />
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/products" element={<Products />} />
              <Route
                path="/products/create-update"
                element={<CreateUpdate />}
              />
              <Route
                path="/products/create-update/:id"
                element={<CreateUpdate />}
              />
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
