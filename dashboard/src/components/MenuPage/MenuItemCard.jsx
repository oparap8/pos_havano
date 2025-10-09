import { useState, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { MenuCartContext } from "@/routes/pages/MenuPage";
import NumPad from "./UpdateCartDialog";

const MenuItemCard = ({ item }) => {

  const { addToCart } = useContext(MenuCartContext);

  const handleAddToCart = () => {
    addToCart({ ...item, quantity: 1 });
  };
  return (
    <>
      <Card
        onClick={handleAddToCart}
        className="cursor-pointer rounded-lg border shadow-sm transition transform hover:shadow-md hover:scale-[1.02] active:scale-[0.98] active:bg-gray-50"
      >
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          <i>${item.price}</i>
        </CardHeader>
      </Card>
    </>
  );
};

export default MenuItemCard;
