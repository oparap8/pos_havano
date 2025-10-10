import { create } from "zustand";
import { db } from "@/lib/frappeClient";

export const useMenuStore = create((set, get) => ({
  menuItems: [],
  menuCategories: [],
  loading: false,
  error: null,

  // Fetch all menu items
  fetchMenuItems: async () => {
    set({ loading: true, error: null });
    try {
      const data = await db.getDocList("Item", {
        fields: ["name", "standard_rate", "item_name", "custom_menu_category"],
        filters: [["item_group", "=", "Menu Items"]],
      });
      set({ menuItems: data, loading: false });
    } catch (err) {
      console.error("Fetch error:", err);
      set({ error: err.message, loading: false });
    }
  },

  fetchMenuCategories: async () => {
    set({ loading: true, error: null });
    try {
      const data = await db.getDocList("HA Menu Category", {
        fields: ["name", "category_name"],
      });
      set({ menuCategories: data, loading: false });
    } catch (err) {
      console.error("Fetch error:", err);
      set({ error: err.message, loading: false });
    }
  },
}));
