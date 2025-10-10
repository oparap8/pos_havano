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
import { Link } from "react-router-dom";
import Error from "@/components/Error";
import Loader from "@/components/Loader";

const Orders = () => {
  const { orders, loading: orderLoading, error: orderError, fetchOrders } = useOrderStore();
  const [filter, setFilter] = useState("All");

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
        </div>
        <div className="grid grid-cols-5 gap-4">
          {orders
            .filter((order) => order.payment_status !== "Paid")
            .map((order) => (
              <Link to={`/menu/?orderId=${order.name}`} key={order.name}>
                <Card>
                  <CardHeader className="flex justify-between items-center">
                    <p>
                      {`${order.name} ${
                        order.table_number
                          ? "/ Table " + order.table_number
                          : ""
                      }`}
                    </p>
                    {order.payment_status && <Badge variant={order.payment_status.toLowerCase()}>
                      {order.payment_status}
                    </Badge>}
                  </CardHeader>
                  {/* <CardContent className="flex justify-between items-center text-gray-500 text-sm">
                    <p>{formatDateTime(order.orderDateTime)}</p>
                    <p>{order.itemCount} items</p>
                  </CardContent> */}
                  <hr className="border border-gray-600" />
                  <CardFooter className="flex justify-between items-center font-bold">
                    <p>Total</p>
                    <p>{formatCurrency(order.total_price)}</p>
                  </CardFooter>
                </Card>
              </Link>
            ))}
        </div>
      </Container>
    </>
  );
};

export default Orders;
