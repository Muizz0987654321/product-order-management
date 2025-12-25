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

export const drawerWidth = 240;

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
      }}
      aria-label="main navigation"
    >
      <Toolbar />
      <Divider />
      <List dense disablePadding sx={{ py: 3, px: 1 }}>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            component={Link}
            to="/dashboard"
            selected={isSelected("/dashboard")}
            sx={{ py: 0.25, minHeight: 32, px: 1.25, color: "#fff" }}
          >
            <ListItemIcon sx={{ minWidth: 34 }}>
              <InboxIcon fontSize="small" sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText
              primary="Dashboard"
              primaryTypographyProps={{ sx: { fontSize: "0.88rem" } }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            component={Link}
            to="/orders"
            selected={isSelected("/orders")}
            sx={{ py: 0.25, minHeight: 32, px: 1.25 }}
          >
            <ListItemIcon sx={{ minWidth: 34 }}>
              <ShoppingCartIcon fontSize="small" sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText
              primary="Orders"
              primaryTypographyProps={{
                sx: { fontSize: "0.88rem", color: "#fff" },
              }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            component={Link}
            to="/products"
            selected={isSelected("/products")}
            sx={{ py: 0.25, minHeight: 32, px: 1.25 }}
          >
            <ListItemIcon sx={{ minWidth: 34 }}>
              <Inventory2Icon fontSize="small" sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText
              primary="Products"
              primaryTypographyProps={{
                sx: { fontSize: "0.88rem", color: "#fff" },
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
