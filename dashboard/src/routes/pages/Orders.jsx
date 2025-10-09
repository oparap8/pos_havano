import Container from "@/components/Shared/Container";
import { useEffect, useState } from "react";
import { getOrderListDetails } from "@/api";
import {
  Card,
  CardFooter,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/utils";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderDetails = await getOrderListDetails();
        console.log(orderDetails);
        setOrders(orderDetails);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Container>
        <div className="flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold text-primary">Orders</h1>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {orders
            .filter((order) => order.status !== "Paid")
            .map((order) => (
              <Link to={`/menu/?orderId=${order.id}`} key={order.id}>
                <Card
                >
                  <CardHeader className="flex justify-between items-center">
                    <p>
                      {order.id} / {order.tableNumber}
                    </p>
                    <Badge variant={order.status.toLowerCase()}>
                      {order.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center text-gray-500 text-sm">
                    <p>{formatDateTime(order.orderDateTime)}</p>
                    <p>{order.itemCount} items</p>
                  </CardContent>
                  <hr className="border border-gray-600" />
                  <CardFooter className="flex justify-between items-center font-bold">
                    <p>Total</p>
                    <p>${order.totalAmount}</p>
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
