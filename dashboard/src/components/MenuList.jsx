// src/components/MenuList.jsx
import React, { useEffect } from "react";
import { useMenuStore } from "@/stores/useMenuStore";
import { useOrderStore } from "@/stores/useOrderStore";
import Error from "./Error";

function MenuList() {
  // 🔹 Access state and actions from Zustand
  const {
    menuItems,
    loading,
    error,
    fetchMenuItems,
    fetchMenuCategories,
    menuCategories,
  } = useMenuStore();

  const { orders, fetchOrders } = useOrderStore();

  // 🔹 Fetch menu items when component mounts
  useEffect(() => {
    fetchMenuItems();
    fetchMenuCategories();
    fetchOrders();
  }, []);

  // 🔹 Render UI
  if (loading) return <p>Loading menu...</p>;
  if (error) return <Error />;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Menu Items</h2>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.name} className="border-b pb-2">
            <div className="flex justify-between">
              <span>{item.item_name}</span>
              <span className="text-gray-500">${item.standard_rate}</span>
              <span>{item.custom_menu_category}</span>
            </div>
          </li>
        ))}
      </ul>
      <ul>
        {menuCategories.map((category) => (
          <li key={category.name} className="border-b pb-2">
            <div className="flex justify-between">
              <span>{category.name}</span>
            </div>
          </li>
        ))}
      </ul>
      <ul>
        {orders.map((o) => (
          <li key={o.name}>
            {o.name} — {o.table_number? `Table ${o.table_number}` : "No table"}
             — {o.total_price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MenuList;
