import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import OrderStatusBadge from "./OrderStatusBadge";

const meta: Meta<typeof OrderStatusBadge> = {
  title: "Components/OrderStatusBadge",
  component: OrderStatusBadge,
};

export default meta;

type Story = StoryObj<typeof OrderStatusBadge>;

export const Pending: Story = { args: { status: "Pending" } };
export const Shipped: Story = { args: { status: "Shipped" } };
export const Delivered: Story = { args: { status: "Delivered" } };
export const Cancelled: Story = { args: { status: "Cancelled" } };
