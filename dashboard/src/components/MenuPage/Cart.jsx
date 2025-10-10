import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui/card";
import Clock from "../HomePage/Clock";
import { Button } from "../ui/button";
import { Edit, ShoppingCart, Trash2 } from "lucide-react";
import UpdateCartDialog from "./UpdateCartDialog";
import { useCartStore } from "@/stores/useCartStore";
import { formatCurrency } from "@/lib/utils";
import { getOrderItemsWithNames } from "@/api";


const Cart = () => {
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const openUpdateDialog = useCartStore((state) => state.openUpdateDialog);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("orderId") || null;

  useEffect(() => {
    if (orderId) {
      getOrderItemsWithNames(orderId).then((items) => {
        items.forEach((item) => {
          addToCart({
            id: item.id,
            name: item.name,
            item_name: item.item_name,
            quantity: item.quantity,
            price: item.price,
            standard_rate: item.price,
            remark: item.remark,
          });
        })
      });
    }
  }, [orderId, addToCart]);
  

  return (
    <>
      <Card className="h-[820px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <Clock />
            {orderId ? (
              <h1 className="text-2xl font-bold text-primary">
                Order #{orderId}
              </h1>
            ) : (
              <h1 className="text-2xl font-bold text-primary">New Order</h1>
            )}
          </CardTitle>
        </CardHeader>
        <hr className="border border-gray-600" />
        <CardContent className="flex-1">
          <p className="text-lg font-bold my-2">Order Details</p>
          {cart.length > 0 ? (
            <div className="flex flex-col space-y-1">
              {cart.map((item) => (
                <div
                  key={item.name}
                  className="flex justify-between items-center bg-secondary-background py-2 px-4 rounded-sm"
                >
                  <div className="flex gap-4 font-bold">
                    <p>x{item.quantity}</p>
                    <p>{item.item_name || item.name}</p>
                    <i>{formatCurrency(item.price ?? item.standard_rate ?? 0)}</i>
                  </div>
                  <div className="flex items-center">
                    <div
                      className="cursor-pointer hover:bg-background p-2 rounded-sm group"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(item);
                      }}
                    >
                      <Trash2
                        size={20}
                        className="text-red-700 group-hover:text-red-400"
                      />
                    </div>
                    <div
                      className="cursor-pointer hover:bg-background p-2 rounded-sm group"
                      onClick={() => openUpdateDialog(item)}
                    >
                      <Edit
                        size={20}
                        className="text-yellow-700 group-hover:text-yellow-400"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col justify-center items-center gap-2">
                <ShoppingCart size={60} className="text-secondary" />
                <i>Cart is empty</i>
              </div>
            </div>
          )}
        </CardContent>
        <hr className="border border-gray-600" />
        <CardFooter>
          <Button size="lg" block>
            {orderId ? "Update Order" : "Place Order"}
          </Button>
        </CardFooter>
      </Card>

      {/* 🔑 Single UpdateCartDialog instance */}
      <UpdateCartDialog />
    </>
  );
};

export default Cart;
