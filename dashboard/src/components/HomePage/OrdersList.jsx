import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrderStore } from "@/stores/useOrderStore";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import OrdersFilter from "./OrdersFilter";
import { useNavigate } from "react-router-dom";

const OrdersList = () => {
  const orders = useOrderStore((state) => state.orders);
  const orderLoading = useOrderStore((state) => state.loading);
  const orderError = useOrderStore((state) => state.error);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    waiter: "",
    table: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Apply filters whenever filters or orders change
  useEffect(() => {
    let filtered = orders;

    if (filters.status) {
      filtered = filtered.filter(
        (o) =>
          o.payment_status &&
          o.payment_status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.waiter) {
      filtered = filtered.filter(
        (o) => {
          const waiterName = (o.waiter_name || "").toLowerCase();
          const waiterId = (o.waiter || "").toLowerCase();
          const target = filters.waiter.toLowerCase();
          return waiterName === target || waiterId === target;
        }
      );
    }

    if (filters.table) {
      filtered = filtered.filter(
        (o) =>
          String(o.table_number ?? o.table ?? "").toLowerCase() ===
          filters.table.toLowerCase()
      );
    }

    setFilteredOrders(filtered);
  }, [filters, orders]);

  const statusOptions = useMemo(() => {
    const unique = new Set(
      orders
        .map((order) => order.payment_status)
        .filter((status) => typeof status === "string" && status.length > 0)
    );
    return Array.from(unique);
  }, [orders]);

  return (
    <>
      <TableCaption className="text-lg font-bold flex justify-between items-center">
        <p>Orders</p>
        <div>
          <Button
            variant="link"
            onClick={() => setFilters({ status: "", waiter: "", table: "" })}
          >
            Clear Filters
          </Button>
          <Button variant="link" onClick={() => navigate("/orders")}>
            View All
          </Button>
        </div>
      </TableCaption>

      {/* Pass filters + setter to child */}
      <OrdersFilter
        filters={filters}
        setFilters={setFilters}
        statuses={statusOptions}
      />

      <Table className="px-4" maxHeight="25rem">
        <TableHeader>
          <TableRow className="h-10 font-bold">
            <TableHead className="w-[100px] text-xl font-bold">ID</TableHead>
            <TableHead className="text-xl font-bold">Table</TableHead>
            <TableHead className="text-xl font-bold">Waiter</TableHead>
            <TableHead className="text-right text-xl font-bold">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-none">
          {orderLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Loading orders…
              </TableCell>
            </TableRow>
          ) : orderError ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-red-500">
                Failed to load orders
              </TableCell>
            </TableRow>
          ) : filteredOrders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            filteredOrders.map((order) => (
              <TableRow key={order.name} className="h-10">
                <TableCell className="font-medium">{order.name}</TableCell>
                <TableCell>
                  {order.table_number
                    ? `Table ${order.table_number}`
                    : "Unassigned"}
                </TableCell>
                <TableCell>
                  {order.waiter_name ? order.waiter_name : "Unassigned"}
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={
                      typeof order.payment_status === "string"
                        ? order.payment_status.toLowerCase()
                        : "secondary"
                    }
                  >
                    {order.payment_status || "Unknown"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default OrdersList;
