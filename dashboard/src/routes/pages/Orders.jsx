import Container from "@/components/Shared/Container";
import { useEffect, useMemo, useState } from "react";
import { useOrderStore } from "@/stores/useOrderStore";
import {
  Card,
  CardFooter,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import Error from "@/components/Error";
import Loader from "@/components/Loader";
import OrderDetailsDialog from "@/components/Shared/OrderDetailsDialog";

const ALL_OPTION = "__all__";

const Orders = () => {
  const { orders, loading: orderLoading, error: orderError, fetchOrders } =
    useOrderStore();
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [waiterFilter, setWaiterFilter] = useState(ALL_OPTION);
  const [statusFilter, setStatusFilter] = useState("Unpaid");
  console.log(orders);

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusOptions = useMemo(() => {
    const statuses = new Set();
    orders.forEach((order) => {
      if (order.payment_status) {
        statuses.add(order.payment_status);
      }
    });
    return Array.from(statuses);
  }, [orders]);

  const waiterOptions = useMemo(() => {
    const waiters = new Map();
    orders.forEach((order) => {
      if (order.waiter) {
        waiters.set(order.waiter, order.waiter_name || order.waiter);
      } else if (order.waiter_name) {
        waiters.set(order.waiter_name, order.waiter_name);
      }
    });
    return Array.from(waiters.entries());
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (statusFilter !== ALL_OPTION && order.payment_status !== statusFilter) {
        return false;
      }

      const orderWaiterValue = order.waiter || order.waiter_name || "";
      if (waiterFilter !== ALL_OPTION && orderWaiterValue !== waiterFilter) {
        return false;
      }

      return true;
    });
  }, [orders, statusFilter, waiterFilter]);

  useEffect(() => {
    if (
      statusFilter !== ALL_OPTION &&
      !statusOptions.includes(statusFilter)
    ) {
      setStatusFilter(ALL_OPTION);
    }
  }, [statusOptions, statusFilter]);

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
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Filter by waiter</p>
              <Select
                value={waiterFilter}
                onValueChange={(value) => setWaiterFilter(value)}
              >
                <SelectTrigger className="w-40 bg-secondary-background">
                  <SelectValue placeholder="All waiters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_OPTION}>All waiters</SelectItem>
                  {waiterOptions.length === 0 ? (
                    <SelectItem value="__no_waiters__" disabled>
                      No waiters found
                    </SelectItem>
                  ) : (
                    waiterOptions.map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Filter by status</p>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-40 bg-secondary-background">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_OPTION}>All statuses</SelectItem>
                  {statusOptions.length === 0 ? (
                    <SelectItem value="__no_statuses__" disabled>
                      No statuses found
                    </SelectItem>
                  ) : (
                    statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {filteredOrders.map((order) => (
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
                    order.table_number ? "/ Table " + order.table_number : ""
                  }`}
                </p>
                {order.payment_status && (
                  <Badge variant={order.payment_status.toLowerCase()}>
                    {order.payment_status}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="flex justify-between text-gray-500 text-sm">
                <p className="font-bold">{order.waiter_name || order.waiter}</p>
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
