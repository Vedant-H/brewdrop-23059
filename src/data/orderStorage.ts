// src/data/orderStorage.ts
// Utility functions for managing orders in localStorage

export interface Order {
  id: string;
  userId: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  status: string; // e.g., 'pending', 'approved', 'delivered', etc.
  createdAt: string;
  approved: boolean;
  rejected?: boolean;
}

const ORDERS_KEY = "orders";

export function getAllOrders(): Order[] {
  const data = localStorage.getItem(ORDERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveAllOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function addOrder(order: Order) {
  const orders = getAllOrders();
  orders.push(order);
  saveAllOrders(orders);
}

export function approveOrder(orderId: string): boolean {
  const orders = getAllOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) return false;
  orders[idx].approved = true;
  orders[idx].status = "approved";
  saveAllOrders(orders);
  return true;
}

export function getOrdersByUser(userId: string): Order[] {
  return getAllOrders().filter((o) => o.userId === userId);
}

export function getPendingOrders(): Order[] {
  return getAllOrders().filter((o) => !o.approved);
}

export function getApprovedOrders(): Order[] {
  return getAllOrders().filter((o) => o.approved);
}
