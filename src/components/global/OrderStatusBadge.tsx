import React from "react";
import { Chip } from "@mui/material";
import type { OrderStatus } from "@types";

export type OrderStatusBadgeProps = {
  status: OrderStatus;
  size?: "small" | "medium";
};

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  size = "small",
}) => {
  const color =
    status === "Pending"
      ? "warning"
      : status === "Shipped"
      ? "info"
      : status === "Delivered"
      ? "success"
      : "default";

  return <Chip label={status} color={color as any} size={size} />;
};

export default OrderStatusBadge;
