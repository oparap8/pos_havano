import UpdateCartDialog from "./UpdateCartDialog";
import Clock from "../HomePage/Clock";
import { Toaster, toast } from "sonner";
import { Edit, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui/card";
import { Button } from "../ui/button";
import { useCartStore } from "@/stores/useCartStore";
import { formatCurrency } from "@/lib/utils";
import { handleCreateOrder, handleUpdateOrder } from "@/lib/utils";

const Cart = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    cart,
    removeFromCart,
    openUpdateDialog,
    activeOrderId,
    activeTableId,
    activeWaiterId,
    customerName,
    orderType,
  } = useCartStore();

  console.log("cart", cart);

  // order = frappe.get_doc("HA Order", payload.get("order_id"))
  // order.order_items = []

  // for item in payload.get("order_items", []):
  //     order.append("order_items", {
  //         "menu_item": item.get("name"),
  //         "qty": item.get("quantity"),
  //         "rate": item.get("price"),
  //         "amount": item.get("price") * item.get("quantity"),
  //         "preparation_remark": item.get("remark")
  //     })
  // order.save()
  // frappe.db.commit()

  const handleSubmitOrder = async (cart) => {
    if (!cart || cart.length === 0) {
      return;
    }
    const payload = {
      order_type: orderType,
      customer_name: customerName,
      table: activeTableId,
      waiter: activeWaiterId,
      order_items: cart,
    };
    try {
      setIsSubmitting(true);
      const res = activeOrderId
        ? await handleUpdateOrder(activeOrderId, payload)
        : await handleCreateOrder(payload);

      if (res?.success) {
        toast.success(
          activeOrderId
            ? "Order updated successfully!"
            : "Order created successfully!",
          {
            description: activeOrderId
              ? `Order ID: ${activeOrderId}`
              : `Order ID: ${res.order_id}`,
            duration: 4000,
          }
        );

        console.log("Order response:", res);
      } else {
        toast.error(res?.message || "Something went wrong!", {
          description:
            res?.details || "Please check your order details and try again.",
          duration: 5000,
        });
        console.error("Order error:", res);
      }
    } catch (err) {
      toast.error("Server Error", {
        description: "Unable to reach the server. Please try again later.",
        duration: 5000,
      });
      console.error("Order submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="h-[820px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <Clock />
            {activeOrderId ? (
              <h1 className="text-2xl font-bold text-primary">
                {activeOrderId}
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
                    <i>
                      {formatCurrency(item.price ?? item.standard_rate ?? 0)}
                    </i>
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
          <Button
            onClick={() => handleSubmitOrder(cart)}
            size="lg"
            className="w-full"
            disabled={cart.length === 0 || isSubmitting}
            title={cart.length === 0 ? "Add items to your cart first" : ""}
          >
            {activeOrderId ? "Update Order" : "Place Order"}
          </Button>
        </CardFooter>
      </Card>
      <Toaster richColors duration={4000} position="top-center" />
      <UpdateCartDialog />
    </>
  );
};

export default Cart;
