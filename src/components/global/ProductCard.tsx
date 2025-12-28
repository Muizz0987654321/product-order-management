import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import type { Product } from "@types";

export type ProductCardProps = Partial<Product> & {
  id: string;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
};

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  brand,
  category,
  onView,
  onEdit,
}) => {
  return (
    <Card sx={{ minWidth: 240, borderRadius: 1 }}>
      <CardContent>
        <Typography variant="subtitle1" component="div" gutterBottom>
          {title || "Untitled"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {brand || ""} {category ? `• ${category}` : ""}
        </Typography>

        <Box sx={{ mt: 1 }}>
          <Typography variant="h6">${price ?? "0.00"}</Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => onView?.(id)}>
          View
        </Button>
        <Button size="small" onClick={() => onEdit?.(id)}>
          Edit
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
