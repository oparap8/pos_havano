import Container from "@/components/Shared/Container";
import { useEffect, useState } from "react";
import { useOrderStore } from "@/stores/useOrderStore";
import {
  Card,
  CardFooter,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import Error from "@/components/Error";
import Loader from "@/components/Loader";
import OrderDetailsDialog from "@/components/Shared/OrderDetailsDialog";

const Orders = () => {
  const { orders, loading: orderLoading, error: orderError, fetchOrders } =
    useOrderStore();
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  console.log(orders);

  useEffect(() => {
    fetchOrders();
  }, []);

  if (orderLoading) {
    return <Loader />;
  }

  if (orderError) {
    console.error("Error fetching orders:", orderError);
    return <Error />;
  }
  return (
    <>
      <Container>
        <div className="flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold text-primary">Orders</h1>
          <div className="flex items-center gap-4">
            <p>Filter by waiter</p>
            <p>Filter by status</p>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {orders
            .filter((order) => order.payment_status === "Unpaid")
            .map((order) => (
                <Card
                  key={order.name}
                  className="cursor-pointer transition hover:shadow-lg"
                  onClick={() => {
                    setSelectedOrderId(order.name);
                    setIsDialogOpen(true);
                  }}
                >
                  <CardHeader className="flex justify-between items-center">
                    <p>
                      {`${order.name} ${
                        order.table_number
                          ? "/ Table " + order.table_number
                          : ""
                      }`}
                    </p>
                    {order.payment_status && (
                      <Badge variant={order.payment_status.toLowerCase()}>
                        {order.payment_status}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className=" text-gray-500 text-sm">
                    <p>{formatDateTime(order.creation)}</p>
                  </CardContent>
                  <hr className="border border-gray-600" />
                  <CardFooter className="flex justify-between items-center font-bold">
                    <p>Total</p>
                    <p>{formatCurrency(order.total_price)}</p>
                  </CardFooter>
                </Card>
            ))}
        </div>
      </Container>
      <OrderDetailsDialog
        open={isDialogOpen}
        orderId={selectedOrderId}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedOrderId(null);
        }}
        onEdit={(orderId) => {
          setIsDialogOpen(false);
          setSelectedOrderId(null);
        }}
        onDeleted={async () => {
          await fetchOrders();
        }}
      />
    </>
  );
};

export default Orders;
