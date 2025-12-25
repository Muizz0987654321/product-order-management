// no React hooks needed here
import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Topbar from "./components/layouts/Topbar";
import Sidebar from "./components/layouts/Sidebar";
import Dashboard from "./pages/dashboard/Dashboard";
import Orders from "./pages/orders/Orders";
import Products from "./pages/products/Products";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const theme = createTheme();

function App() {
  // sidebar is now a static component, no open state required

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
              // main width is flexible next to the static sidebar
            }}
          >
            <Toolbar />
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/products" element={<Products />} />
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
