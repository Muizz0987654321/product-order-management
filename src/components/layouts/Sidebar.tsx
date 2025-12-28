import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/Inbox";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { Link, useLocation } from "react-router-dom";

export const drawerWidth = 200;

interface SidebarProps {
  // static sidebar - no props required
}

const Sidebar = (_props?: SidebarProps) => {
  const location = useLocation();
  const isSelected = (path: string) => location.pathname === path;

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: drawerWidth },
        flexShrink: { sm: 0 },
        display: { xs: "none", sm: "block" },
        backgroundColor: "#2b2a2a",
        position: { sm: "fixed" },
        top: 0,
        left: 0,
        height: "100vh",
      }}
      aria-label="main navigation"
    >
      <Toolbar />
      <Divider />
      <List dense disablePadding sx={{ py: 2, px: 0.5 }}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            component={Link}
            to="/dashboard"
            selected={isSelected("/dashboard")}
            sx={{ py: 0.125, minHeight: 28, px: 0.75, color: "#fff" }}
          >
            <ListItemIcon sx={{ minWidth: 28 }}>
              <InboxIcon fontSize="small" sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText
              primary="Dashboard"
              primaryTypographyProps={{ sx: { fontSize: "0.82rem" } }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            component={Link}
            to="/orders"
            selected={isSelected("/orders")}
            sx={{ py: 0.125, minHeight: 28, px: 0.75 }}
          >
            <ListItemIcon sx={{ minWidth: 28 }}>
              <ShoppingCartIcon fontSize="small" sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText
              primary="Orders"
              primaryTypographyProps={{
                sx: { fontSize: "0.82rem", color: "#fff" },
              }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            component={Link}
            to="/products"
            selected={isSelected("/products")}
            sx={{ py: 0.125, minHeight: 28, px: 0.75 }}
          >
            <ListItemIcon sx={{ minWidth: 28 }}>
              <Inventory2Icon fontSize="small" sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText
              primary="Products"
              primaryTypographyProps={{
                sx: { fontSize: "0.82rem", color: "#fff" },
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
