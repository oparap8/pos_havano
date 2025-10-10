// src/stores/useOrderStore.js
import { create } from "zustand";
import { db } from "@/lib/frappeClient";

export const useOrderStore = create((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      // fetch all orders
      const orders = await db.getDocList("HA Order", {
        fields: ["name", "table", "payment_status", "total_price", "waiter"],
      });

      // fetch all tables
      const tables = await db.getDocList("HA Table", {
        fields: ["name", "table_number"],
      });

      // fetch all waiters
      const waiters = await db.getDocList("HA Waiter", {
        fields: ["name", "waiter_name"],
      });

      // create a lookup for table
      const tableMap = Object.fromEntries(
        tables.map((t) => [t.name, t.table_number])
      );

      // create a lookup for waiter
      const waiterMap = Object.fromEntries(
        waiters.map((w) => [w.name, w.waiter_name])
      );

      // merge table number into each order
      const merged = orders.map((order) => ({
        ...order,
        table_number: tableMap[order.table] || null,
        waiter_name: waiterMap[order.waiter] || null,
      }));

      set({ orders: merged, loading: false });
    } catch (err) {
      console.error("Fetch error:", err);
      set({ error: err.message, loading: false });
    }
  },
}));
