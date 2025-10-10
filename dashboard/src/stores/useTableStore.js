import { create } from "zustand";
import { db } from "@/lib/frappeClient";

export const useTableStore = create((set) => ({
  tables: [],
  floors: [],

  loadingTables: false,
  loadingFloors: false,
  errorTables: null,
  errorFloors: null,

  fetchTables: async () => {
    set({ loadingTables: true, errorTables: null });
    try {
      const data = await db.getDocList("HA Table", {
        fields: ["name", "table_number", "capacity", "status", "floor"],
      });
      set({ tables: data, loadingTables: false });
    } catch (err) {
      console.error("Table fetch error:", err);
      set({ errorTables: err.message, loadingTables: false });
    }
  },

  fetchFloors: async () => {
    set({ loadingFloors: true, errorFloors: null });
    try {
      const data = await db.getDocList("HA Floor", {
        fields: ["name", "floor_name"],
      });
      set({ floors: data, loadingFloors: false });
    } catch (err) {
      console.error("Floor fetch error:", err);
      set({ errorFloors: err.message, loadingFloors: false });
    }
  },
}));
